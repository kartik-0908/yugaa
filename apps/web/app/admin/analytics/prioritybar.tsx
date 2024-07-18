"use client"
import { Card } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import useSWR from "swr";
import { getQueriesbyPriority, getQueriesbyStatus, getUserWorkload } from "../../../actions/analytics";
import { SkeletonComp } from "../home/peakInteraction";

interface ChartThreeState {
  series: number[];
}

const colors = ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"];



const PriorityBar = ({ start, end, users }: { start: string, end: string, users: React.Key[] }) => {

  useEffect(() => {
    console.log(start)
    console.log(end)
    console.log(users)
  }, [])
  const [state, setState] = useState<ChartThreeState>({
    series: [65, 34, 12, 56],
  });
  const payload = {
    type: "priorityBarGraph",
    start,
    end,
    users
  }
  const { data, isLoading, error } = useSWR(
    JSON.stringify(payload),
    getQueriesbyPriority, {
    refreshInterval: 1000 * 60 * 60,
    keepPreviousData: true

  }
  )
  if (isLoading) {
    return (
      <SkeletonComp />
    )
  }
  console.log(data)
  if (error) {
    return <div>Error from SWR...</div>
  }
  if (!data) return <div>No data</div>

  console.log(`status data is ${data}`)

  const allZero = data.every(item => item === 0);

  const latestoptions: ApexOptions = {

    chart: {
      type: 'bar',
      height: 335,
      fontFamily: "Satoshi, sans-serif",
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: "25%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last"
      }
    },
    colors: ["#3C50E0"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Low", "Medium", "High", "Other"]
    },
    yaxis: {
      decimalsInFloat: 0,
      stepSize: 10,
      title: {
        text: 'Number of Tickets'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        radius: 99
      }
    },
    fill: {
      opacity: 1
    }
  };

  const latestseries = [{
    name: 'Tickets Assigned',
    data: data.map((item: any) => item)
  }];

  return (
    <Card className="p-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold ">
            Priority Distribution
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className=" flex-grow justify-center">
          {allZero ? (
            <div className="text-center p-4">
              <p className="text-lg font-medium">No workload data available for the selected period</p>
            </div>
          ) : (
            <ReactApexChart
              options={latestoptions}
              series={latestseries}
              type="bar"
              height={350}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default PriorityBar;
