"use client"
import { useUser } from "@clerk/nextjs";
import { Card } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import useSWR from "swr";
import { getQueriesbyCategory } from "../../../actions/analytics";
import { SkeletonComp } from "../home/peakInteraction";

interface ChartThreeState {
  series: number[];
}
const categories = [
  "Product inquiry",
  "Order issue",
  "Technical support",
  "Account query",
  "Billing issue",
  "Policy query",
  "Compliance inquiry",
  "Others"
];
const colors = ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"];



const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: colors,
  labels: categories,
  legend: {
    show: false,
    position: "bottom",
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree = ({ start, end, users }: { start: string, end: string, users: React.Key[] }) => {

  useEffect(() => {
    console.log(start)
    console.log(end)
    console.log(users)
  }, [])
  const [state, setState] = useState<ChartThreeState>({
    series: [65, 34, 12, 56],
  });
  const payload = {
    start,
    end,
    users
  }
  const { data, isLoading, error } = useSWR(
    JSON.stringify(payload),
    getQueriesbyCategory, {
    refreshInterval: 1000 * 60 * 60,
    keepPreviousData: true

  }
  )
  if (isLoading) {
    return (
      <SkeletonComp />
    )
  }
  console.log(`chart the data is ${data}`)
  
  if (error) {
    return <div>Error from SWR...</div>
  }
  // if(data){
  //   setState({series: data})
  // }
  const allZero = data?.every(value => value === 0);

  return (
    <Card className="p-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold ">
            Query Categories
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          {allZero? (
            <div className="flex flex-col items-center justify-center h-[200px]">
              <span className="text-sm">No data available</span>
            </div>
          ) : (
            <ReactApexChart options={options} series={data} type="donut" height={350} />
          )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {categories.map((category, index) => (
          <div key={category} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full" style={{ backgroundColor: colors[index] }}></span>
              <p className="flex w-full justify-between text-sm font-medium ">
                <span>{category}</span>
                {data ? (<span>{data[index] }</span>) :
                  <span>0</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ChartThree;
