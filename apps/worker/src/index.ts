const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
import axios from "axios";
import { createMssg, productUpdate, subscribeWebhook } from "./common/function";
import { fetchProducts } from "./fetchProducts";
import { PubSub } from '@google-cloud/pubsub';
import { chatModel } from "./lib/azureOpenai/embedding";
import {  PromptTemplate } from "@langchain/core/prompts";
import { db } from "./lib/db";
import { pushAdminNotification, pushIndividualNoti } from "./common/pubsubPublisher";

const pubSubClient = new PubSub({
    projectId: "yugaa-424705",
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
    },
});



async function startWorker() {

    try {
        console.log("Worker connected to Pub/Sub.");
        const subscriptions = [
            // { name: 'email-topic-sub', handler: handleSendEmail },
            { name: 'initialize-shop', handler: handleinitializeShop },
            { name: 'store-mssg-sub', handler: handleCreateMssg },
            { name: 'fetch-products', handler: handlefetchProduct },
            { name: 'update-product-with-id-sub', handler: handleUpdateProductwithID },
            { name: 'escalate-ticket-sub', handler: handleEscalateTicket },
            { name: 'notifications-sub', handler: handleSendNotification },
        ];

        console.log(`Waiting for messages in subscriptions: ${subscriptions.map(sub => sub.name).join(', ')}...`);
        subscriptions.forEach(sub => {
            const subscription = pubSubClient.subscription(sub.name);
            subscription.on('message', async message => {
                try {
                    const data = JSON.parse(message.data.toString());
                    await sub.handler(data);
                    message.ack();
                } catch (error) {
                    console.error(`Error processing message from ${sub.name}:`, error);
                    message.nack();
                }
            });

            subscription.on('error', error => {
                console.error(`Error in subscription ${sub.name}:`, error);
            });
        });

    }
    catch (error) {
        console.error("Failed to connect to Pub/Sub", error);
    }
}

function formatMessages(messages: {
    id: string;
    ticketId: string;
    sender: string;
    message: string;
    createdAt: Date;
    unanswered: boolean;
}[]): string {
    return messages.map(msg => `${msg.sender}:\n${msg.message}\n`).join('\n');
}
const { LLMChain } = require("langchain/chains");

async function handleSendNotification(data: any) {
    const { userId, title, content } = data;

    await db.notification.create({
        data: {
            userId,
            title,
            content,
        }
    })
}


async function handleEscalateTicket(data: any) {
    const { shopDomain, userEmail, ticketId } = data;
    console.log(ticketId)
    const ticket = await db.aIConversationTicket.findUnique({
        where: {
            id: ticketId
        },
        include: {
            Message: true
        }
    })
    if (!ticket) {
        throw new Error("Ticket not found")
    }
    const conv = formatMessages(ticket?.Message);
    const assistantPrompt = `
        Given a conversation b/w a AI customer support assistant and a consumer.
        Respond with a subject which describes the complete Conversation in 4-5 words.

        <Conversation>
        {conversation}
        </Conversation>

        Respond with the subject only
        `
    const prompt = new PromptTemplate({
        template: assistantPrompt,
        inputVariables: ["conversation"]
    })
    const chain = new LLMChain({ llm: chatModel, prompt: prompt });
    const response = await chain.call({ conversation: conv });
    const subject = response.text.trim()
    const shopSetings = await db.shopifyInstalledShop.findUnique({
        where: {
            shop: shopDomain
        }
    })
    let assigneeId = null;
    let assigneeName: string;
    if (shopSetings?.autoAssignment) {
        const user = await db.user.findFirst({
            where: {
                shopDomain: shopDomain,
                availabe: true
            },
            orderBy: {
                AIEscalatedTicket: {
                    _count: 'asc'
                }
            },
            select: {
                id: true,
                firstName: true,
            }
        })
        assigneeId = user?.id;
        assigneeName = user?.firstName as string;
    }
    const shop = trimShopifyDomain(shopDomain)
    await db.$transaction(async (prisma) => {
        // Count the number of tickets for the shopDomain
        const ticketCount = await prisma.aIEscalatedTicket.count({
            where: {
                shopDomain: shopDomain,
            },
        });
        const newTicketId = `${shop}-${ticketCount + 1}`;
        const newTicket = await prisma.aIEscalatedTicket.create({
            data: {
                updatedAt: new Date(),
                id: newTicketId,
                shopDomain: shopDomain,
                customerEmail: userEmail,
                aiConversationTicketId: ticketId,
                subject: subject,
                assignedToId: assigneeId,
                status: assigneeId ? 'Queued':'Unassigned',
            },
        });
        await prisma.aIEscalatedTicketEvent.create({
            data: {
                aiEscalatedTicketId: newTicket.id,
                type: 'CREATED',
                newStatus: newTicket.status, // Assuming the status is set to a default value
            },
        });
        if (assigneeId) {
            pushAdminNotification(shopDomain, "New Ticket Raised by AI", `A new ticket has been raised by AI and assigned to ${assigneeName}`)
            pushIndividualNoti(assigneeId, "New Ticket Raised by AI", `A new ticket has been raised by AI and assigned to you`)
        }
        else {
            pushAdminNotification(shopDomain, "New Ticket Raised by AI", `A new ticket has been raised by AI. Please assign it to an operator`)
        }
        await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1);`;
    }, {
        isolationLevel: 'Serializable', // Ensuring the highest isolation level
    });
}

async function handlefetchProduct(data: any) {
    const { shopDomain } = data;
    const res = await axios.post(`${process.env.BASE_API_URL}/v1/admin/access-token`, {
        shopDomain
    })
    const { accessToken } = res.data;
    await subscribeWebhook(shopDomain, accessToken);
    await fetchProducts(shopDomain, accessToken);

}
async function handleinitializeShop(data: any) {
    const { shopDomain } = data;
    try {
        const res1 = await axios.post(`${process.env.WORKER_WEBHOOK_URL}/initialize/plan`, {
            shopDomain
        })
        const res2 = await axios.post(`${process.env.WORKER_WEBHOOK_URL}/initialize/customizations`, {
            shopDomain
        })
        const res3 = await axios.post(`${process.env.WORKER_WEBHOOK_URL}/initialize/email`, {
            shopDomain
        })
    } catch (error) {
        console.log(error)
    }
}


async function handleUpdateProductwithID(data: any) {
    const { id, shopDomain, type } = data;
    const res = await axios.post(`${process.env.BASE_API_URL}/v1/admin/access-token`, {
        shopDomain
    })
    const { accessToken } = res.data;
    await productUpdate(id, shopDomain, accessToken, type)
}

async function handleCreateTicket(data: any) {
    const { ticketId, conversationId, shop, time } = data;
    // await updateTicket(ticketId, conversationId, shop, time);
}

async function handleCreateConv(data: any) {
    const { id, shop, time } = data;
    // await createConv(shop, id, time);
}

async function handleCreateMssg(data: any) {
    const { ticketId, sender, message, timestamp } = data;
    await createMssg(ticketId, sender, message, timestamp);
}

async function handleProductUpdate(data: any) {
    const { id, shopDomain, type } = data;
    const res = await axios.post(`${process.env.BASE_API_URL}/v1/admin/access-token`, {
        shopDomain
    })
    const { accessToken } = res.data;
    await productUpdate(id, shopDomain, accessToken, type);
}

function trimShopifyDomain(url: string): string {
    const shopifySuffix = '.myshopify.com';
    if (url.endsWith(shopifySuffix)) {
        return url.slice(0, -shopifySuffix.length);
    }
    return url;
}

startWorker();

