import { clerkClient } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"
import db from "../../../lib/db"

export default async function POST(req: NextRequest){
    const {id,role} = await req.json()
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