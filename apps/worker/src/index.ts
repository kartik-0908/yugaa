const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
import axios from "axios";
import { productUpdate, subscribeWebhook } from "./common/function";
import { fetchProducts } from "./fetchProducts";
import { PubSub } from '@google-cloud/pubsub';
import { chatModel } from "./lib/azureOpenai/embedding";
import { PromptTemplate } from "@langchain/core/prompts";
import { db } from "./lib/db";
import { pushAdminNotification, pushIndividualNoti } from "./common/pubsubPublisher";
import { addDocs, deletDocs } from "./fetchDocs";
import { addLinks, deleteLinks } from "./fetchLinks";
const { LLMChain } = require("langchain/chains");


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
            { name: 'initialize-shop', handler: handleinitializeShop },
            { name: 'store-event-sub', handler: handleCreateEvent },
            { name: 'fetch-products', handler: handlefetchProduct },
            { name: 'update-product-with-id-sub', handler: handleUpdateProductwithID },
            { name: 'notifications-sub', handler: handleSendNotification },
            { name: 'process-doc-sub', handler: handleProcessDoc },
            { name: 'process-url-sub', handler: handleProcessUrl },
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

async function handleProcessDoc(data: any) {
    const { id, type } = data;
    if (type === 'add') {
        const res = await db.document.update({
            where: {
                id: id
            },
            data: {
                status: 'processing'
            }
        })
        if (!res.fileUrl) {
            throw new Error("File url not found")
        }
        await addDocs(res.fileUrl, res.shopDomain, res.id.toString())
    }
    if (type === 'delete') {
        await deletDocs(id)
        await db.document.update({
            where: {
                id: id
            },
            data: {
                status: 'deleted'
            }
        })
    }
}
async function handleProcessUrl(data: any) {
    const { id, type } = data;
    if (type === 'add') {
        const res = await db.url.update({
            where: {
                id: id
            },
            data: {
                status: 'processing'
            }
        })
        await addLinks(res.id, res.shopDomain, res.url)
        await db.url.update({
            where: {
                id: id
            },
            data: {
                status: 'active'
            }
        })
    }
    if (type === 'delete') {
        await deleteLinks(id)
        await db.url.update({
            where: {
                id: id
            },
            data: {
                status: 'deleted'
            }
        })
    }
}

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
        await db.knowledgeBase.create({
            data: {
                shopDomain: shopDomain
            }
        })
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

async function handleCreateEvent(data: any) {
    const { id, metadata } = data;
    const meta = JSON.parse(metadata);
    if (meta.type === 'USER_TO_AI') {
        if (meta.message !== '') {
            await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: 'USER_TO_AI',
                    'USER_TO_AI': {
                        create: {
                            message: meta.message,
                            createdAt: meta.createdAt
                        }
                    }
                }
            })
        }

    }
    if (meta.type === 'AI_TO_USER') {
        if (meta.message !== '') {
            const result = containsErrorOrSorry(meta.message);
            await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: 'AI_TO_USER',
                    'AI_TO_USER': {
                        create: {
                            message: meta.message,
                            createdAt: meta.createdAt,
                            unanswered: result
                        }
                    }
                }
            })
        }
    }
    if (meta.type === 'ESCALATED') {
        const events = await db.ticketEvents.findMany({
            where: {
                ticketId: id,
                type: {
                    in: ['USER_TO_AI', 'AI_TO_USER']
                }
            },
            include: {
                USER_TO_AI: true,
                AI_TO_USER: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        let mssg = '';

        events.map(event => {
            if (event.type === 'USER_TO_AI') {
                mssg += 'user: ' + event.USER_TO_AI?.message + '\n';
            }
            if (event.type === 'AI_TO_USER') {
                mssg += 'ai: ' + event.AI_TO_USER?.message + '\n';
            }
        })
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
        const response = await chain.call({ conversation: mssg });
        const subject = response.text.trim()
        const shop = await db.ticket.findUnique({
            where: {
                id: id
            },
            select: {
                shopDomain: true
            }
        })
        const shopSetings = await db.shopifyInstalledShop.findUnique({
            where: {
                shop: shop?.shopDomain
            }
        })
        let assigneeId = null;
        let assigneeName: string;

        if (shopSetings?.autoAssignment) {
            const user = await db.user.findFirst({
                where: {
                    shopDomain: shop?.shopDomain,
                    availabe: true
                },
                orderBy: {
                    currentActiveTickets: 'asc'
                },
                select: {
                    id: true,
                    firstName: true,
                }
            })
            assigneeId = user?.id;
            assigneeName = user?.firstName as string;
        }

        await db.$transaction(async (prisma) => {
            // Count the number of tickets for the shopDomain
            await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: 'ESCALATED',
                    'ESCALATED': {
                        create: {
                            userEmail: meta.userEmail,
                            createdAt: new Date(),
                            name: meta.name,
                            category: meta.category,
                            subject: subject,
                        }
                    }
                }
            })
            await db.ticket.update({
                where: {
                    id: id
                },
                data: {
                    category: meta.category,
                }
            })
            if (assigneeId) {
                await db.ticket.update({
                    where: {
                        id: id
                    },
                    data: {
                        assigneeId: assigneeId,
                        status: 'Queued',
                    }
                })
                await db.user.update({
                    where: {
                        id: assigneeId
                    },
                    data: {
                        currentActiveTickets: {
                            increment: 1
                        }
                    }
                })
                pushAdminNotification(shop?.shopDomain as string, "New Ticket Raised by AI", `A new ticket has been raised by AI and assigned to ${assigneeName}`)
                pushIndividualNoti(assigneeId, "New Ticket Raised by AI", `A new ticket has been raised by AI and assigned to you`)
            }
            else {
                pushAdminNotification(shop?.shopDomain as string, "New Ticket Raised by AI", `A new ticket has been raised by AI. Please assign it to an operator`)
            }
            await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1);`;
        }, {
            isolationLevel: 'Serializable', // Ensuring the highest isolation level
        });
    }
}

function containsErrorOrSorry(text: string): boolean {
    const lowercaseText = text.toLowerCase();
    return lowercaseText.includes("error") || lowercaseText.includes("sorry");
}

startWorker();

