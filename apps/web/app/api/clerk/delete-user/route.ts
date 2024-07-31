import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import db from "../../../../lib/db";

export async function post(req: Request) {
    const body = await req.json()
    const { id } = body
    try {
        await db.ticket.updateMany({
            where: {
                assigneeId: id
            },
            data: {
                status: "Unassigned",
                assigneeId: null
            }
        })
        await clerkClient.users.deleteUser(id);
        return NextResponse.json({ message: 'User deleted' });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error deleting user' });
    }
}