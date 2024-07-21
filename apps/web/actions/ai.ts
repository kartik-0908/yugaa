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
    const aiChats = await db.aIEscalatedTicket.findUnique({
        where: {
            id: ticketId
        },
        include: {
            AIConversationTicket: {
                include: {
                    Message: true
                }
            }
        }
    })

    const events = await db.aIEscalatedTicketEvent.findMany({
        where: {
            aiEscalatedTicketId: ticketId,
        },
        orderBy: {
            createdAt: 'asc',
        },
        include: {
            Email: true
        }
    });

    let result = '';
    let skippable = 0;
    let length = events.length;
    if (aiChats) {
        length += aiChats.AIConversationTicket.Message.length;
        if (type === 'latest') {
            skippable = length / 2;
        }
        for (const message of aiChats.AIConversationTicket.Message) {
            skippable--;
            if (skippable <= 0) {
                result += `sender : ${message.sender} \n message: ${message.message} \n ######### \n `;
            }
        }
    }

    console.log(result)

    if (events) {
        for (const event of events) {
            skippable--;
            if (skippable <= 0) {
                if (event.type === 'EMAIL_SENT') {
                    result += `event: Email send to User  message: ${event.Email?.text}\n ######### \n`;
                }
                else if (event.type === 'EMAIL_RECEIVED') {
                    result += `event: Email received from User  message: ${event.Email?.text}\n ######### \n`;
                }
            }

        }
    }

    console.log(result)


    let shop = aiChats?.shopDomain
    if (shop) {
        shop = shop.replace('.myshopify.com', '');
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