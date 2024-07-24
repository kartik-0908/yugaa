"use server"
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

export async function peakInteraction({ shop, start, end }: { shop: string, start: string, end: string }): Promise<{ tickets: { id: string; createdAt: Date; }[], peakHour: number | null }> {
    console.log("start", start)
    console.log("end", end) 
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
        const hourCounts: { [hour: number]: number } = {};
        tickets.forEach((ticket) => {
            const hour = ticket.createdAt.getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        // Find the hour with the maximum count
        let maxCount = 0;
        let peakHour: number | null = null;
        for (const [hour, count] of Object.entries(hourCounts)) {
            if (count > maxCount) {
                maxCount = count;
                peakHour = parseInt(hour);
            }
        }
        return { tickets, peakHour }

    } catch (error) {
        console.log(error)
        return { tickets: [], peakHour: null }

    }

}