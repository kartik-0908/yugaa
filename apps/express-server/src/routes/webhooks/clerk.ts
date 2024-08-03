import { Router } from 'express';
const router = Router();
import bodyParser from 'body-parser';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { IncomingHttpHeaders } from 'http';
import { db } from '../../common/db';
import { pushAdminNotification } from '../../common/pubsubPublisher';
const sgMail = require('@sendgrid/mail');


type EventType = "user.created" | "user.updated" | "email.created" | "*";

type Event = {
    data: {
        id: string,
        email_addresses: {
            email_address: string,
            verification: {
                status: string
            }
        }[] | [],
        first_name: string,
        last_name: string,
        last_sign_in_at: number,
        profile_image_url: string,
        created_at: number,
        updated_at: number,
        public_metadata: {
            role?: string,
            shopDomain?: string
        }
    }
    object: "event",
    type: EventType
}

router.use(bodyParser.raw({ type: 'application/json' }))

router.post('/', async function (req, res) {
    try {
        const payloadString = req.body.toString();
        // console.log(payloadString)
        const svixHeaders = req.headers;
        console.log(process.env.CLERK_WEBHOOK_SECRET_KEY)
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY || "");
        const evt: any = wh.verify(payloadString, svixHeaders as IncomingHttpHeaders & WebhookRequiredHeaders) as Event;
        console.log(evt.data)
        const { id } = evt.data;
        const { ...attributes } = evt.data;
        // console.log(attributes)
        const eventType = evt.type;
        if (eventType === 'email.created') {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const { body } = attributes;
            const { body_plain } = attributes;
            const { to_email_address } = attributes;
            console.log(to_email_address)
            const updatedBody = replaceInvitationText(body);
            const updatedBodyPlain = replaceInvitationText(body_plain);
            console.log(updatedBody)
            console.log(updatedBodyPlain)
            const msg = {
                to: to_email_address,
                from: "invite@yugaa.tech",
                subject: "Invitation From Yugaa",
                text: updatedBodyPlain,
                html: updatedBody
            };

            try {
                await sgMail.send(msg);
            } catch (error) {
                console.log(error)
            }
        }
        // Handle the webhooks
        if (eventType === 'user.updated' || eventType === 'user.created') {
            console.log(`User ${id} was ${eventType}`);
            const userData = {
                id: attributes.id,
                email: attributes?.email_addresses[0]?.email_address || "",
                firstName: attributes.first_name,
                lastName: attributes.last_name,
                lastLoginAt: new Date(attributes.last_sign_in_at),
                shopDomain: attributes.public_metadata.shopDomain, // Adjust as necessary
                emailVerified: attributes.email_addresses[0]?.verification.status === 'verified' ? new Date() : null,
                image: attributes.profile_image_url,
                createdAt: new Date(attributes.created_at),
                updatedAt: new Date(attributes.updated_at),
                role: attributes.public_metadata.role, // Adjust if you have this data
            };
            const existingUser = await db.user.findUnique({
                where: { email: userData.email },
            });
            if (existingUser) {
                const updatedUser = await db.user.update({
                    where: { email: userData.email },
                    data: userData,
                });
                console.log('User updated:', updatedUser);
            } else {
                const newUser = await db.user.create({
                    data: {
                        id: userData.id,
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        role: userData.role,
                        shopDomain: userData.shopDomain,
                        image: userData.image,
                        createdAt: userData.createdAt,
                        updatedAt: userData.updatedAt,
                        emailVerified: userData.emailVerified,
                    },
                });
                if (newUser.role === "member") {
                    await pushAdminNotification(userData.shopDomain || "", "New Operator Joined", `${newUser.firstName} ${newUser.lastName} has joined the app upon your invitation`)
                }
                console.log('User stored:', newUser);
            }
        }
        res.status(200).json({
            success: true,
            message: 'Webhook received',
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: (err as Error).message,
        });
    }
}
);

function replaceInvitationText(inputString: string): string {
    const oldText: string = "Kartik Agarwal has invited you to join them on yugaa.";
    const newText: string = "You have been invited to join Yugaa";

    return inputString.replace(oldText, newText);
}

module.exports = router;