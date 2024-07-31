"use server"

import db from "../lib/db";
import { pushAdminNotification, pushIndividualNoti } from "../lib/pubSub";


export async function changeOperatorAvailability(userId: string[]) {
    console.log(`userId: ${userId}`);
    userId.forEach(async (id) => {
        const user = await db.user.findUnique({
            where: { id },
            select: { available: true }
        });
        if (user === null) {
            console.log(`User with id ${id} not found`);
            return null;
        }
        const res = await db.user.update({
            where: {
                id: id
            },
            data: {
                available: !user.available
            }
        })
        console.log(res)
    })
}

export async function updateOperatorAvailability(userId: string, available: boolean) {
    console.log(`userId: ${userId}`);
    const res = await db.user.update({
        where: {
            id: userId
        },
        data: {
            available: available
        }
    })
}

export async function updateAssignee(id: string, assigneeId: string, by: string, shopDomain: string) {
    let assigneeName;
    let byName;
    await db.$transaction(async (tx) => {
        const res = await tx.ticket.update({
            where: {
                id: id
            },
            data: {
                assigneeId: assigneeId
            }
        })
        const resp = await tx.user.findUnique({
            where: {
                id: assigneeId
            }
        })
        assigneeName = resp?.firstName + " " + resp?.lastName;
        const result = await tx.ticketEvents.create({
            data: {
                ticketId: id,
                type: 'ASSIGNE_CHANGED',
                ASSIGNE_CHANGED: {
                    create: {
                        newid: assigneeId,
                        byid: by
                    }
                }
            },
            include:{
                ASSIGNE_CHANGED: {
                    include:{
                        by: true
                    }
                }
            }
        })
        byName = result.ASSIGNE_CHANGED?.by.firstName
    })
    await pushAdminNotification(shopDomain, "Assignee Changed", `The assignee for ticket ${id} has been changed to ${assigneeName} by ${byName}`)
    await pushIndividualNoti(assigneeId, "Assignee Changed", `You have been assigned to ticket ${id} by ${byName}`)
}

export async function fetchTicketEventsbyId(id: string) {
    const ticketEvents = await db.ticketEvents.findMany({
        where: {
            ticketId: id
        },
        orderBy: {
            createdAt: 'asc'
        },
        select: {
            type: true,
            Ticket: {
                select: {
                    displayId: true,
                }
            },
            createdAt: true,
            ESCALATED: true,
            AI_TO_USER: true,
            USER_TO_AI: true,
            EMAIL_RECEIVED: {
                select: {
                    Email: true
                }
            },
            EMAIL_SENT: {
                select: {
                    Email: true
                }
            },
            ASSIGNE_CHANGED: true,
            CATEGORY_CHANGED: true,
            PRIORITY_CHANGED: true,
            STATUS_CHANGED: true,
        }
    })
    return ticketEvents;
}

export async function fetchTicket(id: string) {
    return await db.ticket.findUnique({
        where: {
            id: id
        }
    })
}
export async function getEscTicketWithStatus(shopDomain: string, status: string, offset: number, count: number) {
    console.log(`getEscTicketWithStatus: ${shopDomain} ${status} ${offset} ${count}`);
    const escalatedTicket = await db.ticket.findMany({
        where: {
            shopDomain: shopDomain,
            status: status
        },
        skip: offset,
        take: count,
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            events: {
                orderBy: { createdAt: 'desc' },
                select: {
                    type: true,
                    createdAt: true,
                    ESCALATED: true,
                    EMAIL_RECEIVED: {
                        select: {
                            Email: true
                        }
                    },
                    EMAIL_SENT: {
                        select: {
                            Email: true
                        }
                    },
                },
            }
        }
    });
    const total = await db.ticket.count({
        where: {
            shopDomain: shopDomain,
            status: status,
            events: {
                some: {
                    type: 'ESCALATED'
                }
            }
        }
    })
    return { total: total, currentTickets: escalatedTicket }
}

export async function getDisplayID(id: string) {

    const ticket = await db.ticket.findUnique({
        where: {
            id: id
        },
        select: {
            displayId: true
        }
    })
    return ticket?.displayId

}


export async function updateEscTicket(id: string, field: string, value: string, by: string) {
    try {
        const resp = await db.ticket.update({
            where: {
                id: id,
            },
            data: {
                [field]: value,
            },
        });
        if (field === "status") {
            await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: "STATUS_CHANGED",
                    STATUS_CHANGED: {
                        create: {
                            byid: by,
                            newStatus: value
                        }
                    }
                }
            })
            await pushAdminNotification(resp.shopDomain, "Ticket Status", `Status of ticket ${id} has been changed to ${value} by ${by} `);
            if (resp.assigneeId) {
                await pushIndividualNoti(resp.assigneeId, "Ticket Status", `Status of ticket ${id} assigned to you has been changed to ${value} by ${by} `);
            }
        }
        if (field === "priority") {
            await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: "PRIORITY_CHANGED",
                    PRIORITY_CHANGED: {
                        create: {
                            byid: by,
                            newpriority: value
                        }
                    }
                }
            })
            await pushAdminNotification(resp.shopDomain, "Priority Changed", `The priority of ticket ${id} has been changed to ${value} by ${by} `);
            if (resp.assigneeId) {
                await pushIndividualNoti(resp.assigneeId, "Priority Changed", `The priority of ticket ${id} assigned to you has been changed to ${value} by ${by} `);
            }
        }
        if (field === 'category') {
            await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: "CATEGORY_CHANGED",
                    CATEGORY_CHANGED: {
                        create: {
                            byid: by,
                            newcategory: value
                        }
                    }
                }
            })
        }
    }
    catch (error) {
        console.log(error);
    }
}


export async function getEmail(shopDomain: string) {
    try {
        const resp = await db.shopifyInstalledShop.findUnique({
            where: {
                shop: shopDomain,
            },
        });
        const emails = resp?.email
        return emails
    } catch (error) {
        console.log(error)
        return null
    }
}