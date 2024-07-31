'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Pagination, Skeleton } from "@nextui-org/react";
import Link from 'next/link';
import Card from './Card';
import { useRouter } from 'next/navigation';
import { getEscTicketWithStatus } from '../../../../actions/inbox';

export default function ChatList({ status }: { status: string }) {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <Skeleton className='w-full h-full'>
                <div className='h-full w-full flex flex-col'>
                    <div className="w-full h-[90%] rounded-sm  pt-0 flex flex-col">
                        <div className=" overflow-y-auto">
                            <Link className='text-black' href={`/admin/inbox/unassigned/`}>
                                <Card id={"chat.id"} messages={"chat.aiConversationTicketId"} time={"hat.createdAt"} name={"chat.customerEmail"} />
                            </Link>
                        </div>

                    </div>
                    <div className="flex justify-center items-center">
                    </div>
                </div>
            </Skeleton>
        )
    }
    const router = useRouter();
    const getStatusPath = (status: string) => {
        switch (status) {
            case 'Unassigned': return 'unassigned';
            case 'In Progress': return 'progress';
            case 'Queued': return 'queued';
            case 'Resolved': return 'resolved';
            default: return status.toLowerCase();
        }
    };
    const getLatestEventInfo = (chat: any) => {
        if (!chat.events || chat.events.length === 0) {
            return { message: 'No events' };
        }
        const latestEvent = chat.events[0];
        let message = latestEvent.type;
        if (latestEvent.type === 'DISPLAY_TAG' && latestEvent.DISPLAY_TAG) {
            message = latestEvent.DISPLAY_TAG[0].message;
        }
        if (latestEvent.type === 'AI_TO_USER') {
            message = latestEvent.AI_TO_USER.message;
        }
        return message;
    };
    const totalInSingle = 10;

    const [chats, setChats] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<number>(-1);

    useEffect(() => {
        const fetchChats = async () => {
            console.log("will call function after")
            const { total, currentTickets } = await getEscTicketWithStatus(user?.publicMetadata.shopDomain as string, status, (page - 1) * totalInSingle, totalInSingle)
            setTotal(total)
            setChats(currentTickets)
            console.log(currentTickets)
        }
        fetchChats();
    }, [page, status]);


    if (total === 0) {
        router.push('/admin/inbox/empty')
    }
    else if (total > 0) {
        return (
            <div className='h-full w-full flex flex-col'>
                <div className="w-full h-[90%] rounded-sm  pt-0 flex flex-col">
                    <div className=" overflow-y-auto">
                        {chats?.map((chat: any) => {
                            console.log(chat)
                            const message  = getLatestEventInfo(chat);
                            return (
                                <Link key={chat.id} className='text-black' href={`/admin/inbox/${getStatusPath(status)}/${chat.id}`}>
                                    <Card id={chat.id} messages={message} time={chat.events[0].createdAt} name={chat.userName} />
                                </Link>
                            );
                        })}
                    </div>

                </div>
                <div className="flex justify-center items-center">
                    {total > 0 ? <Pagination
                        total={total > 0 ? Math.ceil(total / totalInSingle) : 0}
                        initialPage={1}
                        onChange={(page: any) => {
                            setPage(page)
                        }}
                    /> : null}
                </div>
            </div>
        );
    }
    else if (total === -1) {
        return (
            <Skeleton className='w-full h-full'>
                <div className='h-full w-full flex flex-col'>
                    <div className="w-full h-[90%] rounded-sm  pt-0 flex flex-col">
                        <div className=" overflow-y-auto">
                            <Link className='text-black' href={`/admin/inbox/unassigned/`}>
                                <Card id={"chat.id"} messages={"chat.aiConversationTicketId"} time={"hat.createdAt"} name={"chat.customerEmail"} />
                            </Link>
                        </div>

                    </div>
                    <div className="flex justify-center items-center">
                    </div>
                </div>
            </Skeleton>
        )
    }
}
