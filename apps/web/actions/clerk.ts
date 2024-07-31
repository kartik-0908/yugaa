// import { clerkClient } from "@clerk/nextjs/server";
// import db from '../lib/db';

// export async function updateRole(email: string, role: string) {
//     const res = db.user.findUnique({
//         where: {
//             email
//         },
//         select: {
//             id: true
//         }
//     })
//     // if (res !== null) {
//     //     const id = res.id;
//     //     await clerkClient.users.updateUserMetadata(id, {
//     //         publicMetadata: {
//     //             role
//     //         }
//     //     })
//     // }

// }