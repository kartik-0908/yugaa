"use server"

import { user } from "@nextui-org/react";
import db from "./db";
import { randomUUID } from "crypto";


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

export async function updateAssignee(id: string, assigneeId: string, by: string) {
    await db.$transaction(async (tx) => {
        const res = await tx.aIEscalatedTicket.update({
            where: {
                id: id
            },
            data: {
                assignedToId: assigneeId
            }
        })
        const resp = await tx.user.findUnique({
            where: {
                id: assigneeId
            }
        })
        await tx.aIEscalatedTicketEvent.create({
            data: {
                id: randomUUID(),
                aiEscalatedTicketId: id,
                changedBy: by,
                assignedTo: resp?.firstName + " " + resp?.lastName,
                type: "ASSIGNED"
            }
        })
    })

}
