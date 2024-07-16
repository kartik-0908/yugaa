"use client"
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { getUsers } from "../../../actions/analytics";
import { today, getLocalTimeZone } from '@internationalized/date';
import { Chip, DateRangePicker, Select } from "@nextui-org/react";
import { SelectItem } from "@nextui-org/react";
import { useUser } from '@clerk/nextjs';
import dynamic from "next/dynamic";
const Answered = dynamic(() => import("./Cards/Answered").then(mod => mod.Answered), { ssr: false });
const UnAnswered = dynamic(() => import("./Cards/Answered").then(mod => mod.UnAnswered), { ssr: false });
const TimeSaved = dynamic(() => import("./Cards/Answered").then(mod => mod.TimeSaved), { ssr: false });
const AverageSession = dynamic(() => import("./Cards/Answered").then(mod => mod.AverageSession), { ssr: false });
const TransferRate = dynamic(() => import("./Cards/Answered").then(mod => mod.TransferRate), { ssr: false });
const AvgResponseTime = dynamic(() => import("./Cards/Answered").then(mod => mod.AvgResponseTime), { ssr: false });
const FcrPercentage = dynamic(() => import("./Cards/Answered").then(mod => mod.FcrPercentage), { ssr: false });
const MissedConv = dynamic(() => import("./Cards/Answered").then(mod => mod.MissedConv), { ssr: false });
const ChartThree = dynamic(() => import("./ChartThree"), { ssr: false });
const WorkloadDistribution = dynamic(() => import("./workkload"), { ssr: false });
const Statusbar = dynamic(() => import("./statusBar"), { ssr: false });
const PriorityBar = dynamic(() => import("./prioritybar"), { ssr: false });


export default function Analytics() {
  const { user, isLoaded } = useUser()
  if (!isLoaded) return <div>Loading clerk data...</div>
  useEffect(() => {
    console.log(user)
  }, [user])
  const [value, setValue] = useState({
    start: today(getLocalTimeZone()).subtract({ weeks: 1 }),
    end: today(getLocalTimeZone()),
  });
  const [users, setUsers] = useState<React.Key[]>([]);

  const { data, isLoading, error } = useSWR(
    `${user?.publicMetadata.shopDomain}`,
    getUsers, {
    refreshInterval: 1000 * 60 * 5,
    keepPreviousData: true
  })

  if (isLoading) return <div>Loading swr data...</div>


  function handlechange(value: any) {
    setValue(value);
    const { start } = value
    const { end } = value
    console.log(value)
    console.log(getLocalTimeZone())
  }

  return (
    <div>
      <div className="pl-8 pr-8">
        <div className="flex flex-row items-end justify-center gap-2 pb-4">
          <div className="flex items-center">
            <DateRangePicker
              label="Choose Date"
              defaultValue={value}
              labelPlacement="outside"
              maxValue={today(getLocalTimeZone())}
              onChange={handlechange}
              className='min-w-[450px]'
              classNames={{
                calendarContent: "w-[250px]"
              }}
            />
          </div>
          <div className=' flex items-center'>
            <Select
              label="Choose Member"
              defaultSelectedKeys={"all"}
              labelPlacement='outside'
              placeholder="Choose Member"
              selectionMode="multiple"
              className='min-w-[250px]'
              onSelectionChange={(keys) => {
                console.log(keys)
                const selectedKeys = Array.from(keys);
                setUsers(selectedKeys)

              }}
              renderValue={(items) => {
                return (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Chip key={item.key}>{item.textValue}</Chip>
                    ))}
                  </div>
                );
              }}
            >
              {
                data ?
                  data.map((user) => (
                    <SelectItem key={user.id} textValue={user.firstName || ""}>
                      {user.firstName}  {user.lastName}
                    </SelectItem>
                  ))
                  :
                  (<SelectItem key={"cat"}>
                    cat
                  </SelectItem>)
              }
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-4">
          <Answered start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} />
          <UnAnswered start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} />
          <TimeSaved start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} />
          <AverageSession start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} />
          <TransferRate start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} users={users} />
          <AvgResponseTime start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} users={users} />
          <FcrPercentage start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} users={users} />
          <MissedConv start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} users={users} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 pt-8">
          <ChartThree start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} users={users} />
          <WorkloadDistribution start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} users={users} />
          <Statusbar start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} users={users} />
          <PriorityBar start={new Date(value.start.year, value.start.month - 1, value.start.day).toISOString()} end={new Date(value.end.year, value.end.month - 1, value.end.day).toISOString()} users={users} />
        </div>
      </div>
    </div>
  )
};

