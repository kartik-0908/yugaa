"use client";
import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Select, SelectItem, } from "@nextui-org/react";
import { Button, Input, } from "@nextui-org/react";
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useToasts } from '@geist-ui/core';


const ButtonWithForm = () => {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return null;
    }

    const { setToast } = useToasts()
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [buttonloading, setbuttonloading] = useState(false)

    const handleSubmit = async () => {
        setbuttonloading(true)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/invite`, {
            shop: user?.publicMetadata.shopDomain || "",
            email,
            role
        })
        if (res.data.message === "ok") {
            setToast({ text: 'Invitation Sent', delay: 2000 })
        }
        if (res.data.message === "error") {
            setToast({ text: 'Error Occured. Please try after some time', delay: 2000 })
        }
        setbuttonloading(false)

    }

    return (
        <Popover placement="bottom" showArrow offset={10}>
            <PopoverTrigger>
                <div className="p-4">
                    <svg data-testid="geist-icon" height="24" stroke-linejoin="round" viewBox="0 0 16 16" width="24" style={{ color: "black" }}><path fill-rule="evenodd" clip-rule="evenodd" d="M5.75 0C3.95507 0 2.5 1.45507 2.5 3.25V3.75C2.5 5.54493 3.95507 7 5.75 7H6.25C8.04493 7 9.5 5.54493 9.5 3.75V3.25C9.5 1.45507 8.04493 0 6.25 0H5.75ZM4 3.25C4 2.2835 4.7835 1.5 5.75 1.5H6.25C7.2165 1.5 8 2.2835 8 3.25V3.75C8 4.7165 7.2165 5.5 6.25 5.5H5.75C4.7835 5.5 4 4.7165 4 3.75V3.25ZM12.25 7.25V9H13.75V7.25H15.5V5.75H13.75V4H12.25V5.75H10.5V7.25H12.25ZM1.5 13.1709V14.5H10.5V13.1709C9.68042 11.5377 8.00692 10.5 6.17055 10.5H5.82945C3.99308 10.5 2.31958 11.5377 1.5 13.1709ZM0.0690305 12.6857C1.10604 10.4388 3.35483 9 5.82945 9H6.17055C8.64517 9 10.894 10.4388 11.931 12.6857L12 12.8353V13V15.25V16H11.25H0.75H0V15.25V13V12.8353L0.0690305 12.6857Z" fill="currentColor"></path></svg>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[240px]">
                <div className="">
                    <div className="py-1">
                        <div className="flex">
                            <Select
                                name='role'
                                label="Select Role"
                                isRequired
                                size='sm'
                                variant='underlined'
                                classNames={{
                                    listbox: 'p-0 m-0',
                                }}
                                listboxProps={{
                                    classNames: {
                                        list: ["w-[30px]"]
                                    },
                                }}
                                onChange={(e) => {
                                    setRole(e.target.value)
                                }}
                            >
                                <SelectItem
                                    key="admin"
                                >Admin</SelectItem>
                                <SelectItem
                                    key="member"
                                >Member</SelectItem>
                            </Select>

                        </div>
                    </div>
                        <Input
                            isRequired
                            type="email"
                            label="Email"
                            variant='underlined'
                            classNames={{
                                base:"mt-0"
                            }}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                    <div className='pt-1 text-center'>
                        <Button size='sm' color="primary" onClick={handleSubmit} isLoading={buttonloading}>
                            Send Invite
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>

        // <>
        //     <div onClick={onOpen} className='p-2'>
        //     </div>
        //     <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        //         <ModalContent>
        //             {(onClose) => (
        //                 <>
        //                     <ModalHeader>
        //                         Invite Members
        //                     </ModalHeader>
        //                     <ModalBody>

        //                     </ModalBody>
        //                     <ModalFooter>
        //                        
        //                     </ModalFooter>
        //                 </>
        //             )}
        //         </ModalContent>
        //     </Modal>
        // </>
    );
};

export default ButtonWithForm;
