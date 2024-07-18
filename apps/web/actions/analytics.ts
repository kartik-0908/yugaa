"use server"
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import db from './db';

export async function getUsers(shopDomain: string) {
    console.log(shopDomain)
    const users = await db.user.findMany({
        where: {
            shopDomain: shopDomain
        },
        select: {
            availabe: true,
            shopDomain: true,
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
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
            assignedToId: {
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
            assignedToId: {
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
                { assignedToId: { in: users } },
                {
                    NOT: {
                        AIEscalatedTicketEvent: {
                            some: {
                                AND: [
                                    { type: "EMAIL_SENT" },
                                    { changedBy: { in: users } },
                                    {
                                        createdAt: {
                                            lt: new Date(new Date().getTime() + sec * 1000)
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

export async function getQueriesbyCategory(data: string): Promise<number[]> {
    const { users, start, end } = JSON.parse(data);
    console.log("inside get query categories");
    console.log(data);

    const categories = [
        "Product inquiry",
        "Order issue",
        "Technical support",
        "Account query",
        "Billing issue",
        "Policy query",
        "Compliance inquiry"
    ];

    const count = await db.aIEscalatedTicket.groupBy({
        by: ["category"],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: new Date(start),
                lte: new Date(end)
            },
            assignedToId: {
                in: users
            }
        }
    });
    console.log(`count: ${JSON.stringify(count)}`);

    const result: Record<string, number> = {};
    categories.forEach(category => {
        result[category] = 0;
    });
    result['Others'] = 0;

    count.forEach((item) => {
        if (item.category) {
            if (categories.includes(item.category)) {
                result[item.category] = item._count.id;
            }
        }
    });

    console.log(`result: ${JSON.stringify(result)}`);

    // Convert the result object to an array in the specified order
    const resultArray: number[] = [
        ...categories.map(category => result[category] || 0),
        result['Others'] || 0
    ];

    return resultArray;
}

export async function getUserWorkload(data: string) {
    const { users, start, end } = JSON.parse(data);

    const workloadData = await db.aIEscalatedTicket.groupBy({
        by: ['assignedToId'],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: new Date(start),
                lte: new Date(end)
            },
            assignedToId: {
                in: users,
                not: null
            }
        }
    });

    const userDetails = await db.user.findMany({
        where: {
            id: {
                in: users
            }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true
        }
    });

    const userMap = new Map(userDetails.map(user => [user.id, user]));

    const result = workloadData.map(item => {
        if (item.assignedToId === null) return null;
        const user = userMap.get(item.assignedToId);
        return {
            name: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
            workload: item._count.id
        };
    });

    users.forEach((userId: any) => {
        const user = userMap.get(userId);
        if (user && !result.some((item: any) => item.name === `${user.firstName} ${user.lastName}`)) {
            result.push({
                name: `${user.firstName} ${user.lastName}`,
                workload: 0
            });
        }
    });

    return result;
}

export async function getQueriesbyStatus(data: string): Promise<number[]> {
    const { users, start, end } = JSON.parse(data);
    console.log("inside get query status");
    console.log(data);

    const categories = [
        "Queued",
        "In Progress",
        "Resolved",
    ];

    const count = await db.aIEscalatedTicket.groupBy({
        by: ["status"],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: new Date(start),
                lte: new Date(end)
            },
            assignedToId: {
                in: users
            }
        }
    });
    console.log(`count: ${JSON.stringify(count)}`);

    const result: Record<string, number> = {};
    categories.forEach(category => {
        result[category] = 0;
    });
    result['Others'] = 0;

    count.forEach((item) => {
        if (item.status) {
            if (categories.includes(item.status)) {
                result[item.status] = item._count.id;
            }
        }
    });

    console.log(`result: ${JSON.stringify(result)}`);

    // Convert the result object to an array in the specified order
    const resultArray: number[] = [
        ...categories.map(category => result[category] || 0),
        result['Others'] || 0
    ];

    return resultArray;
}

export async function getQueriesbyPriority(data: string): Promise<number[]> {
    const { users, start, end } = JSON.parse(data);
    console.log("inside get query status");
    console.log(data);

    const categories = [
        "Low",
        "Medium",
        "High",
    ];

    const count = await db.aIEscalatedTicket.groupBy({
        by: ["priority"],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: new Date(start),
                lte: new Date(end)
            },
            assignedToId: {
                in: users
            }
        }
    });
    console.log(`count: ${JSON.stringify(count)}`);

    const result: Record<string, number> = {};
    categories.forEach(category => {
        result[category] = 0;
    });
    result['Others'] = 0;

    count.forEach((item) => {
        if (item.priority) {
            if (categories.includes(item.priority)) {
                result[item.priority] = item._count.id;
            }
        }
    });

    console.log(`result: ${JSON.stringify(result)}`);

    // Convert the result object to an array in the specified order
    const resultArray: number[] = [
        ...categories.map(category => result[category] || 0),
        result['Others'] || 0
    ];

    return resultArray;
}

export async function fetchNotifications(userId: string) {
    const notifications = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            notifications: {
                include: {
                    notification: true
                }
            }
        }
    })
    console.log(notifications)
    return notifications?.notifications;
}


export async function handleSubmit(state: any, formdata: FormData) {
    const shop = formdata.get("shopDomain")
    const email = formdata.get("email")
    const role = formdata.get("role")
    console.log(shop)
    console.log(email)
    console.log(role)
    console.log("before resposne")

    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/invite`, {
        shop,
        email,
        role
    })
    revalidatePath("/verify")
    console.log("after validating")

    // console.log(res)

    if (res.data.message === "ok") {
        return { status: "success" }
    }
    if (res.data.message === "error") {
        return { status: "error" }
    }
    return { status: "hey" }
}