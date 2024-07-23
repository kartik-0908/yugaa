import db from "../lib/db";

export async function fetchRecentChats(shopDomain: string) {
    try {
        return await db.ticket.findMany({
            where: {
                shopDomain: shopDomain
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                events: {
                    where: {
                        type: {
                            in: ['AI_TO_USER', 'USER_TO_AI']
                        }
                    },
                    include: {
                        AI_TO_USER: true,
                        USER_TO_AI: true
                    }
                }
            },
            take: 3
        })

    } catch (error) {
        return null
    }
}