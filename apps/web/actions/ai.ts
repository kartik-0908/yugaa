'use server';
import { PrismaClient } from '@repo/db';
const db = new PrismaClient();
import { streamText } from 'ai';
import { azure } from '@ai-sdk/azure';
import { createStreamableValue } from 'ai/rsc';

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
async function combineChatAndEvents(ticketId: string, type: 'latest' | 'complete') {
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
                if (event.type === 'ESCALATED') {
                    result += `event: Ticket Escalated to Human Operator }\n ######### \n`;
                }
            }

        }
    }

    console.log(result)
    let shopDomain = shop?.shopDomain;
    if (shopDomain) {
        shopDomain = shopDomain.replace('.myshopify.com', '');
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
export async function suggestResp(message: string) {
    const stream = createStreamableValue('');
    console.log(message);

    (async () => {
        const { textStream } = await streamText({
            model: azure('yugaa-gpt4o'),
            prompt: `Given the message, suggest a response to the customer. Only Response with the message\n\n${message}`,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}