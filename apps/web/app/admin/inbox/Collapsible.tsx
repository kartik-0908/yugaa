'use client';

import React, { useEffect, useState } from 'react';
import AiCard from './unassigned/[id]/AiCard';
import UserCard from './unassigned/[id]/UserCard';
import MessageForm from './MessageForm';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { formatDate } from '../chat-history/[id]/page';
import { generate, generateSum, generatelatestSum, suggestResp } from '../../../actions/ai';
import { readStreamableValue } from 'ai/rsc';
import TextMessage from '../../../components/copy';

const RightPanelToggle = ({ ticket, messages, emails }: any) => {
    const { user, isLoaded } = useUser();
    if (!isLoaded) return (<div>Loading...</div>);
    const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
    const [activeTab, setActiveTab] = useState('Tab1'); // Initialize with the first tab
    const [currentAiMessage, setCurrentAiMessage] = useState('');
    const [currentAiHeading, setCurrentAiHeading] = useState('');
    const [events, setEvents] = useState<any[]>([]);
    const [category, setCategory] = useState(ticket.category);
    const [priority, setPriority] = useState(ticket.priority);
    const [status, setStatus] = useState(ticket.status);


    const handleChange = async (field: string, value: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/escTicket/update`, {
                id: ticket.id,
                field: field,
                value: value,
                by: user?.fullName
            })
        } catch (error) {
            console.log(error)
        }

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
    };

    useEffect(() => {
        async function fetchEvents() {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/getEscTicketEvents`, {
                id: ticket.id
            })
            console.log(res.data)
            const { events } = res.data;
            setEvents(events)
        }
        fetchEvents();
    }, [ticket]);

    const renderContent = () => {
        switch (activeTab) {
            case 'Tab1':
                return (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ID</td>
                                    <td>{ticket.id}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{ticket.customerEmail}</td>
                                </tr>
                                <tr>
                                    <td>Subject</td>
                                    <td>{ticket.subject}</td>
                                </tr>
                                <tr>
                                    <td>Assignee</td>
                                    <td>{ticket.assignedPerson}</td>
                                </tr>
                                <tr>
                                    <td>Created At</td>
                                    <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='mt-4'>
                            <div>
                                <label htmlFor="category">Category: </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                >
                                    <option value="">Select a query category</option>
                                    <option value="Product inquiry">Product inquiry</option>
                                    <option value="Order issue">Order issue</option>
                                    <option value="Technical support">Technical support</option>
                                    <option value="Account query">Account query</option>
                                    <option value="Billing issue">Billing issue</option>
                                    <option value="Policy query">Policy query</option>
                                    <option value="Compliance inquiry">Compliance inquiry</option>
                                    <option value="Miscellaneous issues">Miscellaneous issues</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <label htmlFor="priority">Priority: </label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => handleChange('priority', e.target.value)}
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <label htmlFor="status">Status: </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                >
                                    <option value="Queued">Queued</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
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

    async function handleMessageSend(message: string) {
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
                <div className="text-2xl pt-1 pl-1 font-bold border-b-1 border-stroke text-ellipsis">
                    <h2>{ticket.subject}</h2>
                    <p className="text-sm">{ticket.id}</p>
                </div>
                <div className="p-4 h-3/5 overflow-y-auto overflow-x-hidden">
                    {messages.map((msg: any) => {
                        if (msg.message) {
                            if (msg.sender === 'ai') {
                                return (
                                    <AiCard message={msg.message} time={formatDate(msg.createdAt)} key={msg.id} />
                                );
                            } else if (msg.sender === 'user') {
                                return (
                                    <UserCard message={msg.message} time={formatDate(msg.createdAt)} key={msg.id} />
                                );
                            }
                        }
                    })}
                    {events.map((event: any) => {
                        if (event.type === 'EMAIL_SENT') {
                            return (
                                <AiCard message={event.email.text} time={formatDate(event.email.createdAt)} key={event.id} />
                            );
                        }
                        else if (event.type === 'EMAIL_RECEIVED') {
                            return (
                                <UserCard message={event.email.text} time={formatDate(event.email.createdAt)} key={event.id} />
                            );
                        }
                        else {
                            let message = '';
                            let actor = '';
                            let time = '';

                            if (event.changedBy) {
                                actor = ` by ${event.changedBy}`;
                            }

                            if (event.time) {
                                time = ` at ${event.time}`;
                            } else if (event.createdAt) {
                                time = ` at ${formatDate(event.createdAt)}`;
                            }

                            switch (event.type) {
                                case 'STATUS_CHANGED':
                                    message = `Status changed to ${event.newStatus}${actor}`;
                                    break;
                                case 'PRIORITY_CHANGED':
                                    message = `Priority changed to ${event.newPriority}${actor}`;
                                    break;
                                case 'CATEGORY_CHANGED':
                                    message = `Category changed to ${event.newCategory}${actor}`;
                                    break;
                                case 'ASSIGNED':
                                    message = `Assigned to ${event.assignee}${actor}`;
                                    break;
                                case 'REOPENED':
                                    message = `Ticket reopened${actor}`;
                                    break;
                                case 'CREATED':
                                    message = `Ticket created${actor}`;
                                    break;
                                default:
                                    message = event.message;
                            }

                            return (
                                <EventCard
                                    event={`${message}${time}`}
                                    key={event.id}
                                />
                            );
                        }

                    })}
                </div>
                <div className='h-1/5'>
                    <MessageForm
                        emails={emails}
                        customerEmail={ticket.customerEmail}
                        ticketId={ticket.id}
                        subject={ticket.subject}
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
                            <div className="flex justify-between items-center p-4 pb-0 border-b border-stroke space-x-4">
                                <div className={`cursor-pointer p-2 flex-1 text-center ${activeTab === 'Tab1' ? 'font-bold' : ''}`} onClick={() => setActiveTab('Tab1')}>MetaData</div>
                                <div className={`cursor-pointer p-2 flex-1 text-center border-l border-gray-400 ${activeTab === 'Tab2' ? 'font-bold' : ''}`} onClick={() => setActiveTab('Tab2')}>AI</div>
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
                className="absolute top-32 right-2 bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => setIsRightPanelVisible(!isRightPanelVisible)}
            >
                Toggle
            </button>
        </div>
    );
};

const EventCard = ({ event }: any) => {
    return (
        <div className="flex justify-center my-4 rounded-2xl">
            <div className="bg-gray-300 rounded-full px-4 py-2 text-sm text-white">
                {event}
            </div>
        </div>
    );
};

export default RightPanelToggle;
