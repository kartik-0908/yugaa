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
    let displayId;
    const ticket = await db.ticket.findUnique({
        where: {
            id: id
        },
        select: {
            displayId: true
        }
    })
    displayId = ticket?.displayId
    const user = await db.user.findUnique({
        where: {
            id: assigneeId
        }
    })
    const user2 = await db.user.findUnique({
        where: {
            id: by
        }
    })
    assigneeName = user?.firstName
    byName = user2?.firstName
    if (assigneeId === "Unassigned") {
        await db.ticket.update({
            where: {
                id: id
            },
            data: {
                assigneeId: null,
                status: 'unassigned'
            }
        })
        console.log(`Unassigning ticket ${id}`);
    }
    else {
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
                    type: 'DISPLAY_TAG',
                    DISPLAY_TAG: {
                        create: {
                            message: `Assigned to ${assigneeName} by ${byName}`,
                        }
                    }
                },
            })
        })
        await pushAdminNotification(shopDomain, "Assignee Changed", `The assignee for ticket ${displayId} has been changed to ${assigneeName} by ${byName}`)
        await pushIndividualNoti(assigneeId, "Assignee Changed", `You have been assigned to ticket ${displayId} by ${byName}`)
    }

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
            DISPLAY_TAG: true
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
            displayId: true,
            status: true,
            subject: true,
            userEmail: true,
            userName: true,
            events: {
                orderBy: { createdAt: 'desc' },
                select: {
                    type: true,
                    createdAt: true,
                    DISPLAY_TAG: {
                        select: {
                            message: true,
                        }
                    },
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
                    AI_TO_USER: true,
                    USER_TO_AI: true,
                },
            }
        }
    });
    const total = await db.ticket.count({
        where: {
            shopDomain: shopDomain,
            status: status,
        }
    })
    return { total: total, currentTickets: escalatedTicket }
}
export async function getEscTicketWithStatusandId(shopDomain: string, status: string, offset: number, count: number, userId: string) {
    console.log(`getEscTicketWithStatus: ${shopDomain} ${status} ${offset} ${count}`);
    const escalatedTicket = await db.ticket.findMany({
        where: {
            shopDomain: shopDomain,
            status: status,
            assigneeId: userId
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
            assigneeId: userId,
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
    let byName = '';
    const displayId = await getDisplayID(id);
    const user = await db.user.findUnique({
        where: {
            id: by
        }
    })
    if (user !== null && user.firstName !== null) {
        byName = user?.firstName;
    }
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
            const res = await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: "DISPLAY_TAG",
                    DISPLAY_TAG: {
                        create: {
                            message: `Status  has been changed to ${value} by ${byName} `,
                        }
                    }
                },
            })
            await pushAdminNotification(resp.shopDomain, "Ticket Status", `Status of ticket ${displayId} has been changed to ${value} by ${byName} `);
            if (resp.assigneeId) {
                await pushIndividualNoti(resp.assigneeId, "Ticket Status", `Status of ticket ${displayId} assigned to you has been changed to ${value} by ${byName} `);
            }
        }
        if (field === "priority") {
            const res = await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: "DISPLAY_TAG",
                    DISPLAY_TAG: {
                        create: {
                            message: `Priority has been changed to ${value} by ${byName} `,
                        }
                    }
                },
            })
            await pushAdminNotification(resp.shopDomain, "Priority Changed", `The priority of ticket ${displayId} has been changed to ${value} by ${byName} `);
            if (resp.assigneeId) {
                await pushIndividualNoti(resp.assigneeId, "Priority Changed", `The priority of ticket ${displayId} assigned to you has been changed to ${value} by ${byName} `);
            }
        }
        if (field === 'category') {
            await db.ticketEvents.create({
                data: {
                    ticketId: id,
                    type: "DISPLAY_TAG",
                    DISPLAY_TAG: {
                        create: {
                            message: `Category has been changed to ${value} by ${byName} `,
                        }
                    }
                },
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