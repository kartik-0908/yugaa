import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request){
    const {id,role} = await req.json()
    await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
            role
        }
    })
    return NextResponse.json({message: "success"})
}