"use client"
import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button } from "@nextui-org/react";
import axios from 'axios';
import { on } from 'events';

interface MessageFormProps {
    emails: string[];
    customerEmail: string;
    ticketId: string;
    subject: string;
    onMessageSend?: (message: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ emails, customerEmail, ticketId, subject, onMessageSend }) => {
    const [currentSendButton, setSendButton] = useState<number>(0);
    const [currentSendEmail, setSendEmail] = useState<string>(emails[0]);
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
                // onMessageSend(message)
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
        <div className=" w-full">
            <div className='w-full gap-2'>
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
            <div className="flex w-full gap-2">
                <div className="w-[100%]">
                    <textarea onChange={(e) => setMessage(e.target.value)} className="w-full h-full p-2 border rounded" placeholder="Type your message here..."></textarea>
                </div>
                <div className="flex flex-col gap-2">
                    <Button
                        size='sm'
                        onClick={buttons[currentSendButton].sendFunction}
                        isLoading={isSending}
                        endContent={
                            <Dropdown>
                                <DropdownTrigger>
                                    Arrow
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Link Actions" onAction={(e: React.Key) => {
                                    setSendButton(parseInt(e as string))
                                }}>
                                    <DropdownItem key="0">
                                        Submit as In Progress
                                    </DropdownItem>
                                    <DropdownItem key="1">
                                        Submit as Resolved
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        }
                        className="bg-green-500 text-white rounded">
                        {buttons[currentSendButton].text}
                    </Button>

                    <Button
                        // onClick={ }
                        size='sm'
                        className=" bg-green-500 text-white rounded">
                        AI Chat Assistance
                    </Button>
                    <Button
                        // onClick={ }
                        size='sm'
                        className="bg-yellow-500 text-white rounded">
                        Suggest Response
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MessageForm;
