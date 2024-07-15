import axios from "axios"
import { auth } from "@clerk/nextjs/server";
import RightPanelToggle from "../../Collapsible";

export default async function ticket({ params }: any) {
    const { sessionClaims } = auth()
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/getEscTicketwithId`, {
        id: params.id
    })
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/getEmail`, {
        shopDomain: sessionClaims?.metadata.shopDomain
    })
    const emails = resp.data.emails;
    const ticket = res.data.escalatedTicket;
    const { messages } = ticket.aiConversationTicket;
    return (
        <>
           <RightPanelToggle ticket={ticket} messages={messages} emails={emails} />
        </>


    )
}
