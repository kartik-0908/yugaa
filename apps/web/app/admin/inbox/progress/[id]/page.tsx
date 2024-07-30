import axios from "axios"
import { auth } from "@clerk/nextjs/server";
import RightPanelToggle from "../../Collapsible";

export default async function ticket({ params }: any) {
    const { sessionClaims } = auth()
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/getEmail`, {
        shopDomain: sessionClaims?.metadata.shopDomain
    })
    const emails = resp.data.emails;
    return (
        <RightPanelToggle id={params.id} />
    )
}
