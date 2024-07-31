import { Router } from 'express';
import { db } from '../../common/db';
const express = require('express');
const router = Router();

router.use(express.json())

router.post('/get-members', async (req, res) => {
    console.log(req.body)
    res.json({
        "message": "ok",
    })
    return;
})

router.post('/getEmail', async (req, res) => {
    const { body } = req
    const { shopDomain } = body
    try {
        const resp = await db.shopifyInstalledShop.findUnique({
            where: {
                shop: shopDomain,
            },
        });

        const emails = resp?.email
        res.json({
            emails
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "message": "Internal server error",
        })
    }
    return;
})


module.exports = router;