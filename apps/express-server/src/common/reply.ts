require('dotenv').config();
import { ChatOpenAI } from "@langchain/openai";
import { END, START } from "@langchain/langgraph";
import { SqliteSaver } from "@langchain/langgraph/checkpoint/sqlite"
import { AIMessage, AIMessageChunk, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { StateGraphArgs } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph } from "@langchain/langgraph";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt"
import { ChatGenerationChunk } from "@langchain/core/outputs";
import { retrieverTool } from "./tools/retriever";
import { TicketEscalatorTool } from "./tools/ticketescalator";
import { pubslishStoreEvent } from "./pubsubPublisher";
import { ioCache } from "./ioCache";

export const chatModel = new ChatOpenAI(

  {
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_CHAT_DEPLOYMENT_NAME,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_CHAT_VERSION,
    model: "gpt-4o"
  }
);
export interface IState {
  messages: BaseMessage[]
}
const graphState: StateGraphArgs<IState>["channels"] = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
};

const assistantPrompt = `
You are a helpful customer support assistant for a brand called {shopDomain}.
Use the provided tools to search for the information regarding the company to solve the user's query.

If user is not satisfied then ask for more information from user to answer their query.
Even then if unable to answer ask user if you can escalate ticket to a human operator.
If User agrees then use the escalation tool to escalate the ticket.


Strictly dont put any links in the response.

Make crisps answers from Knowledge Base.
Just dont put everything in the response.
Ask User counter questions for better formulation of response

You are not allowed to discuss anything not related to brand.

Insert '\n' at the end of each line of response


`
const prompt = ChatPromptTemplate.fromMessages([
  ["system", assistantPrompt],
  new MessagesPlaceholder("messages")
])

const temp = prompt.pipe(chatModel.bindTools([retrieverTool, TicketEscalatorTool]))
async function agent(state: IState, config?: RunnableConfig,) {
  const { messages } = state;
  const shopDomain = config?.configurable?.shopDomain
  const response = await temp.invoke({ messages: messages, shopDomain: shopDomain }, config);
  await pubslishStoreEvent(config?.configurable?.thread_id, JSON.stringify({ "type": "AI_TO_USER", "message": response.content as string, createdAt: new Date() }));;
  return { messages: [response] };
};

const workflow = new StateGraph<IState, unknown, string>({
  channels: graphState,
})

  .addNode("agent", agent)
  .addNode("safeTools", new ToolNode([retrieverTool]))
  .addNode("sensitiveTools", new ToolNode([TicketEscalatorTool]))
  .addConditionalEdges("agent", routeTools)
  .addEdge("safeTools", "agent")
  .addEdge("sensitiveTools", "agent")


workflow.addEdge(START, "agent");
type NextNode = 'safeTools' | 'sensitiveTools' | '__end__';
function routeTools(state: IState): NextNode {
  const next_node = toolsCondition(state);
  if (next_node === '__end__') {
    return END;
  }
  const ai_message = state.messages[state.messages.length - 1] as AIMessage;
  const first_tool_call = ai_message.tool_calls;
  if (first_tool_call && first_tool_call[0]?.name === "TicketEscalatorTool") {
    return 'sensitiveTools';
  }
  return 'safeTools';
}


const memory = SqliteSaver.fromConnString(process.env.SQLITE_URL || "/home/ubuntu/sqlite/maindb.sqlite");
const persistentGraph = workflow.compile({ checkpointer: memory, interruptBefore: ["sensitiveTools"] });


export async function replytriaal(ticketId: string, query: string, shopDomain: string, io: any, isContinue: boolean) {
  let output: { [key: string]: string } = {};
  io.emit('status', { "status": "thinking" });

  ioCache.set(ticketId, io);
  await pubslishStoreEvent(ticketId, JSON.stringify({ "type": "USER_TO_AI", "message": query, createdAt: new Date() }));;
  let config = { configurable: { thread_id: ticketId, shopDomain: trimMyShopifyDomain(shopDomain) } };
  let inputs;
  if (isContinue) {
    inputs = null
  }
  else {
    inputs = { messages: new HumanMessage(query) };
  }

  try {
    for await (
      const event of await persistentGraph.streamEvents(inputs, {
        ...config,
        streamMode: "values",
        version: "v1",
      })
    ) {
      if (event.event === "on_llm_stream") {
        let chunk: ChatGenerationChunk = event.data?.chunk;
        let msg = chunk.message as AIMessageChunk

        if (msg.id) {
          const key: string = msg.id;
          if (msg.content != '') {
            if (!output[msg.id]) {
              output[msg.id] = "";
            }
            output[msg.id] += (msg.content as string)
            io.emit('streamChunk', { id: msg.id, message: output[msg.id] })
            io.emit('status', { "status": "writing", "where": "on_llm_stream" })

          }
        }
      }
      else if (event.event === "on_llm_end") {
        let msg = event.data;
        // io.emit('status', { "status": "input", "where": "on_llm_end" })
      }
    }
    let snapshot = await persistentGraph.getState(config)
    console.log(snapshot)
    if (snapshot.next.length === 0) {
      io.emit('status', { "status": "input", "where": "no next" })
      console.log("end")
    }
    if (snapshot.next[0] === 'sensitiveTools') {
      console.log(snapshot)
      const formFields = [
        { type: 'input', name: 'name', label: 'Name', placeholder: 'Enter your name' },
        { type: 'input', name: 'email', label: 'Email', placeholder: 'Enter your email' },
        {
          type: 'dropdown',
          name: 'category',
          label: 'Choose a Category',
          options: [
            { value: 'product_inquiry', label: 'Product inquiry' },
            { value: 'order_issue', label: 'Order issue' },
            { value: 'technical_support', label: 'Technical support' },
            { value: 'account_query', label: 'Account query' },
            { value: 'billing_issue', label: 'Billing issue' },
            { value: 'policy_query', label: 'Policy query' },
            { value: 'compliance_inquiry', label: 'Compliance inquiry' },
            { value: 'others', label: 'Others' }
          ]
        }
      ];

      io.emit('showInput', { fields: formFields });
    }
  }
  finally {
    ioCache.delete(ticketId);
  }
}

export function trimMyShopifyDomain(inputString: string) {
  const suffix = ".myshopify.com";
  if (inputString.endsWith(suffix)) {
    return inputString.slice(0, -suffix.length);
  }
  return inputString;
}