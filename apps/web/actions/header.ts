"use server"
import db from "../lib/db";

export async function markNotificationAsRead(id: string) {
    await db.notification.update({
        where: {
            id: id
        },
        data: {
            isRead: true
        }
    })
}