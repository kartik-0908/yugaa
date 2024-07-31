import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
const app = express();
const v1router = require("./routes/v1/routes")
const webhookRouter = require("./routes/webhooks/routes")
import { replytriaal } from './common/reply';
import { db } from './common/db';
import { pubslishStoreEvent } from './common/pubsubPublisher';
var cors = require('cors')
app.use(cors())
app.use('/webhooks', webhookRouter)
app.use('/v1', v1router);


app.get('/', async (req, res) => {
    console.log("inside api root")
    try {
        res.json({
            "message": "status ok"
        })
    } catch (error) {
        console.log(error);
        res.json({

            "message": "error"
        })
    }

})

app.get('/check', async (req, res) => {
    console.log("inside check root")
    console.log("process.env.hi")
    console.log(process.env.hi)
    console.log("process.env.hi_env")
    console.log(process.env.hi_env)
    console.log(process.env.DATABASE_URL)
    res.json({
        "message": "status ok inside check"
    })
})

const port = 3001;
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('sendMessage', async (data) => {
        const { ticketId, message, shopifyDomain, userInfo, timestamp } = data;
        console.log(message)
        await replytriaal(ticketId, message, shopifyDomain, io, false)
    });
    socket.on('ticketEscalate', async (data) => {
        const { ticketId, email, name, category, shopifyDomain } = data;
        console.log(data)
        await pubslishStoreEvent(ticketId, JSON.stringify({ "type": "ESCALATED", "userEmail": email, createdAt: new Date().toUTCString(), name: name, category: category }));;
        console.log('ticket escalted')
        await replytriaal(ticketId, "", shopifyDomain, io, true)
    });

    socket.on('getPreviousMessages', async (data) => {
        const { ticketId } = data;
        console.log(`Fetching previous messages for ticket ID: ${ticketId}`);
        const events = await db.ticketEvents.findMany({
            where:{
                ticketId:ticketId
            },
            orderBy:{
                createdAt:'asc'
            },
            select:{
                type:true,
                AI_TO_USER:true,
                USER_TO_AI:true,
                ESCALATED: true,
                createdAt:true
            }
        })
       
        socket.emit('previousMessages', { events });
    });
    socket.on('create-ticket', async (data) => {
        const { ticketId, shopDomain } = data;
        console.log(data)
        console.log(`Createing ticket ID: ${ticketId}`);
        const resp = await db.ticket.findUnique({
            where: {
                id: ticketId
            }
        })
        if (!resp) {
            console.log(`ticket creatinh withh ${ticketId} for ${shopDomain}`)
            await db.ticket.create({
                data: {
                    id: ticketId,
                    shopDomain: shopDomain,
                    events: {
                        create: {
                            type: 'AI_TICKET_CREATED',
                            AI_TICKET_CREATED: {
                                create: {
                                    ticketId,
                                }
                            }
                        }
                    }
                }
            })
        }

    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});