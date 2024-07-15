import React from "react";
import CardDataStats from "@/components/CardDataStats";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/common/Loader';
import dynamic from "next/dynamic";
import Filter from "./DateFilter";
// import { useSearchParams } from "next/navigation";
import { Answered, UnAnswered } from "./Cards/Answered";
import { TimeSaved } from "./Cards/TimeSaved";
import { AverageSession } from "./Cards/AvgSession";
import { start } from "repl";
import { TransferRate } from "./Cards/TransferRate";
import { Fcrr } from "./Cards/FCR";
import { AvgResponseTime } from "./Cards/AvgResponseTime";
import { MissedConv } from "./Cards/MissedConv";
const ChartTwo = dynamic(() => import('@/components/Charts/AnalyticsChart'), { ssr: false });

export default function Analytics(props: { searchParams: { [key: string]: string } }) {
  // const searchParams = useSearchParams()

  const { startYear } = props.searchParams
  const { startMonth } = props.searchParams
  const { startDay } = props.searchParams
  const { endYear } = props.searchParams
  const { endMonth } = props.searchParams
  const { endDay } = props.searchParams
  if (startYear && startMonth && startDay && endYear && endMonth && endDay) {
    const syear = parseInt(startYear, 10);
    const smon = parseInt(startMonth, 10) - 1; // Month is 0-based in JS Date
    const sday = parseInt(startDay, 10);
    const eyear = parseInt(endYear, 10);
    const emon = parseInt(endMonth, 10) - 1; // Month is 0-based in JS Date
    const eday = parseInt(endDay, 10);
    const startDate = new Date(syear, smon, sday);
    const endDate = new Date(eyear, emon, eday);
    return (

      <div>
        <div className="grid gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <Answered start={startDate} end={endDate} />
          <UnAnswered start={startDate} end={endDate} />
          <TimeSaved start={startDate} end={endDate} />
          <AverageSession start={startDate} end={endDate} />
          <TransferRate start={startDate} end={endDate} />


          <Fcrr start={startDate} end={endDate} />
          <AvgResponseTime start={startDate} end={endDate} />
          <MissedConv start={startDate} end={endDate} />


        </div>
        {/* {!loading && (
         <ChartTwo
           data={conversationsOverTime}
           startTime={startDate.toISOString()}
           endTime={endDate.toISOString()}
         />
       )} */}
      </div>
    )
  }
};

