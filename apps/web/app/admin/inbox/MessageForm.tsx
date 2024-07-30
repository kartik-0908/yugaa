"use client"
import React, { useEffect, useState } from 'react';
import { Textarea, Select, SelectItem, Popover, PopoverTrigger, PopoverContent, ListboxItem, Listbox } from "@nextui-org/react";
import axios from 'axios';
import { getDisplayID } from '../../../actions/inbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { MoreHorizontal, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface MessageFormProps {
    emails: string[];
    customerEmail: string;
    ticketId: string;
    subject: string;
    onMessageSend: (message: string, status: string) => void;
    aiChatassistance: (message: string) => void;
    suggest: (message: string) => void;
    latestSum: (ticketId: string) => void;
    completeSum: (ticketId: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ emails, customerEmail, ticketId, subject, onMessageSend, aiChatassistance, latestSum, suggest, completeSum }) => {
    const [currentSendButton, setSendButton] = useState<number>(0);
    const [currentSendEmail, setSendEmail] = useState<string>(emails[0] || "ugu");
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const [displayId, setDisplayId] = useState<number>(-1);
    const [label, setLabel] = React.useState("feature")
    const [open, setOpen] = React.useState(false)
    const buttons = [
        {
            text: "Send as In progress",
            sendFunction: async () => {
                setIsSending(true)
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/email/send-email`,
                    {
                        to: customerEmail,
                        from: currentSendEmail,
                        subject: `Re : ${subject} [#${displayId}]`,
                        text: message,
                        ticketId: ticketId,
                        status: "In Progress"
                    })
                onMessageSend(message, "In Progress")
                setMessage("")
                setIsSending(false)
                console.log("Send as In progress")
            }
        },
        {
            text: "Send as Resolved",
            sendFunction: async () => {
                setIsSending(true)
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/email/send-email`,
                    {
                        to: customerEmail,
                        from: currentSendEmail,
                        subject: `Re : ${subject} [#${displayId}]`,
                        text: message,
                        ticketId: ticketId,
                        status: "Resolved"
                    })
                setIsSending(false)
                setMessage("")
                console.log("Send as Resolved")
            }
        }
    ]
    useEffect(() => {
        const fetchDisplayId = async () => {
            const id = await getDisplayID(ticketId);
            if (id !== undefined) {
                setDisplayId(id)
            }
        }
        fetchDisplayId();
    }, [])
    return (
        <div className="h-full w-full">
            <div className='w-full gap-2 flex flex-row'>
                <div>
                    <label className="text-sm">Send message from:</label>
                    <select defaultValue={currentSendEmail}
                        onChange={(e) => {
                            console.log(e.target.value)
                            setSendEmail(e.target.value)
                        }}
                        className="p-1">
                        {emails.map((email) => (
                            <option key={email} value={email}>
                                {email}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm pl-2">To:</label>
                    {customerEmail}
                </div>

            </div>
            <div className="flex w-full mt-2">
                <div className="w-full">
                    <Textarea
                        size='lg'
                        value={message}
                        maxRows={5}
                        className='w-full'
                        classNames={{
                            innerWrapper: "w-full",
                            input: "w-full"

                        }}
                        variant="underlined"
                        placeholder="Type Your Text here"
                        onValueChange={setMessage}
                        endContent={
                            <div className='h-full pt-2 flex flex-col  pt-2'>
                                <div className='flex flex-row justify-end mt-2'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div className='flex flex-row justify-end items-center w-full'>
                                                <span className='pr-2'>Ask AI</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="">
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path d="m20 7-.95-2.05L17 4l2.05-.95L20 1l.95 2.05L23 4l-2.05.95zM8.5 7l-.95-2.05L5.5 4l2.05-.95L8.5 1l.95 2.05L11.5 4l-2.05.95zM20 18.5l-.95-2.05L17 15.5l2.05-.95.95-2.05.95 2.05 2.05.95-2.05.95zM5.1 21.7l-2.8-2.8q-.3-.3-.3-.725t.3-.725L13.45 6.3q.3-.3.725-.3t.725.3l2.8 2.8q.3.3.3.725t-.3.725L6.55 21.7q-.3.3-.725.3a.99.99 0 0 1-.725-.3m.75-2.1L13 12.4 11.6 11l-7.2 7.15z"></path>
                                                </svg>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='bg-white'>
                                            <DropdownMenuItem onClick={() => aiChatassistance(message)} className='m-0' key="new">AI Chat Assistance</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => suggest(message)} className='m-0' key="copy"> Suggest Response</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => latestSum(ticketId)} className='m-0' key="edit">Latest Summary</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => completeSum(ticketId)} className='m-0' key="delete">Complete Summary</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div>
                                    <div className="flex w-full flex-col items-start justify-between rounded-md mt-2 border sm:flex-row sm:items-center">
                                        <Button
                                            disabled={message === ""}
                                            onClick={buttons[currentSendButton]?.sendFunction}
                                            className='w-full text-black bg-white border-r-1 border-stroke rounded-none hover:bg-gray-200 '>
                                            {buttons[currentSendButton]?.text}
                                        </Button>
                                        <DropdownMenu  open={open} onOpenChange={setOpen}>
                                            <DropdownMenuTrigger  asChild>
                                                <Button disabled={message === ""} className='focus:outline-none' variant="ghost" size="sm">
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[200px]">
                                                <DropdownMenuGroup className='bg-white'>
                                                    <DropdownMenuItem onSelect={() => setSendButton(0)}>
                                                        Submit as In Progress
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setSendButton(1)}>
                                                        Submit as Resolved
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>

        </div>
    );
};

export default MessageForm;
