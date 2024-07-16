import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import MembersComponent from "../../../components/inviteUser";

export default async function PageComponent() {
  const { sessionClaims } = auth()
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/get-members`, {
    shopDomain: sessionClaims?.metadata.shopDomain
  });
  console.log(res.data)
  const { memberInviteCode } = res.data;
  const { adminInviteCode } = res.data;
  const { users } = res.data;

  return (
      <MembersComponent 
      memberLink = {memberInviteCode}
      adminLink = {adminInviteCode}
      users = {users}
      />
  );
}
