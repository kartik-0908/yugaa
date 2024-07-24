import { Router } from 'express';
import { db } from '../../common/db';
import { pubslishDoc, pubslishUrl } from '../../common/pubsubPublisher';
const sgMail = require('@sendgrid/mail');
const express = require('express');
const router = Router();

router.use(express.json())

router.get('/kb', async () => {

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
            status: "pending",
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
    return Response.json({ "message": "ok" });
})

module.exports = router;