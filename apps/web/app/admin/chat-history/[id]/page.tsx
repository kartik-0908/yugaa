import axios from "axios";
import AiCard from "./AiCard";
import UserCard from "./UserCard";
import { formatDate } from "../../../../common/function";


export type Message = {
    id: string,
    createdAt: string,
    message: string,
    sender: string,
    unanswered: boolean,
    ticketId?: string
}


export default async function ChatPage({ params }: any) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/completeChat`, {
        id: params.id
    })
    const { ticket } = res.data
    const { Message } = ticket;
    return (
        <div className="p-4 h-full overflow-y-auto ">
            {
                Message.map((msg: Message) => {
                    // console.log(msg)
                    if (msg.message) {
                        console.log(msg.sender)
                        if (msg.sender === 'ai') {
                            return (
                                <AiCard message={msg.message} time={formatDate(msg.createdAt)} />
                            )
                        }
                        else if (msg.sender === 'user') {
                            return (
                                <UserCard message={msg.message} time={formatDate(msg.createdAt)} />
                            )
                        }
                    }
                })
            }
        </div>
    );
}