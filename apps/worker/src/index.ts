import axios from "axios";
import { sendInitialEmail } from "./common/email";
import { createMssg, productUpdate, subscribeWebhook, updateProduct } from "./common/function";
import { fetchDocs } from "./fetchDocs";
import { fetchLinks } from "./fetchLinks";
import { fetchProducts } from "./fetchProducts";
// import { getVideoTranscript } from "./fetchVideo";
import { PubSub } from '@google-cloud/pubsub';
import { chatModel } from "./lib/azureOpenai/embedding";
import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";

const pubSubClient = new PubSub({
    projectId: "yugaa-424705",
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
    },
});


require('dotenv').config();

async function startWorker() {

    try {
        console.log("Worker connected to Pub/Sub.");
        const subscriptions = [
            // { name: 'email-topic-sub', handler: handleSendEmail },
            { name: 'initialize-shop', handler: handleinitializeShop },
            { name: 'store-mssg-sub', handler: handleCreateMssg },
            { name: 'fetch-products', handler: handlefetchProduct },
            { name: 'update-product-with-id-sub', handler: handleUpdateProductwithID },
            // { name: 'escalate-ticket-sub', handler: handleEscalateTicket },
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


async function handleEscalateTicket(data: any) {
    const { shopDomain, userEmail, ticketId } = data;
    console.log(ticketId)
    const res = await axios.post(`${process.env.BASE_API_URL}/v1/admin/completeChat`, {
        id: ticketId
    })
    const { ticket } = res.data;
    const { messages } = ticket;

    const conv = formatMessages(messages);
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
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/autoAssignment`, {
        shopDomain: shopDomain
    })
    if (resp.data.isAutoAssignment){
        

    }
    else {
        await axios.post(`${process.env.WORKER_WEBHOOK_URL}/escalate-ticket`, {
            ticketId, shopDomain, userEmail, subject
        })
    }
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
async function handleSendEmail(data: any) {
    // const { shop, accessToken } = data;
    // console.log(data)
    await sendInitialEmail(data.fromAddress, data.recipientAddress, data.subject, data.htmlContent)
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

startWorker();

