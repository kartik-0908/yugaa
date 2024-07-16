'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import Card from './Card';
import { Pagination } from "@nextui-org/react";
import Link from 'next/link';

type ChatsType = {
    id: string,
    messages?: {
        id: string,
        createdAt: string,
        message: string,
        sender: string,
        unanswered: boolean
    }[]
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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/chat`, {
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
        <div className="h-[600px] rounded-sm border border-stroke bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="header flex justify-between items-center px-7.5 mb-6">
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
            <div className="content  mb-6 h-[440px] overflow-y-auto">
                <div className="overflow-y-auto">
                    {
                        chats.map((chat, ind) => {
                            if (chat && chat.messages && chat.messages.length > 0) {
                                return (
                                    <Link className='text-black' href={`/admin/chat-history/${chat.id}`}>
                                        <Card id={chat.id} messages={chat.messages} />

                                    </Link>
                                )
                            }
                        })
                    }
                </div>
            </div>
            <div className=" px-7.5 flex justify-center items-center">
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
