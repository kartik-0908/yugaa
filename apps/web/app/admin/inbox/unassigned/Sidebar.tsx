'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Pagination, Skeleton } from "@nextui-org/react";
import Link from 'next/link';
import Card from './Card';

type ChatsType = {
    id: string,
    aiConversationTicketId: string,
    createdAt: string,
    customerEmail: string
}[]

export default function ChatList({ status }: { status: string }) {
    const { user, isLoaded } = useUser();
    if (!isLoaded) {
        return (
            <Skeleton className='w-full h-full'>
                <div className='h-full w-full flex flex-col'>
                    <div className="w-full h-[90%] rounded-sm  pt-0 flex flex-col">
                        <div className=" overflow-y-auto">
                            <Link className='text-black' href={`/admin/inbox/unassigned/`}>
                                <Card id={"chat.id"} messages={"chat.aiConversationTicketId"} time={"hat.createdAt"} email={"chat.customerEmail"} />
                            </Link>
                        </div>

                    </div>
                    <div className="flex justify-center items-center">
                    </div>
                </div>
            </Skeleton>
        )
    }
    const totalInSingle = 10;

    const [chats, setChats] = useState<ChatsType>([]);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchChats();
    }, [page, filter]);

    async function fetchChats() {
        // console.log(user)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/getEscwithStatus`, {
            shopDomain: user?.publicMetadata.shopDomain,
            offset: (page - 1) * totalInSingle,
            count: totalInSingle,
            status: status
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
                {total > 0 ? <Pagination
                    total={total > 0 ? Math.ceil(total / totalInSingle) : 0}
                    initialPage={1}
                    onChange={(page) => {
                        setPage(page)
                    }}
                /> : null}

            </div>
        </div>


    );
}
