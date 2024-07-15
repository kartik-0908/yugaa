import ChatCard from "../../../components/Chat/ChatCard";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { Suspense } from "react";



export default async function RecentChat() {
    const { sessionClaims } = auth()
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/recent-chats`, {
        shopDomain: sessionClaims?.metadata.shopDomain,
    })
    const { result } = res.data;
    return (
        <Suspense fallback={<p>loading recent chats</p>}>
            <ChatCard data={result}/> 
        </Suspense>
    )


}