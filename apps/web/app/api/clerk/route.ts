import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import db from "../../../lib/db"

export async function POST(req: Request){
    const {id,role} = await req.json()
    await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
            role
        }
    })
    // await db.user.update({
    //     where: {
    //         id
    //     },
    //     data: {
    //         role
    //     }
    // })
    return NextResponse.json({message: "success"})
}