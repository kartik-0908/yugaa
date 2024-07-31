import { Router } from 'express';
import { db } from '../../common/db';
import { pubslishDoc, pubslishUrl } from '../../common/pubsubPublisher';
const sgMail = require('@sendgrid/mail');
const express = require('express');
const router = Router();

router.use(express.json())

router.get('/kb', async (req, res) => {

    console.log("inside cron route")

    const pendingURLS = await db.url.findMany({
        where: {
            status: "pending",
            updatedAt: {
                gte: new Date(Date.now() - 1000 * 60 * 30)
            }
        },
        take: 5
    })
    console.log(pendingURLS)
    pendingURLS.map(async (url) => {
        await pubslishUrl("add", url.id);

    })
    const pendingdoc = await db.document.findMany({
        where: {
            status: "uploaded",
            updatedAt: {
                gte: new Date(Date.now() - 1000 * 60 * 30)
            }
        },
        take: 5
    })
    pendingdoc.map(async (doc) => {
        if (doc.fileUrl) {
            await pubslishDoc("add", doc.id);
        }
    })
    const deletingURLS = await db.url.findMany({
        where: {
            status: "deleting",
            updatedAt: {
                gte: new Date(Date.now() - 1000 * 60 * 30)
            }
        },
        take: 5
    })
    deletingURLS.map(async (url) => {
        await pubslishUrl("delete", url.id);

    })
    const deletingdoc = await db.document.findMany({
        where: {
            status: "deleting",
            updatedAt: {
                gte: new Date(Date.now() - 1000 * 60 * 30)
            }
        },
        take: 5
    })
    deletingdoc.map(async (doc) => {
        if (doc.fileUrl) {
            await pubslishDoc("deleting", doc.id);
        }
    })
    return res.json({ "message": "ok" });
})

router.get('/delete-tickets', async (req, res) => {
    try {

        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const ticketsToDelete = await db.ticket.findMany({
            where: {
                createdAt: {
                    lt: fortyEightHoursAgo
                }
            },
            include: {
                _count: {
                    select: { events: true }
                }
            }
        });
        const ticketIdsToDelete = ticketsToDelete
            .filter(ticket => ticket._count.events < 2)
            .map(ticket => ticket.id);

        // Now delete the filtered tickets
        const deletedTickets = await db.ticket.deleteMany({
            where: {
                id: {
                    in: ticketIdsToDelete
                }
            }
        });

        console.log(`Deleted ${deletedTickets.count} tickets.`);

        return deletedTickets.count;

    } catch (error) {

    }


    return res.json({ "message": "ok" });
})


module.exports = router;