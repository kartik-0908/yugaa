import { Router } from 'express';
const userRouter = require('../v1/user');
const shopifyRouter = require('../v1/shopify');
const adminRouter = require('../v1/admin');
const emailRouter = require('../v1/email');
const receiveEmailRouter = require('../v1/receiveEmail');
const escTicketRouter = require('../v1/escTicket');
const cronRouter = require('../v1/cron');

const router = Router();

router.use('/user', userRouter);
router.use('/shopify', shopifyRouter);
router.use('/admin', adminRouter);
router.use('/email', emailRouter);
router.use('/receiveEmail', receiveEmailRouter);
router.use('/escTicket', escTicketRouter);
router.use('/cron', cronRouter);

module.exports = router;
