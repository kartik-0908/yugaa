'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Pagination, Skeleton } from "@nextui-org/react";
import Link from 'next/link';
import Card from './Card';
import { useRouter } from 'next/navigation';
import { getEscTicketWithStatus, getEscTicketWithStatusandId } from '../../../../actions/inbox';

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
        // console.log('chat', chat);
        if (!chat.events || chat.events.length === 0) {
            // console.log('No events found for chat', chat);
            return { message: 'No events', time: chat.createdAt, name: chat.customerEmail };
        }

        const latestEvent = chat.events[0];
        let message = latestEvent.type;
        let time = latestEvent.createdAt || chat.createdAt;
        let name = chat.customerEmail;

        chat.events.map((event: any) => {
            if (event.type === 'ESCALATED') {
                message = 'Ticket Escalated';
                name = event.ESCALATED?.name;
            }
        });

        if (latestEvent.type === 'ESCALATED' && latestEvent.ESCALATED) {
            // console.log('ESCALATED EVENT FOUND', latestEvent.ESCALATED);
            message = 'Ticket Escalated';
        }
        else {
            message = latestEvent?.Email?.text || ""
        }

        return { message, time, name };
    };
    const totalInSingle = 10;

    const [chats, setChats] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<number>(-1);

    useEffect(() => {
        const fetchChats = async () => {
            console.log("will call function after")
            if (status === 'Unassigned') {
                const { total, currentTickets } = await getEscTicketWithStatus(user?.publicMetadata.shopDomain as string, status, (page - 1) * totalInSingle, totalInSingle)
                setTotal(total)
                setChats(currentTickets)
            }
            else {
                const { total, currentTickets } = await getEscTicketWithStatusandId(user?.publicMetadata.shopDomain as string, status, (page - 1) * totalInSingle, totalInSingle, user?.id as string)
                setTotal(total)
                setChats(currentTickets)
            }
        }
        fetchChats();
    }, [page, status]);


    if (total === 0) {
        router.push('/member/inbox/empty')
    }
    else if (total > 0) {
        return (
            <div className='h-full w-full flex flex-col'>
                <div className="w-full h-[90%] rounded-sm  pt-0 flex flex-col">
                    <div className=" overflow-y-auto">
                        {chats?.map((chat: any) => {
                            const { message, time, name } = getLatestEventInfo(chat);
                            return (
                                <Link key={chat.id} className='text-black' href={`/member/inbox/${getStatusPath(status)}/${chat.id}`}>
                                    <Card id={chat.id} messages={message} time={time} name={name} />
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