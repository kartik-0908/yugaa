import { pubslishDoc, pubslishUrl } from "../../../../actions/pubSub";
import db from "../../../../lib/db";

export async function GET() {

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
        await pubslishUrl( "add", url.id);

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
            await pubslishDoc( "add", doc.id);
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
            await pubslishDoc( "deleting", doc.id);
        }
    })
    return Response.json({ "message": "ok" });
}