"use server"

import db from "./db";


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

export async function updateAssignee(id: string, assigneeId: string) {
    let currentAssigneeId;
    if (assigneeId === "Unassigned") {
        currentAssigneeId = null
    }
    else {
        currentAssigneeId = assigneeId
    }
    const res = await db.aIEscalatedTicket.update({
        where: {
            id: id
        },
        data: {
            assignedToId: currentAssigneeId
        }
    })
    console.log(res)
}
