'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Pagination } from "@nextui-org/react";
import Link from 'next/link';
import Card from './Card';

type ChatsType = {
    id: string,
    aiConversationTicketId: string,
    createdAt: string,
    customerEmail: string
}[]

export default function ChatList() {
    const { user, isLoaded } = useUser();
    const totalInSingle = 10;
    if (!isLoaded) {
        return (
            <div>
                still loading
            </div>
        )
    }
    const [chats, setChats] = useState<ChatsType>([]);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);

    useEffect(() => {
        fetchChats();
    }, [page, filter]);

    async function fetchChats() {
        // console.log(user)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/getEscwithStatus`, {
            shopDomain: user?.publicMetadata.shopDomain,
            offset: (page - 1) * totalInSingle,
            count: totalInSingle
        })
        const { retcount } = res.data;
        const { tickets } = res.data;
        setTotal(retcount)
        setChats(tickets)

    }

    return (
        <div className='h-full w-full flex flex-col'>
            <div className="w-full h-[90%] rounded-sm  pt-0 flex flex-col">
                <div className=" overflow-y-auto">
                    {
                        chats.map((chat, ind) => {
                            return (
                                <Link className='text-black' href={`/admin/inbox/unassigned/${chat.id}`}>
                                    <Card id={chat.id} messages={chat.aiConversationTicketId} time={chat.createdAt} email={chat.customerEmail} />
                                </Link>
                            )
                        })
                    }
                </div>

            </div>
            <div className="flex justify-center items-center">
                <Pagination
                    total={Math.ceil(total / totalInSingle)}
                    initialPage={1}
                    onChange={(page) => {
                        setPage(page)
                    }}
                />
            </div>
        </div>


    );
}
