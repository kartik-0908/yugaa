import { clerkClient } from "@clerk/nextjs/server";
import db from '../lib/db';

export async function updateRole(id: string, role: string) {
    await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
            role
        }
    })
    await db.user.update({
        where: {
            id
        },
        data: {
            role
        }
    })
}
