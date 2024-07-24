import db from "../lib/db";

export default async function fetchLinks(shopDomain: string) {
    const res = await db.knowledgeBase.findUnique({
        where: {
            shopDomain: shopDomain
        },
        select: {
            urls: true
        }
    })
    return res;
}