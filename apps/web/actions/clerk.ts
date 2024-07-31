import { clerkClient } from "@clerk/nextjs/server";
import db from '../lib/db';

export async function updateRole(email: string, role: string) {

    const res = db.user.findUnique({
        where:{
            email
        },
        select:{
            id: true
        }
    })

    const id = res.id;



  await clerkClient.users.updateUserMetadata(res.id, {
    publicMetadata: {
      role
    }
  })
  return NextResponse.json({ success: true });
}