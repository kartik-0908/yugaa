'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import Card from './Card';
import { Pagination, Skeleton } from "@nextui-org/react";
import Link from 'next/link';

type ChatsType = {
    id: string,
    events: ({
        id: string;
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
    })[];
}[]

export default function ChatList() {
    const { user, isLoaded } = useUser();
    const totalInSingle = 10;
    if (!isLoaded) {
        return (
            <Skeleton className='w-full h-full'>
                <div className="h-full rounded-sm border border-stroke bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-4">


                    <div className="h-[9%] flex justify-between items-center px-7.5 mb-6">
                        Content is full how are youoojj vj bfj f fv kjkjoj
                    </div>
                    <div className="content  mb-6 h-[80%] overflow-y-auto">

                    </div>
                    <div className=" px-7.5 flex h-[6%] justify-center items-center">

                    </div>
                </div>
            </Skeleton>

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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/chat`, {
            shopDomain: user?.publicMetadata.shopDomain,
            offset: (page - 1) * totalInSingle,
            count: totalInSingle
        })
        const { retcount } = res.data;
        const { tickets } = res.data;
        setTotal(retcount)
        setChats(tickets)
        console.log(tickets)

    }

    return (
        <div className="h-full rounded-sm border border-stroke bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="h-[9%] flex justify-between items-center px-7.5 mb-6">
                <div className="text-4xl font-semibold ml-8 ">
                    Tickets
                </div>
                <select
                    className="border border-gray-300 rounded px-2 py-1"
                >
                    <option value="all">All</option>
                    <option value="unanswered">Unanswered</option>
                    <option value="answered">Answered</option>
                </select>
            </div>
            <div className="content  mb-6 h-[80%] overflow-y-auto">
                <div className="overflow-y-auto">
                    {
                        chats.map((chat, ind) => {
                            if (chat && chat.events && chat.events.length > 0 && chat.events[0]?.type === 'AI_TO_USER' && chat.events[0].AI_TO_USER?.message) {

                                return (
                                    <Link className='text-black' href={`/admin/chat-history/${chat.id}`}>
                                        <Card id={chat.id} messages={chat.events[0].AI_TO_USER?.message} timestamp={chat.events[0].AI_TO_USER?.createdAt} sender={'ai'} />
                                    </Link>
                                )
                            }
                            else if (chat && chat.events && chat.events.length > 0 && chat.events[0]?.type === 'USER_TO_AI' && chat.events[0].USER_TO_AI?.message) {
                                return (
                                    <Link className='text-black' href={`/admin/chat-history/${chat.id}`}>
                                        <Card id={chat.id} messages={chat.events[0].USER_TO_AI?.message} timestamp={chat.events[0].USER_TO_AI?.createdAt} sender={'user'} />
                                    </Link>
                                )
                            }
                        })
                    }
                </div>
            </div>
            <div className=" px-7.5 flex h-[6%] justify-center items-center">
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
