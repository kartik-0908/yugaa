import axios from "axios";
import AiCard from "./AiCard";
import UserCard from "./UserCard";

export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Get day, month, year
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    const year = date.getFullYear();

    // Get hours and minutes
    let hours: number = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursString = hours.toString().padStart(2, '0');

    // Construct the formatted string
    return `${day}-${month}-${year} ${hoursString}:${minutes} ${ampm}`;
}

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
    const { messages } = ticket;
    return (
        <div className="p-4 h-full overflow-y-auto ">
            {
                messages.map((msg: Message) => {
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