import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import MembersComponent from "../../../components/inviteUser";
import { getUsers } from "../../../actions/analytics";
import { getCodes } from "../../../actions/invite";

export default async function PageComponent() {
  const { sessionClaims } = auth()
  const res = await getUsers(sessionClaims?.metadata.shopDomain as string);
  if(res === null) return null;
  const resp = await getCodes(sessionClaims?.metadata.shopDomain as string);
  console.log(resp)

  return (
      <MembersComponent 
      member = {resp.member}
      admin = {resp.admin}
      users = {res}
      />
  );
}
