import { PubSub } from '@google-cloud/pubsub';
import db from './db';
const pubSubClient = new PubSub({
    projectId: "yugaa-424705",
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
    },
});


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
