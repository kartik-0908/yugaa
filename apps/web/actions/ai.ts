'use server';
import { PrismaClient } from '@repo/db';
const db = new PrismaClient();
import { streamText, } from 'ai';
import { azure } from '@ai-sdk/azure';
import { createStreamableValue } from 'ai/rsc';
require('dotenv').config();
// import { ChatOpenAI } from "@langchain/openai";

// const chatModel = new ChatOpenAI(
//     {
//         azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_CHAT_DEPLOYMENT_NAME,
//         azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
//         azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
//         azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_CHAT_VERSION,
//         model: "gpt-4o"
//     }
// );


export async function generate(input: string) {
    const stream = createStreamableValue('');
    console.log(input);

    (async () => {
        const { textStream } = await streamText({
            model: azure('yugaa-gpt4o'),
            prompt: `Given the message, enhance the formating to send it to the customer. Only Response with the message\n\n${input}`,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}
export async function generatelatestSum(ticketId: string) {
    const stream = createStreamableValue('');

    const prompt = await combineChatAndEvents(ticketId, 'latest');

    (async () => {
        const { textStream } = await streamText({
            model: azure('yugaa-gpt4o'),
            prompt: prompt,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}
async function combineChatAndEvents(ticketId: string, type: 'latest' | 'complete' | 'suggest') {
    const shop = await db.ticket.findUnique({
        where: {
            id: ticketId
        },
        select: {
            shopDomain: true
        }
    })
    const events = await db.ticketEvents.findMany({
        where: {
            ticketId: ticketId,
        },
        orderBy: {
            createdAt: 'asc',
        },
        select: {
            type: true,
            createdAt: true,
            EMAIL_RECEIVED: {
                select: {
                    Email: true
                }
            },
            EMAIL_SENT: {
                select: {
                    Email: true
                }
            },
            AI_TO_USER: true,
            USER_TO_AI: true
        }
    });

    let result = '';
    let skippable = 0;
    console.log(result)
    if (events) {
        for (const event of events) {
            skippable--;
            if (skippable <= 0) {
                if (event.type === 'EMAIL_SENT') {
                    result += `event: Email send to User  message: ${event.EMAIL_SENT?.Email?.text}\n ######### \n`;
                }
                if (event.type === 'EMAIL_RECEIVED') {
                    result += `event: Email received from User  message: ${event.EMAIL_RECEIVED?.Email?.text}\n ######### \n`;
                }
                if (event.type === 'AI_TO_USER') {
                    result += `event: AI to User  message: ${event.AI_TO_USER?.message}\n ######### \n`;
                }
                if (event.type === 'USER_TO_AI') {
                    result += `event: User to AI  message: ${event.USER_TO_AI?.message}\n ######### \n`;
                }
                result += `event: Ticket Escalated to Human Operator }\n ######### \n`;
            }
        }
    }

    console.log(result)
    let shopDomain = shop?.shopDomain;
    if (shopDomain) {
        shopDomain = shopDomain.replace('.myshopify.com', '');
    }
    if (type === 'suggest') {
        return result;
    }
    if (type === 'latest') {
        return `You are an AI copilot for the operators and admin of brand ${shop},You are given a ticket events, You are provided with the latest events in the tickets Only Response with the summary. Only generate answer with the help of below given events. \n\n
        <Events>
        ${(result)}
        </Events>
        `;
    }
    return `You are an AI copilot for the operators and admin of brand ${shop},You are given a ticket events, generate a summary of the events in the tickets Only Response with the summary.Only generate answer with the help of below given events\n\n
    <Events>
    ${(result)}
    </Events>
    `;

}
export async function generateSum(ticketId: string) {
    const stream = createStreamableValue('');
    const prompt = await combineChatAndEvents(ticketId, 'complete')
    console.log(prompt);

    (async () => {
        const { textStream } = await streamText({
            model: azure('yugaa-gpt4o'),
            prompt: prompt,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}
// export async function suggestResp(ticketId: string, shopDomain: string) {
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

//     const messages: BaseMessage[] = [new Huma];
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
//     return;
// }