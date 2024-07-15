"use server"
import { PrismaClient } from '@repo/db';

const db = new PrismaClient();

export async function getUsers(shopDomain: string) {
    console.log(shopDomain)
    const users = await db.user.findMany({
        where: {
            shopDomain: shopDomain
        }
    })
    return users
}

export async function getFcrPercentage(data: string) {
    const { userIds, start, end } = JSON.parse(data)
    const fcrTickets = await db.aIEscalatedTicket.count({
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
            fcr: true,
            fcrBy: {
                in: userIds
            }
        }
    })
    const TotalTickets = await db.aIEscalatedTicket.count({
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
            assignedTo: {
                in: userIds
            }
        }
    })
    if (TotalTickets <= 0) {
        return 0;
    }
    return ((fcrTickets / TotalTickets) * 100);
}

export async function getTransferRate(data: string) {
    const { users, start, end } = JSON.parse(data)
    const assignedTickets = await db.aIEscalatedTicket.count({
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
            assignedTo: {
                in: users
            }
        }
    })
    const TotalTickets = await db.aIEscalatedTicket.count({
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
        }
    })
    if (TotalTickets <= 0) {
        return 0;
    }
    return ((assignedTickets / TotalTickets) * 100);
}

export async function getMissed(data: string) {
    const { users, start, end } = JSON.parse(data)
    const sec = 3 * 60 * 60;
    const count = await db.aIEscalatedTicket.count({
        where: {
            AND: [
                { createdAt: { gte: start, lte: end } },
                { assignedTo: { in: users } },
                {
                    NOT: {
                        AIEscalatedTicketEvent: {
                            some: {
                                AND: [
                                    { type: "EMAIL_SENT" },
                                    { changedBy: { in: users } },
                                    {
                                        createdAt: {
                                            lt: new Date(start.getTime() + sec * 1000)
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        }
    })
    return count
}

export async function getQueriesbyCategory(data: string) {
    const { users, start, end } = JSON.parse(data)
    console.log("insdie get query caategories")
    console.log(data)
    const count = await db.aIEscalatedTicket.groupBy({
        by: ["category"],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
            assignedTo: {
                in: users
            },
            category: {
                not: null
            }
        }
    })
    console.log(count)
    const result: Record<string, number> = {};
    count.forEach((item) => {
        console.log(item)
        // if (item.category) {
        //     result[item.category] = item._count.id;
        // }
    })

    result['Uncategorized'] = 0;

    const uncategorized = await db.aIEscalatedTicket.count({
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
            assignedTo: {
                in: users
            },
            category: null
        }
    });
    if (uncategorized > 0) {
        result['Uncategorized'] += uncategorized;
    }

    console.log(`result: ${JSON.stringify(result)}`)

    return result;
}
