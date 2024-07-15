'use client';

import React, { useEffect, useState } from 'react';
import AiCard from './unassigned/[id]/AiCard';
import UserCard from './unassigned/[id]/UserCard';
import MessageForm from './MessageForm';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { formatDate } from '@/utils/common';

const RightPanelToggle = ({ ticket, messages, emails }: any) => {
    const { user, isLoaded } = useUser();
    if (!isLoaded) return (<div>Loading...</div>);
    const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
    const [activeTab, setActiveTab] = useState('Tab1'); // Initialize with the first tab
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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


        const generateCompleteSummary = async () => {
            setIsLoading(true);
            // Here you would typically make an API call to generate the complete summary
            // For now, we'll just simulate it with a timeout
            setTimeout(() => {
                setSummary('This is a complete summary of the ticket...');
                setIsLoading(false);
            }, 2000);
        };

        const generateLatestSummary = async () => {
            setIsLoading(true);
            // Here you would typically make an API call to generate the latest summary
            // For now, we'll just simulate it with a timeout
            setTimeout(() => {
                setSummary('This is the latest summary of the ticket...');
                setIsLoading(false);
            }, 2000);
        };
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
                    <div className='flex flex-col h-[550px] bg-gray-100'>
                        <div className='h-1/2 bg-white rounded-lg mb-1 overflow-y-auto'>
                            <h3 className='text-xl font-bold mb-4'>Summary Generation</h3>
                            <div className='flex flex-row w-full gap-2 mb-4'>
                                <button
                                    className='bg-red text-black p-2 rounded-3xl hover:bg-red-600'
                                    onClick={generateCompleteSummary}
                                >
                                    Complete Summary
                                </button>
                                <button
                                    className='bg-red text-black p-2 rounded-3xl hover:bg-red-600'
                                    onClick={generateLatestSummary}
                                    disabled={isLoading}
                                >
                                    Latest Summary
                                </button>
                            </div>
                            {isLoading ? (
                                <p className='text-gray-600'>Generating summary...</p>
                            ) : (
                                <div>
                                    <h3 className='text-lg font-semibold mb-2'>Generated Summary:</h3>
                                    <p className='text-gray-700'>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className='h-1/2 bg-white rounded-lg shadow-md  overflow-y-auto'>
                            <h3 className='text-xl font-bold mb-4'>Suggested Response</h3>
                            <ul className='space-y-4'>
                                <li className='border-b pb-2'>
                                    <p className='text-gray-700'>Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
                                    <p className='text-gray-700'>Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
                                    <p className='text-gray-700'>Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
                                    <p className='text-gray-700'>Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
                                    <p className='text-gray-700'>Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
                                </li>

                            </ul>
                        </div>
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="flex h-full w-full">
            <div className={`h-[600px] transition-all duration-1500 ease-in-out ${isRightPanelVisible ? 'w-2/3' : 'w-full'}`}>
                <div className="h-20 text-2xl pl-3 font-bold border-b-[1px] border-b-[#D3D3D3] text-ellipsis">
                    <h2>{ticket.subject}</h2>
                    <p className="text-sm">{ticket.id}</p>
                </div>
                <div className="p-4 h-[60%] overflow-y-auto overflow-x-hidden">
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
                        if (event.eventType === 'EMAIL_SENT') {
                            return (
                                <AiCard message={event.email.text} time={formatDate(event.email.createdAt)} key={event.id} />
                            );
                        }
                        else if (event.eventType === 'EMAIL_RECEIVED') {
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
                <MessageForm
                    emails={emails}
                    customerEmail={ticket.customerEmail}
                    ticketId={ticket.id}
                    subject={ticket.subject}
                // onMessageSend={ }
                />
            </div>
            {isRightPanelVisible && (
                <div id="rightPanel" className={`h-[600px] bg-gray-100 transition-all duration-1500 ease-in-out ${isRightPanelVisible ? 'w-1/3' : 'w-0 overflow-hidden'}`}>
                    {isRightPanelVisible &&
                        <div className="h-full">
                            <div className="flex justify-between items-center bg-gray-200 p-4 pb-0 border-b border-gray-300 space-x-4">
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
            <div className="bg-gray-200 rounded-full bg-[#9CA3AF] px-4 py-2 text-sm text-white">
                {event}
            </div>
        </div>
    );
};

export default RightPanelToggle;
