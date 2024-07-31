import db from "../lib/db";

export async function getCodes(shopDomain: string): Promise<{ member: string, admin: string }> {
    const res = await db.shopifyInstalledShop.findUnique({
        where: {
            shop: shopDomain
        }
    })
    return { member: res?.memberInviteCode as string, admin: res?.adminInviteCode as string }
}