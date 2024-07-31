"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { Snippet } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { Info } from "lucide-react";
import NextLoader from "./Loader";
import axios from "axios";

export default function MembersComponent({ member, admin, users }: any) {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return <NextLoader />
    }
    const [members, setMembers] = useState<any[]>([]);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<number | null>(null);
    const [adminInviteLink, setAdminInviteLink] = useState<string>("");
    const [memberInviteLink, setMemberInviteLink] = useState<string>("");

    if (!user) return null;

    useEffect(() => {
        const fetchMembers = async () => {
            console.log(user?.emailAddresses[0]?.emailAddress)
            if (member) {
                setMemberInviteLink(`${process.env.NEXT_PUBLIC_APP_URL}/verify/invite?member=${member}`)
            }
            if (admin) {
                setAdminInviteLink(`${process.env.NEXT_PUBLIC_APP_URL}/verify/invite?admin=${admin}`)
            }
            if (users) {
                let allMembers = [];
                const len = users?.length;
                for (let i = 0; i < len; i++) {
                    console.log(users[i])
                    const name = users[i]?.firstName + " " + users[i]?.lastName || "";
                    allMembers.push({
                        id: users[i]?.id,
                        name: name,
                        role: users[i]?.role || "",
                        email: users[i]?.email || "",
                    });
                }
                setMembers(allMembers);
            }
        };
        fetchMembers();
    }, [member, admin, users]);

    const handleRoleChange = async  (index: number, newRole: string,id: string) => {
        console.log(newRole)
        const updatedMembers = [...members];
        console.log(updatedMembers[index])
        //@ts-ignore
        updatedMembers[index].role = newRole;
        setMembers(updatedMembers);
        await axios.post('/api/clerk',{
            id: id,
            role: newRole
        })

    };

    const handleRemoveMember = (index: number) => {
        setMemberToRemove(index);
        setShowRemoveModal(true);
    };

    const confirmRemoveMember = () => {
        if (memberToRemove !== null) {
            const updatedMembers = members.filter((_, i) => i !== memberToRemove);
            setMembers(updatedMembers);
            setShowRemoveModal(false);
            setMemberToRemove(null);
        }
    };

    return (
        <div className="relative p-4">
            <div className=" p-4 mb-6 rounded-md te">
                <h2 className="text-lg font-medium mb-2">Invite Links</h2>
                <div className="flex flex-col mb-2">
                    <div className="flex mb-2">
                        <div className="pr-2">For Admins: </div>
                        <Snippet classNames={{
                            pre: "m-0",
                            symbol: "font-default"
                        }} size="sm" symbol={""} >{adminInviteLink}</Snippet>
                    </div>
                    <div className="flex ">
                        <div className="pr-2">For Members: </div>
                        <Snippet classNames={{
                            pre: "m-0"
                        }} size="sm" symbol="" >{memberInviteLink}</Snippet>
                    </div>
                </div>

            </div>
            <div className="overflow-x-auto mt-10">
                <table className="w-full  text-left ">
                    <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex flexs-col">
                                    <div>
                                        Actions

                                    </div>
                                    <div>
                                        <Tooltip
                                            classNames={{
                                                base: "max-w-[150px]"
                                            }}
                                            placement="right-end"
                                            content="You can’t remove an admin directly. You need to make them member first"
                                        >
                                            <Info className="w-3 h-3"></Info>
                                        </Tooltip>
                                    </div>
                                </div>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, index) => (
                            <tr key={index} className="text-center bg-white border-b ">
                                <td className="px-6 py-4">{member.name}</td>
                                <td className="px-6 py-4">
                                    <Select
                                        isDisabled={member.email === user?.emailAddresses[0]?.emailAddress}
                                        defaultSelectedKeys={[member.role]}
                                        className="max-w-xs pl-4 pr-4"
                                        onChange={(e) => handleRoleChange(index, e.target.value,member.id)}
                                    >
                                        <SelectItem key="admin">
                                            Admin
                                        </SelectItem>
                                        <SelectItem key="member">
                                            Member
                                        </SelectItem>
                                    </Select>
                                </td>
                                <td className="px-6 py-4">{member.email}</td>
                                <td className="px-6 py-4">
                                    <Button
                                        isDisabled={(member.role === "admin")}
                                        color={member.role === "admin" ? "default" : "danger"}
                                        className={`px-4 py-2 ${member.role === "admin" ? "text-black" : "text-white hover:bg-red-700"}`}
                                        disabled={member.role === "Admin"}
                                        onClick={() => handleRemoveMember(index)}
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showRemoveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-5000">
                    <div className="p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <div className="text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Removal</h3>
                            <p className="mt-2">Are you sure you want to remove this member?</p>
                            <div className="flex justify-center space-x-4 mt-4">
                                <Button
                                    color="danger"
                                    onClick={confirmRemoveMember}
                                >
                                    Yes
                                </Button>
                                <Button
                                    onClick={() => setShowRemoveModal(false)}
                                >
                                    No
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
