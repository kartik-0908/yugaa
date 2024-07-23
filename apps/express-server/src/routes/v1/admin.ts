import { Router } from 'express';
import { db } from '../../common/db';
import { of } from 'svix/dist/openapi/rxjsStub';
import { all } from 'axios';
const express = require('express');
const router = Router();
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
});

router.use(express.json())
router.post('/verify', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'code is required' });
    }
    // console.log(code)
    const shopDomain = await db.shopifyInstalledShop.findMany({
        where: {
            adminInviteCode: code
        }
    })
    console.log(shopDomain)
    return res.json({ shopDomain });
});

router.post('/access-token', async (req, res) => {
    const { shopDomain } = req.body;
    console.log(shopDomain)
    try {
        const token = await db.shopifyInstalledShop.findUnique({
            where: {
                shop: shopDomain
            },
            select: {
                accessToken: true
            }
        })
        if (!token) {
            res.status(400).json({
                "message": "token not found"
            })
            return;
        }
        res.json({
            accessToken: token?.accessToken
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            "message": "error"
        })
    }
})

router.post('/settings', async (req, res) => {
    const { shopDomain } = req.body;
    console.log(shopDomain)
    try {
        const settings = await db.chatbotCustomization.findUnique({
            where: {
                shopDomain: shopDomain,
            },
            select: {
                selectedColor: true,
                botName: true,
                fontColor: true,
                widgetPosition: true,
                fontFamily: true,
                logo: true,
                greetingMessage: true
            },
        });
        if (!settings) {
            res.status(400).json({
                "message": "settings not found"
            })
            return;
        }
        res.json(settings)
    } catch (error) {
        console.log(error)
        res.status(400).json({
            "message": "error"
        })
    }
})

