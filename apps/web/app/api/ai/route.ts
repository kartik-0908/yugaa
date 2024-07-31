// import { NextRequest } from "next/server";
// import { generateText, streamText, tool } from 'ai';
// import { azure } from '@ai-sdk/azure';
// import { createStreamableValue } from 'ai/rsc';
// require('dotenv').config();
// import { RunnableConfig } from "@langchain/core/runnables";
// import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
// import { ChatOpenAI } from "@langchain/openai";
// import { z } from 'zod';
// import { BaseMessage } from '@langchain/core/messages';

// export default async function POST(req: NextRequest) {
//     const body = await req.json()
//     const { ticketId } = body;
//     const { shopDOmain } = body;
//     console.log(ticketId)
//     console.log(shopDomain)
//     console.log(1)
//     const result = combineChatAndEvents(ticketId, 'suggest');
//     console.log(result)
//     const assistantPrompt = `
// You are an AI copilot to help the  customer support assistant for a brand called ${shopDomain}.

// You are given a conversation b/w the assistants of brand and the user below.

// <Conversation>
// ${result}
// </Conversation>

// Use the provided tools to search for the information regarding the company to solve the user's query.


// Strictly dont put any links in the response.

// Make crisps answers from Knowledge Base.
// Just dont put everything in the response.



// `
//     const prompt = ChatPromptTemplate.fromMessages([
//         ["system", assistantPrompt],
//         new MessagesPlaceholder("messages")
//     ])
//     const temp = prompt.pipe(chatModel.bindTools([retrieverTool]));

//     const messages: BaseMessage[] = [];
//     const aiMessage = await temp.invoke(messages);

//     console.log(aiMessage);

//     messages.push(aiMessage);

//     if (aiMessage.tool_calls !== undefined) {
//         for (const toolCall of aiMessage.tool_calls) {
//             const toolMessage = await retrieverTool.invoke(toolCall);
//             messages.push(toolMessage);
//         }

//         console.log(messages);
//     }
//     const res = await temp.invoke({ messages });
//     console.log(res.content)


// }