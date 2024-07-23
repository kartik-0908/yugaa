require("dotenv").config();
import { PubSub } from '@google-cloud/pubsub';
import { db } from './db';


const pubSubClient = new PubSub({
    projectId: "yugaa-424705",
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
    },
});

export async function publishEmailMessage(fromAddress: string, recipientAddress: string, subject: string, htmlContent: string) {
    const topicName = 'email-topic';

    const dataBuffer = Buffer.from(JSON.stringify({
        fromAddress,
        recipientAddress,
        subject,
        htmlContent,
    }));

    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error);
    }
}

export async function publishShopifyStoreProcessData(shopDomain: string) {
    const topicName = 'shopify-store-process-data';
    const dataBuffer = Buffer.from(JSON.stringify({
        shopDomain
    }));
    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error);
    }
}

export async function updateProductwithID(shopDomain: string, id: string, type: string) {
    const topicName = 'update-product-with-id';
    const dataBuffer = Buffer.from(JSON.stringify({
        shopDomain,
        id,
        type: "add"
    }));
    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error);
    }
}

export async function publishStoreMssg(ticketId: string, sender: string, message: string, timestamp: Date) {
    const topicName = 'store-mssg';
    const dataBuffer = Buffer.from(JSON.stringify({
        ticketId,
        sender,
        message,
        timestamp
    }));
    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error);
    }
}

export async function publishTicketEscalate(ticketId: string, shopDomain: string, userEmail: string) {
    const topicName = 'escalate-ticket';
    const dataBuffer = Buffer.from(JSON.stringify({
        ticketId,
        shopDomain,
        userEmail
    }));
    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error);
    }
}

export async function pushIndividualNoti(userId: string, title: string, content: string) {
    const topicName = 'notifications';
    const dataBuffer = Buffer.from(JSON.stringify({
        userId,
        title: title,
        content: content
    }));
    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error);
    }
}
export async function pushAdminNotification(shopDomain: string, title: string, content: string,) {
    const topicName = 'notifications';
    const users = await db.user.findMany({
        where: {
            shopDomain: shopDomain,
            role: "admin"
        },
        select: {
            id: true
        }
    })
    for (const user of users) {
        pushIndividualNoti(user.id, title, content)
    }
}
