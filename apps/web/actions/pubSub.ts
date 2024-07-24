import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub({
    projectId: "yugaa-424705",
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
    },
});

export async function pubslishUrl(type: string, id: number) {
    const topicName = 'process-url';
    const dataBuffer = Buffer.from(JSON.stringify({
        id: id,
        type: type
    }));
    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error);
    }
}

export async function pubslishDoc(type: string, id: number) {
    const topicName = 'process-doc';
    const dataBuffer = Buffer.from(JSON.stringify({
        id: id,
        type: type
    }));
    try {
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published to ${topicName}.`);
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error);
    }
}
