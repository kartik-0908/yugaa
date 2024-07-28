"use client"
import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button, Textarea, Select, SelectItem, Popover, PopoverTrigger, PopoverContent, ListboxItem, Listbox } from "@nextui-org/react";
import axios from 'axios';

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
                        subject: `Re : ${subject} [#${ticketId}]`,
                        text: message,
                        ticketId: ticketId,
                        status: "In progress"
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
                        subject: `Re : ${subject} [#${ticketId}]`,
                        text: message,
                        ticketId: ticketId,
                        status: "Resolved"
                    })
                setIsSending(false)
                console.log("Send as Resolved")
            }
        }
    ]
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
                            <div className='h-full pt-2 flex flex-col justify-between pt-2'>
                                <div>

                                    <Button
                                        size='sm'
                                        onClick={buttons[currentSendButton]?.sendFunction}
                                        isLoading={isSending}
                                        endContent={
                                            <Dropdown
                                                className='p-0'
                                                classNames={{
                                                    base: "p-0 m-0"
                                                }}
                                            >
                                                <DropdownTrigger className='font-bold text-lg'>
                                                    ⌄
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    classNames={{
                                                        list: "p-0 m-0"
                                                    }}
                                                    aria-label="Link Actions" onAction={(e: React.Key) => {
                                                        setSendButton(parseInt(e as string))
                                                    }}>
                                                    <DropdownItem
                                                        classNames={{
                                                            base: "p-0 m-0"
                                                        }}
                                                        key="0">
                                                        Submit as In Progress
                                                    </DropdownItem>
                                                    <DropdownItem key="1">
                                                        Submit as Resolved
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        }
                                        className="">
                                        {buttons[currentSendButton]?.text}
                                    </Button>
                                </div>
                                <div className='flex-grow'>
                                </div>
                                <div className='mt-2'>
                                    <Popover placement="bottom" showArrow offset={10}>
                                        <PopoverTrigger>
                                            <div className="p-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className=""><path fill="none" d="M0 0h24v24H0z"></path><path d="m20 7-.95-2.05L17 4l2.05-.95L20 1l.95 2.05L23 4l-2.05.95zM8.5 7l-.95-2.05L5.5 4l2.05-.95L8.5 1l.95 2.05L11.5 4l-2.05.95zM20 18.5l-.95-2.05L17 15.5l2.05-.95.95-2.05.95 2.05 2.05.95-2.05.95zM5.1 21.7l-2.8-2.8q-.3-.3-.3-.725t.3-.725L13.45 6.3q.3-.3.725-.3t.725.3l2.8 2.8q.3.3.3.725t-.3.725L6.55 21.7q-.3.3-.725.3a.99.99 0 0 1-.725-.3m.75-2.1L13 12.4 11.6 11l-7.2 7.15z"></path></svg>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] bg-white shadow-none">
                                            <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                                                <Listbox
                                                    classNames={{
                                                        list: "w-max-[100px] w-[150px] m-0",
                                                        base: "m-0"

                                                    }}
                                                    aria-label="Actions"
                                                >

                                                    <ListboxItem onPress={() => aiChatassistance(message)} className='m-0' key="new">AI Chat Assistance</ListboxItem>
                                                    <ListboxItem onPress={() => suggest(message)} className='m-0' key="copy"> Suggest Response</ListboxItem>
                                                    <ListboxItem onPress={() => latestSum(ticketId)} className='m-0' key="edit">Latest Summary</ListboxItem>
                                                    <ListboxItem onPress={() => completeSum(ticketId)} className='m-0' key="delete">Complete Summary</ListboxItem>
                                                </Listbox>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
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
