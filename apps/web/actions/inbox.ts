"use server"

import db from "../lib/db";
import { randomUUID } from "crypto";
import { pushAdminNotification, pushIndividualNoti } from "../lib/pubSub";


export async function changeOperatorAvailability(userId: string[]) {
    console.log(`userId: ${userId}`);
    userId.forEach(async (id) => {
        const user = await db.user.findUnique({
            where: { id },
            select: { availabe: true }
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
                availabe: !user.availabe
            }
        })
        console.log(res)
    })
}

export async function updateOperatorAvailability(userId: string[], available: boolean) {
    console.log(`userId: ${userId}`);
    userId.forEach(async (id) => {
        if (id) {
            const res = await db.user.update({
                where: {
                    id: id
                },
                data: {
                    availabe: available
                }
            })
            console.log(res)
        }
    })

}

export async function updateAssignee(id: string, assigneeId: string, by: string, shopDomain: string) {
    let assigneeName;
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
        await tx.ticketEvents.create({
            data: {
                ticketId: id,
                type: 'ASSIGNE_CHANGED',
                ASSIGNE_CHANGED: {
                    create: {
                        newid: assigneeId,
                        byid: by
                    }
                }

            }
        })
    })
    await pushAdminNotification(shopDomain, "Assignee Changed", `The assignee for ticket ${id} has been changed to ${assigneeName} by ${by}`)
    await pushIndividualNoti(assigneeId, "Assignee Changed", `You have been assigned to ticket ${id} by ${by}`)
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
                take: 1,
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