router.get('/ai-tickets', async (req, res) => {
    const { shop, start, end } = req.query
    if (typeof shop !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ message: "Invalid query parameters" });
    }
    try {
        const tickets = await db.ticket.findMany({
            where: {
                shopDomain: shop || "",
                createdAt: {
                    gte: new Date(start),
                    lte: new Date(end),
                },
                events: {
                    some: {
                        type: {
                            in: ['AI_TO_USER', 'USER_TO_AI']
                        }
                    }
                }
            },
            select: {
                id: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        })
        res.json({ tickets })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.get('/total-interaction', async (req, res) => {
    const { shop, start, end } = req.query
    console.log(req.query)
    if (typeof shop !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ message: "Invalid query parameters" });
    }
    try {
        const tickets = await db.ticket.findMany({
            where: {
                shopDomain: shop,
                createdAt: {
                    gte: start,
                    lte: end,
                },
                events: {
                    some: {
                        type: {
                            in: ['AI_TO_USER', 'USER_TO_AI']
                        }
                    }
                }
            },
            select: {
                id: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        })
        res.json({
            tickets
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.get('/unanswered', async (req, res) => {
    console.log("fetching for answered messages")
    const { shop, start, end } = req.query
    console.log(req.query)

    if (typeof shop !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ message: "Invalid query parameters" });
    }
    try {
        const count = await db.ticket.count({
            where: {
                shopDomain: shop,
                createdAt: {
                    gte: start,
                    lte: end
                },
                events: {
                    some: {
                        type: 'AI_TO_USER',
                        'AI_TO_USER': {
                            isNot: {
                                unanswered: true
                            }

                        }
                    }
                }
            },


        });
        res.json({
            count
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})
router.get('/answered', async (req, res) => {
    console.log("fetching for answered messages")
    const { shop, start, end } = req.query
    console.log(req.query)

    if (typeof shop !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ message: "Invalid query parameters" });
    }
    try {
        const count = await db.ticket.count({
            where: {
                shopDomain: shop,
                createdAt: {
                    gte: start,
                    lte: end
                },
                events: {
                    some: {
                        type: 'AI_TO_USER',
                        'AI_TO_USER': {
                            NOT: {
                                unanswered: true
                            }
                        }
                    }
                }
            },
        });
        res.json({
            count
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.get('/count-ai-tickets', async (req, res) => {
    const { shop, start, end } = req.query

    if (typeof shop !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ message: "Invalid query parameters" });
    }
    try {
        const count = await db.ticket.count({
            where: {
                shopDomain: shop,
                createdAt: {
                    gte: start,
                    lte: end,
                },
                events: {
                    some: {
                        type: 'AI_TO_USER'
                    }
                }
            },
        })
        // console.log(count)
        res.json({
            count
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.get('/avg-session', async (req, res) => {
    console.log("fetching for analytics total tickets")
    const { shop, start, end } = req.query
    console.log(req.query)

    if (typeof shop !== 'string' || typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ message: "Invalid query parameters" });
    }
    try {
        const tickets = await db.ticket.findMany({
            where: {
                shopDomain: shop,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                events: {
                    where: {
                        type: {
                            in: ['AI_TO_USER', 'USER_TO_AI']
                        }
                    }
                }
            }
        });
        let totalDifference = 0;
        let totalTickets = 0;

        tickets.forEach(ticket => {
            if (ticket && ticket.events && ticket.events.length > 1) {
                const firstMessageTime = new Date(ticket.events[0]?.createdAt ?? 0).getTime();
                const lastMessageTime = new Date(ticket.events[ticket.events.length - 1]?.createdAt ?? 0).getTime();
                const differenceInSeconds = (lastMessageTime - firstMessageTime) / 1000;
                totalDifference += differenceInSeconds;
                totalTickets += 1;
            }
        });

        const avgSession = totalTickets > 0 ? totalDifference / totalTickets : 0;
        res.json({
            avgSession
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

// router.post('/transfer-rate', async (req, res) => {
//     console.log("fetching for analytics transfer rate")
//     const { startTime } = req.body
//     const { endTime } = req.body
//     const { shopDomain } = req.body
//     console.log(startTime)
//     console.log(endTime)
//     console.log(shopDomain)
//     try {
//         const totalTickets = await db.aIConversationTicket.count({
//             where: {
//                 shopDomain: shopDomain,
//                 createdAt: {
//                     gte: startTime,
//                     lte: endTime,
//                 },
//             },
//         });

//         const escalatedTickets = await db.aIConversationTicket.count({
//             where: {
//                 shopDomain: shopDomain,
//                 createdAt: {
//                     gte: startTime,
//                     lte: endTime,
//                 },
//                 AIEscalatedTicket: {
//                     some: {}, // This checks if there is at least one related AIEscalatedTicket
//                 },
//             },
//         });

//         let ratio = totalTickets > 0 ? escalatedTickets / totalTickets : 0;
//         ratio *= 100;
//         res.json({
//             ratio
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({
//             "message": "Technical Error"
//         })
//     }
// })

router.post('/customizations', async (req, res) => {
    console.log("fetching customizations")
    const { shopDomain } = req.body
    console.log(shopDomain)
    try {

        const settings = await db.chatbotCustomization.findUnique({
            where: {
                shopDomain: shopDomain
            }
        })
        res.json({
            settings
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.post('/customizations', async (req, res) => {
    console.log("fetching customizations")
    const { shopDomain } = req.body
    console.log(shopDomain)
    try {

        const settings = await db.chatbotCustomization.findUnique({
            where: {
                shopDomain: shopDomain
            }
        })
        res.json({
            settings
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})
router.post('/appearance', async (req, res) => {
    console.log("fetching customizations")
    const { shopDomain, selectedColor, botName, fontFamily, fontColor, widgetPosition } = req.body
    console.log(shopDomain)
    try {
        await db.chatbotCustomization.update({
            where: {
                shopDomain: shopDomain
            },
            data: {
                selectedColor,
                botName,
                fontFamily,
                fontColor,
                widgetPosition
            }
        })
        res.json({
            "message": "success"
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})
router.post('/appearance/logo', async (req, res) => {
    console.log("fetching customizations")
    const { shopDomain, logourl, filename } = req.body
    console.log(shopDomain)
    try {
        await db.chatbotCustomization.update({
            where: {
                shopDomain: shopDomain
            },
            data: {
                logo: logourl,
                logo_filename: filename
            }
        })
        res.json({
            "message": "success"
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.post('/language', async (req, res) => {
    console.log("fetching customizations")
    const { shopDomain, toneAndStyle, positiveReinforcement, errorHandling, politeness, clarityAndSimplicity, personalization } = req.body
    console.log(shopDomain)
    try {
        await db.chatbotCustomization.update({
            where: {
                shopDomain: shopDomain
            },
            data: {
                toneAndStyle,
                positiveReinforcement,
                errorHandling,
                politeness,
                clarityAndSimplicity,
                personalization
            }
        })
        res.json({
            "message": "success"
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.post('/behaviour', async (req, res) => {
    console.log("fetching customizations")
    const { shopDomain, responseLength, clarificationPrompt, apologyAndRetryAttempt, errorMessageStyle, greetingmessage } = req.body
    console.log(shopDomain)
    try {
        await db.chatbotCustomization.update({
            where: {
                shopDomain: shopDomain
            },
            data: {
                responseLength,
                clarificationPrompt,
                apologyAndRetryAttempt,
                errorMessageStyle,
                greetingMessage: greetingmessage
            }
        })
        res.json({
            "message": "success"
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.post('/chat', async (req, res) => {
    console.log("fetching chat list")
    const { shopDomain, offset, count } = req.body
    console.log(shopDomain)
    try {
        const retcount = await db.ticket.count({
            where: {
                shopDomain: shopDomain,
                events: {
                    some: {
                        type: {
                            in: ['AI_TO_USER', 'USER_TO_AI']
                        }
                    }
                }
            },
        });
        const tickets = await db.ticket.findMany({
            skip: offset,
            take: count,
            where: {
                shopDomain: shopDomain
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                events: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                    select: {
                        type: true,
                        id: true,
                        createdAt: true,
                        'AI_TO_USER': true,
                        'USER_TO_AI': true
                    },
                }
            },
        });
        res.json({
            retcount, tickets
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.post('/completeChat', async (req, res) => {
    console.log("fetching chat list")

    const { id } = req.body
    try {
        const ticket = await db.ticketEvents.findMany({
            where: {
                ticketId: id
            },
            select: {
                type: true,
                AI_TO_USER: true,
                USER_TO_AI: true,
                createdAt: true
            }
        })
        res.json({
            ticket
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})

router.post('/feature-request', async (req, res) => {
    const { shortdesc, message, category, shopDomain } = req.body
    console.log(req.body)
    try {
        await db.featureRequest.create({
            data: {
                shop: shopDomain,
                description: shortdesc,
                details: message,
                category: category
            }
        })

        res.json({
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            "message": "Technical Error"
        })
    }
})


// router.post('/getEscTicketwithId', async (req, res) => {
//     const { id } = req.body
//     try {
//         const escalatedTicket = await db.aIEscalatedTicket.findUnique({
//             where: { id: id },
//             include: {
//                 AIEscalatedTicketEvent: {
//                     orderBy: { createdAt: 'asc' },
//                 },
//                 AIConversationTicket: {
//                     include: {
//                         Message: {
//                             orderBy: { createdAt: 'asc' },
//                         },
//                     },
//                 },
//             },
//         });
//         res.json({
//             escalatedTicket
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({
//             "message": "Technical Error"
//         })
//     }
// })

// router.post('/getEscTicketEvents', async (req, res) => {
//     const { id } = req.body
//     console.log(id)
//     try {
//         const events = await db.aIEscalatedTicketEvent.findMany({
//             where: {
//                 aiEscalatedTicketId: id
//             },
//             orderBy: {
//                 createdAt: 'asc',
//             },
//             include: {
//                 Email: true,
//             }

//         });
//         // console.log(events)
//         res.json({
//             events
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({
//             "message": "Technical Error"
//         })
//     }
// })

// router.get('/getEscTicketEvents', async (req, res) => {
//     const { id } = req.query
//     if (typeof id !== 'string') {
//         return res.status(400).json({ message: "Invalid query parameters" });
//     }
//     console.log(id)
//     try {
//         const events = await db.aIEscalatedTicketEvent.findMany({
//             where: {
//                 aiEscalatedTicketId: id
//             },
//             orderBy: {
//                 createdAt: 'asc',
//             },
//             include: {
//                 Email: true,
//             }

//         });
//         // console.log(events)
//         res.json({
//             events
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({
//             "message": "Technical Error"
//         })
//     }
// })
module.exports = router;