"use client"
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    toolbar: {
      show: true,
      tools: {
        download: '<img src="/images/download.png" width="20">',
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        reset: false,
        pan: false,
      },
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'MMM dd',
    },
    tickAmount: 12,
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return Math.floor(val).toString();
      },
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoProps {
  data: number[];
  startTime: string;
  endTime: string;
}

const ChartTwo: React.FC<ChartTwoProps> = ({ data, startTime, endTime }) => {
  const [state, setState] = useState({
    series: [{ name: "Conversations", data: [] as { x: string; y: number }[] }],
  });

  useEffect(() => {
    if (data) {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const numberOfBars = daysDifference < 12 ? daysDifference : 12;
      const intervalDuration = (end - start) / numberOfBars;

      const shiftDateByTimeZone = (date: Date, shiftHours: number, shiftMinutes: number) => {
        return new Date(date.getTime() + shiftHours * 60 * 60 * 1000 + shiftMinutes * 60 * 1000);
      };

      const intervals = Array.from({ length: numberOfBars }, (_, i) => {
        const adjustedDate = shiftDateByTimeZone(new Date(start + i * intervalDuration), 5, 31);
        return {
          x: adjustedDate.toISOString(),
          y: 0,
        };
      });

      for (let i = 0; i < numberOfBars; i++) {
        intervals[i].y = data[i] || 0;
      }
      console.log(intervals)
      setState({
        series: [{ name: "Conversations", data: intervals }],
      });
    }
  }, [data, startTime, endTime]);

  return (
    <div className="mt-8 col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-6">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Conversations Over Time
          </h4>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
