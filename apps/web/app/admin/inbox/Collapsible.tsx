'use client';

import React, { useEffect, useRef, useState } from 'react';
import AiCard from './unassigned/[id]/AiCard';
import UserCard from './unassigned/[id]/UserCard';
import MessageForm from './MessageForm';
import { useUser } from '@clerk/nextjs';
import { generate, generateSum, generatelatestSum, suggestResp } from '../../../actions/ai';
import { readStreamableValue } from 'ai/rsc';
import TextMessage from '../../../components/copy';
import { formatDate } from '../../../common/function';
import AssignedTo from '../../../components/AssignedTo';
import { fetchTicket, fetchTicketEventsbyId, getEmail, updateEscTicket } from '../../../actions/inbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../../components/ui/select';

const RightPanelToggle = ({ id }: { id: string }) => {
    const { user, isLoaded } = useUser();
    if (!isLoaded) return (<div>Loading...</div>);
    const containerRef = useRef(null);


    const [emails, setEmails] = useState<string[]>([]);
    const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
    const [activeTab, setActiveTab] = useState('Tab1'); // Initialize with the first tab
    const [currentAiMessage, setCurrentAiMessage] = useState('');
    const [currentAiHeading, setCurrentAiHeading] = useState('');
    const [events, setEvents] = useState<any[]>([]);
    const [category, setCategory] = useState('');
    const [subject, setSubject] = useState('');
    const [consumerEmail, setEmail] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [displayId, setDisplayId] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [creationTime, setCreationTime] = useState<Date>();



    useEffect(() => {
        if (containerRef.current) {
            //@ts-ignore
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [events]);


    const handleChange = async (field: string, value: string) => {
        switch (field) {
            case 'category':
                setCategory(value);
                break;
            case 'priority':
                setPriority(value);
                break;
            case 'status':
                setStatus(value);
                break;
        }
        try {
            console.log(id, field, value, user?.id as string)
            await updateEscTicket(id, field, value, user?.id as string)
        } catch (error) {
            console.log(error)
        }


    };

    useEffect(() => {
        async function fetchData() {
            const startTime = Date.now();
            console.log(`[${new Date().toISOString()}] Starting data fetch`);
    
            try {
                // Fetch all data in parallel
                const [events, ticket, emails] = await Promise.all([
                    fetchTicketEventsbyId(id),
                    fetchTicket(id),
                    getEmail(user?.publicMetadata.shopDomain as string)
                ]);
    
                console.log(`[${new Date().toISOString()}] All data fetched in ${Date.now() - startTime}ms`);
    
                // Process events
                events.forEach((event: any) => {
                    if (event.type === 'ESCALATED') {
                        setSubject(event.ESCALATED.subject);
                        setEmail(event.ESCALATED.userEmail);
                    }
                    if (event.Ticket.displayId) {
                        setDisplayId(event.Ticket.displayId);
                    }
                });
    
                // Process ticket
                if (ticket !== null) {
                    if(ticket.category !== null)setCategory(ticket.category );
                    if(ticket.status !== null)setStatus(ticket.status );
                    if(ticket.priority !== null)setPriority(ticket.priority );
                    if(ticket.assigneeId !== null)setAssigneeId(ticket.assigneeId );
                    if(ticket.createdAt !== null)setCreationTime(ticket.createdAt );
                }
    
                // Set state
                setEvents(events);
                if (emails !== null && emails !== undefined) {
                    setEmails(emails);
                }
    
            } catch (error) {
                console.error('Error fetching data:', error);
            }
    
            console.log(`[${new Date().toISOString()}] Total execution time: ${Date.now() - startTime}ms`);
        }
    
        fetchData();
    }, [id, user?.publicMetadata.shopDomain]);
    if (events.length === 0) {
        return <div>
            Loading events
        </div>
    }
    if (category === '') {
        return <div>
            Loading category
        </div>
    }
    if (emails.length === 0) {
        return <div>
            Loading emails
        </div>
    }
    const renderContent = () => {
        switch (activeTab) {
            case 'Tab1':
                return (
                    <div className='text-sm'>
                        <table className='text-gray-500'>
                            <thead>
                                <tr>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ID</td>
                                    <td className='pl-2'>{displayId}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td className='pl-2'>{consumerEmail}</td>
                                </tr>
                                <tr>
                                    <td>Subject</td>
                                    <td className='pl-2'>{subject}</td>
                                </tr>
                                <tr>
                                    <td>Created At</td>
                                    <td className='pl-2'>{creationTime?.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='mt-4'>
                            <div className='mb-4'>
                                <Select onValueChange={(e) => handleChange('category', e)} value={category}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectGroup>
                                            <SelectLabel>Select Category</SelectLabel>
                                            <SelectItem value="product_inquiry">Product inquiry</SelectItem>
                                            <SelectItem value="order_issue">Order issue</SelectItem>
                                            <SelectItem value="technical_support">Technical support</SelectItem>
                                            <SelectItem value="account_query">Account query</SelectItem>
                                            <SelectItem value="billing_issue">Billing issue</SelectItem>
                                            <SelectItem value="policy_query">Policy query</SelectItem>
                                            <SelectItem value="compliance_inquiry">Compliance inquiry</SelectItem>
                                            <SelectItem value="miscellaneous_issues">Miscellaneous issues</SelectItem>
                                            <SelectItem value="others">Others</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select >
                            </div>
                            <div className='mb-4' >
                                <Select onValueChange={(e) => handleChange('priority', e)} value={priority}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectGroup>
                                            <SelectLabel>Select Priority</SelectLabel>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select >
                            </div>
                            <div className='mb-4'>
                                <Select onValueChange={(e) => handleChange('status', e)} value={status}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="Queued">Queued</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select >
                            </div>
                            <div>
                                <AssignedTo userId={user?.id as string} id={id} assigneeId={assigneeId} shopDomain={user?.publicMetadata.shopDomain as string} />
                            </div>
                        </div>
                    </div>
                );
            case 'Tab2':
                return (
                    <div className='flex flex-col h-full'>
                        <TextMessage heading={currentAiHeading} message={currentAiMessage} />
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };
    const renderEvent = (event: any) => {
        console.log(event.type)
        switch (event.type) {
            case 'USER_TO_AI':
                return (
                    <UserCard
                        message={event.USER_TO_AI.message}
                        time={formatDate(event.createdAt)}
                        key={event.id}
                    />
                )
            case 'EMAIL_RECEIVED':
                return (
                    <UserCard
                        message={event.EMAIL_RECEIVED.Email.text}
                        time={formatDate(event.createdAt)}
                        key={event.id}
                    />
                );
            case 'AI_TO_USER':
                return (
                    <AiCard
                        message={event.AI_TO_USER.message}
                        time={formatDate(event.createdAt)}
                        key={event.id}
                    />
                )
            case 'EMAIL_SENT':
                return (
                    <AiCard
                        message={event.EMAIL_SENT.Email.text}
                        time={formatDate(event.createdAt)}
                        key={event.id}
                    />
                );
            default:
                let message = '';
                let time = ` at ${formatDate(event.createdAt)}`;

                switch (event.type) {
                    case 'AI_TICKET_CREATED':
                        message = 'AI Ticket created';
                        break;
                    case 'STATUS_CHANGED':
                        message = `Status changed to ${event.STATUS_CHANGED.newStatus}`;
                        break;
                    case 'PRIORITY_CHANGED':
                        message = `Priority changed to ${event.PRIORITY_CHANGED.newpriority}`;
                        break;
                    case 'CATEGORY_CHANGED':
                        message = `Category changed to ${event.CATEGORY_CHANGED.newcategory}`;
                        break;
                    case 'ASSIGNE_CHANGED':
                        message = `Assigned to ${event.ASSIGNE_CHANGED.newId}`;
                        break;
                    case 'REOPENED':
                        message = 'Ticket reopened';
                        break;
                    case 'ESCALATED':
                        message = `Ticket escalated`;
                        break;
                    default:
                        message = `Unknown event: ${event.type}`;
                }

                return <EventCard event={`${message}${time}`} key={event.id} />;
        }
    };
    async function handleMessageSend(message: string, status: string) {
        setEvents([...events, { type: 'AI_TO_USER', AI_TO_USER: { message }, createdAt: new Date() }]);
        console.log(message)
    }
    async function aiChatassistance(message: string) {
        setIsRightPanelVisible(true)
        setActiveTab('Tab2')
        setCurrentAiHeading('Enhanced Response')
        setCurrentAiMessage('')
        console.log(message)
        if (message) {
            const { output } = await generate(message)
            for await (const delta of readStreamableValue(output)) {
                console.log(delta)
                setCurrentAiMessage(curr => `${curr}${delta}`);
            }
        }
    }

    async function latestSum(ticketId: string) {
        setIsRightPanelVisible(true)
        setActiveTab('Tab2')
        setCurrentAiHeading('Latest Summary')
        setCurrentAiMessage('')
        if (ticketId) {
            const { output } = await generatelatestSum(ticketId)
            for await (const delta of readStreamableValue(output)) {
                console.log(delta)
                setCurrentAiMessage(curr => `${curr}${delta}`);
            }
        }
    }

    async function suggest(message: string) {
        setIsRightPanelVisible(true)
        setActiveTab('Tab2')
        setCurrentAiHeading('Suggested Response')
        setCurrentAiMessage('')
        if (message) {
            const { output } = await suggestResp(message)
            for await (const delta of readStreamableValue(output)) {
                console.log(delta)
                setCurrentAiMessage(curr => `${curr}${delta}`);
            }
        }
    }

    async function completeSum(ticketId: string) {
        // console.log(key)
        setIsRightPanelVisible(true)
        setActiveTab('Tab2')
        setCurrentAiHeading('Complete Summary')
        setCurrentAiMessage('')
        if (ticketId) {
            const { output } = await generateSum(ticketId)
            for await (const delta of readStreamableValue(output)) {
                console.log(delta)
                setCurrentAiMessage(curr => `${curr}${delta}`);
            }
        }
    }
    return (
        <div className="flex h-full w-full">
            <div className={`h-full transition-all duration-1500 ease-in-out ${isRightPanelVisible ? 'w-2/3' : 'w-full'}`}>
                <div className="h-[8%] text-xl font-bold border-b-1 border-stroke flex justify-center items-center">
                    <div>
                        {subject}
                    </div>
                </div>
                <div ref={containerRef} className="p-4 h-[72%] overflow-y-auto overflow-x-hidden">
                    {events.map(renderEvent)}
                </div>
                <div className='h-[20%]'>
                    <MessageForm
                        emails={emails}
                        customerEmail={consumerEmail}
                        ticketId={id}
                        subject={subject}
                        onMessageSend={handleMessageSend}
                        aiChatassistance={aiChatassistance}
                        latestSum={latestSum}
                        suggest={suggest}
                        completeSum={completeSum}
                    />
                </div>
            </div>
            {isRightPanelVisible && (
                <div id="rightPanel" className={` bg-white border-r-1 border-l-1 border-stroke transition-all duration-1500 ease-in-out ${isRightPanelVisible ? 'w-1/3' : 'w-0 overflow-hidden'}`}>
                    {isRightPanelVisible &&
                        <div className="h-full">
                            <div className="h-[8%] flex justify-between items-center p-4 pt-0 pb-0 border-b border-stroke space-x-4">
                                <div className={`cursor-pointer p-2 flex-1 text-center ${activeTab === 'Tab1' ? 'font-bold' : ''}`} onClick={() => setActiveTab('Tab1')}>MetaData</div>
                                <div className={`cursor-pointer p-2 flex-1 text-center border-l border-storke ${activeTab === 'Tab2' ? 'font-bold' : ''}`} onClick={() => setActiveTab('Tab2')}>AI</div>
                            </div>
                            <div className="p-4 overflow-y-auto">
                                {renderContent()}
                            </div>
                        </div>
                    }
                </div>
            )}
            <button
                id="openRightPanel"
                className="absolute top-32 right-2 bg-gray-300 text-white px-2 py-1 rounded-2xl"
                onClick={() => setIsRightPanelVisible(!isRightPanelVisible)}
            >
                {isRightPanelVisible ? <ChevronLeft /> : <ChevronRight />}
            </button>
        </div>
    );
};

export const EventCard = ({ event }: any) => {
    return (
        <div className="flex justify-center my-4 rounded-2xl">
            <div className="bg-gray-400 rounded-full px-4 py-2 text-sm text-white">
                {event}
            </div>
        </div>
    );
};

export default RightPanelToggle;
