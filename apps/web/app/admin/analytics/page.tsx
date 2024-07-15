import React from "react";
import dynamic from "next/dynamic";
import { Answered, UnAnswered } from "./Cards/Answered";
import { TimeSaved } from "./Cards/TimeSaved";
import { AverageSession } from "./Cards/AvgSession";
import { TransferRate } from "./Cards/TransferRate";
import { Fcrr } from "./Cards/FCR";
import { AvgResponseTime } from "./Cards/AvgResponseTime";
import { MissedConv } from "./Cards/MissedConv";

export default function Analytics(props: { searchParams: { [key: string]: string } }) {
  // const searchParams = useSearchParams()

  const { startYear } = props.searchParams
  const { startMonth } = props.searchParams
  const { startDay } = props.searchParams
  const { endYear } = props.searchParams
  const { endMonth } = props.searchParams
  const { endDay } = props.searchParams
  const {users} = props.searchParams
  if (startYear && startMonth && startDay && endYear && endMonth && endDay && users) {
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
        {/* <ChartThree/> */}

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

