// import axios from 'axios';
// import { signOut } from 'next-auth/react';
// import { updateVerified } from '../../../lib/services/user';
// import { auth } from '../auth';

// async function check(token: string) {
//   const resp = await axios.post(`${process.env.BASE_URL}/v1/user/verify`, {
//     token,
//   });
//   const {message} = resp.data
//   console.log(resp.data)
//   if(message === "ok"){
//     await updateVerified();
//     return true
//   }
//   else {
//     return false
//   }
// }

export default async function Verify({
//   searchParams,
// }: {
//   searchParams?: { [key: string]: string };
}) {

//   const { token } = searchParams ?? { token: "" };
//   const data = await check(token)
//   const session  = auth()

//   const handleLogout = () => {
//     signOut({ redirect: true, callbackUrl: '/' });
//   };

//   if (data) {
//     return (
//       <div>
//         <h1>Account Verified Successfully</h1>
//         {/* {JSON.stringify(session)} */}
//         <a href="http://localhost:3000">
//           Login Now
//         </a>
//       </div>
//     );
//   }
//   else {
//     return (
//       <div>
//         <h1>Account Verification Failed</h1>
//       </div>
//     );
//   }


}

