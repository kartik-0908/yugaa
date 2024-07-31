import axios from "axios";
import AiCard from "./AiCard";
import UserCard from "./UserCard";
import { formatDate } from "../../../../common/function";


export type Message = {
    createdAt: Date;
    type: 'AI_TO_USER' | 'USER_TO_AI';
    USER_TO_AI: {
        id: string;
        message: string;
        createdAt: Date;
    } | null;
    AI_TO_USER: {
        id: string;
        message: string;
        unanswered: boolean;
        createdAt: Date;
    } | null;
}


export default async function ChatPage({ params }: any) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/completeChat`, {
        id: params.id
    })
    const { ticket } = res.data
    return (
        <div className="p-4 h-full overflow-y-auto ">
            {
                ticket.map((msg: Message) => {
                    // console.log(msg)
                    if (msg.type === 'AI_TO_USER') {
                        return (
                            <AiCard message={msg.AI_TO_USER?.message} time={formatDate(msg.AI_TO_USER?.createdAt.toString() || new Date().toISOString())} />
                        )
                    }
                    else if (msg.type === 'USER_TO_AI') {
                        return (
                            <UserCard message={msg.USER_TO_AI?.message} time={formatDate(msg.USER_TO_AI?.createdAt.toString() || new Date().toISOString())} />
                        )
                    }
                })
            }
        </div>
    );
}