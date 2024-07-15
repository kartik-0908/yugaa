"use client"
import { today, getLocalTimeZone, parseDate, CalendarDate } from '@internationalized/date';
import { Button, DateRangePicker, Select } from "@nextui-org/react";
import React, { useEffect } from "react";
import { SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

export default function Filter() {
    const router = useRouter()
    const { user, isLoaded } = useUser()
    let [value, setValue] = React.useState({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).subtract({ weeks: 1 }),
    });
    function handlechange(value: any) {
        setValue(value);
        const { start } = value
        const { end } = value
        console.log(getLocalTimeZone())
        router.push(`/admin/analytics?startYear=${start.year}&startMonth=${start.month}&startDay=${start.day}&endYear=${end.year}&endMonth=${end.month}&endDay=${end.day}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/getUsers`, {
                shopDomain: user?.publicMetadata.shopDomain || "",
            })
        }
        fetchData()
    }, [])
    return (
        <div className="flex flex-row items-end justify-center gap-2 pb-4">
            <div className="flex items-center">
                <DateRangePicker
                    label="Choose Date"
                    labelPlacement="outside"
                    maxValue={today(getLocalTimeZone())}
                    onChange={handlechange}
                    className='min-w-[450px]'
                />
            </div>
            <div className=' flex items-center'>
                <Select
                    label="Choose Member"
                    labelPlacement='outside'
                    placeholder="Choose Member"
                    selectionMode="multiple"
                    className='min-w-[250px]'
                >
                    <SelectItem key={"cat"}>
                        cat
                    </SelectItem>
                    <SelectItem key={"dog"}>
                        dog
                    </SelectItem>
                </Select>
            </div>
            <div className=' flex justify-start'>
                <Button>
                    Apply Filter
                </Button>
            </div>
        </div>
    )
}