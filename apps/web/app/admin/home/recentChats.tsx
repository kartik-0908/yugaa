import ChatCard from "../../../components/Chat/ChatCard";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { Suspense } from "react";
import { fetchRecentChats } from "../../../actions/home";



export default async function RecentChat() {
    const { sessionClaims } = auth()
    const res = await fetchRecentChats(sessionClaims?.metadata.shopDomain as string) 
    return (
        <Suspense fallback={<p>loading recent chats</p>}>
            <ChatCard data={res} />
        </Suspense>
    )


}