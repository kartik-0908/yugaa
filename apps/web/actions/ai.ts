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

    const events = await db.aIEscalatedTicketEvent.findMany({
        where: {
            id: ticketId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    (async () => {
        const { textStream } = await streamText({
            model: azure('yugaa-gpt4o'),
            prompt: `Given the events related to a ticket, genrate a summary of the latest events in the tickets Only Response with the summary\n\n${JSON.stringify(events)}`,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}


export async function generateSum(ticketId: string) {
    const stream = createStreamableValue('');

    const events = await db.aIEscalatedTicketEvent.findMany({
        where: {
            id: ticketId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    (async () => {
        const { textStream } = await streamText({
            model: azure('yugaa-gpt4o'),
            prompt: `Given the events related to a ticket, genrate a summary of the events in the tickets Only Response with the summary\n\n${(events)}`,
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