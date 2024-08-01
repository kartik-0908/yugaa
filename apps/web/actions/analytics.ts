"use server"
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import db from '../lib/db';

export async function getUsers(shopDomain: string) {
    console.log(shopDomain)
    const users = await db.user.findMany({
        where: {
            shopDomain: shopDomain
        },
        select: {
            available: true,
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
    const fcrTickets = await db.ticket.count({
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
    const TotalTickets = await db.ticket.count({
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
            assigneeId: {
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
    const { users, start, end, shopDomain } = JSON.parse(data)
    const assignedTickets = await db.ticket.count({
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
            assigneeId: {
                in: users
            }
        }
    })
    const TotalTickets = await db.ticket.count({
        where: {
            createdAt: {
                gte: start,
                lte: end
            },
            shopDomain: shopDomain
        }
    })
    if (TotalTickets <= 0) {
        return 0;
    }
    return ((assignedTickets / TotalTickets) * 100);
}

export async function getMissed(data: string) {
    const { users, start, end } = JSON.parse(data)
    const count = await db.ticket.count({
        where: {
            missing: true,
            AND: [
                { createdAt: { gte: start, lte: end } },
                { assigneeId: { in: users } },
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
        "product_inquiry",
        "order_issue",
        "technical_support",
        "account_query",
        "billing_issue",
        "policy_query",
        "compliance_inquiry"
    ];

    const count = await db.ticket.groupBy({
        by: ["category"],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: new Date(start),
                lte: new Date(end)
            },
            assigneeId: {
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
    console.log(start, end)
    const workloadData = await db.ticket.groupBy({
        by: ['assigneeId'],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: new Date(start),
                lte: new Date(end)
            },
            assigneeId: {
                in: users,
            }
        }
    });

    console.log(workloadData)

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
        if (item.assigneeId === null) return null;
        const user = userMap.get(item.assigneeId);
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

    const count = await db.ticket.groupBy({
        by: ["status"],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: new Date(start),
                lte: new Date(end)
            },
            assigneeId: {
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

    const count = await db.ticket.groupBy({
        by: ["priority"],
        _count: {
            id: true
        },
        where: {
            createdAt: {
                gte: new Date(start),
                lte: new Date(end)
            },
            assigneeId: {
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

export async function fetchNotifications(payload: string) {
    const data = JSON.parse(payload);
    const { userId } = JSON.parse(payload);
    const { start } = JSON.parse(payload);
    const startTime = new Date(start);
    const startMinus48Hours = new Date(startTime.getTime() - 48 * 60 * 60 * 1000);
    const notifications = await db.notification.findMany({
        where: {
            userId: userId,
            createdAt: {
                gte: startMinus48Hours
            }
        },
        select: {
            id: true,
            createdAt: true,
            title: true,
            content: true,
            isRead: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return notifications;
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

export async function getUnansweredAiMessagesCount(
    { shopDomain, start, end }:
        {
            shopDomain: string,
            start: string,
            end: string
        }
): Promise<number> {
    const count = await db.aI_TO_USER.count({
        where: {
            unanswered: true,
            createdAt: {
                gte: start,
                lte: end,
            },
            event: {
                Ticket: {
                    shopDomain: shopDomain
                }
            }
        },
    });
    return count;
}
export async function getansweredAiMessagesCount({ shopDomain, start, end }:
    {
        shopDomain: string,
        start: string,
        end: string
    }
): Promise<number> {
    const count = await db.aI_TO_USER.count({
        where: {
            unanswered: false,
            createdAt: {
                gte: start,
                lte: end,
            },
            event: {
                Ticket: {
                    shopDomain: shopDomain
                }
            }
        },
    });
    return count;
}