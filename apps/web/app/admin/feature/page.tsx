"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useState } from "react";
import { Button, Select, SelectItem, Textarea } from "@nextui-org/react";
import axios from "axios";
import { showToast } from "@/components/Toast";
import { useUser } from "@clerk/nextjs";

const items = [
    {
        key: "feature",
        label: "Feature Improvement",
    },
    {
        key: "request",
        label: "Request a Feature",
    },
    {
        key: "bugs",
        label: "Report bugs and issues",
    },
    {
        key: "dothers",
        label: "Others",
    }
];


const feature = () => {
    const { user, isLoaded } = useUser();

    const [shortdesc, setShortdesc] = useState("")
    const [message, setMessage] = useState("")
    const [category, setCategory] = useState("")
    const [buttonloading, setbuttonloading] = useState(false)

    const handleSave = async (e: any) => {
        e.preventDefault();
        setbuttonloading(true)
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/feature-request`, {
                shopDomain: user?.publicMetadata.shopDomain,
                shortdesc,
                message,
                category
            });
            showToast("success", <p>Request Successsfully Received</p>)
            setShortdesc("")
            setMessage("")
            setCategory("")
        } catch (error) {
            console.log(error)
            showToast("error", <p>Some Technical Issue . Try after some time</p>)
        }
        setbuttonloading(false)

    };
    return (
        <>
            <Breadcrumb pageName="Feature request" />

            <div className="pl-32 pr-32 gird-cols-12">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Request a feature
                        </h3>

                    </div>
                    <form action="#">
                        <div className="p-6.5 ">
                            <div className="mb-4.5 grid-cols-5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    What would you like to see in the next version of our bot?
                                </label>
                                <Textarea
                                    size="sm"
                                    placeholder="Short descriptive text."
                                    value={shortdesc}
                                    onValueChange={(value) => {
                                        setShortdesc(value)
                                    }}
                                />
                                <br></br>
                                <Textarea
                                    size="lg"
                                    placeholder="Type your message."
                                    value={message}
                                    onValueChange={(value) => {
                                        setMessage(value)
                                    }}

                                />
                                <Select
                                    label="Category"
                                    placeholder="Choose a category"
                                    className="pt-4"
                                    selectedKeys={category ? [category] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0];
                                        setCategory(String(selectedKey));
                                    }}
                                >
                                    {items.map((items) => (
                                        <SelectItem key={items.label} value={items.label}>
                                            {items.label}
                                        </SelectItem>
                                    ))}
                                </Select>


                            </div>
                            <Button
                                onClick={handleSave}
                                isLoading={buttonloading}
                                spinner={
                                    <div className="flex flex-row">
                                        <svg
                                            className="animate-spin h-5 w-5 text-current"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <h1>   Saving Changes</h1>
                                    </div>
                                }
                                fullWidth color="primary">
                                {buttonloading ? "" : "Save"}
                            </Button>
                        </div>
                    </form>
                </div>


            </div>

        </>
    );
};

export default feature;
