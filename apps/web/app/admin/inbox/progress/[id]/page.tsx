import axios from "axios"
import { auth } from "@clerk/nextjs/server";
import RightPanelToggle from "../../Collapsible";
import { getEscTicket } from "../../../../../actions/inbox";

export default async function ticket({ params }: any) {
    const { sessionClaims } = auth()
    const res = await getEscTicket(params.id)
    const ticket = res;
    const messages = res?.AIConversationTicket;
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/getEmail`, {
        shopDomain: sessionClaims?.metadata.shopDomain
    })
    const emails = resp.data.emails;
    return (
        <RightPanelToggle ticket={ticket} messages={messages} emails={emails} />
    )
}
