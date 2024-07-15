"use client"
import { ApexOptions } from "apexcharts";
import React from 'react';
import ReactApexChart from "react-apexcharts";


const options: ApexOptions = {
  colors: ["#FF4560", "#00E396", "#FEB019", "#775DD0", "#FF66C3", "#546E7A", "#D10CE8"],
  tooltip: {
    enabled: false,
    x: {
      show: false
    }
  },
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "scatter",
    height: 335,
    stacked: false,
    toolbar: {
      show: true,
      tools: {
        download: '<img src="/images/download.png" width="20">',
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        reset: false,
        pan: false
      }
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
  grid: {
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    }
  },
  xaxis: {
    categories: [
      "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"
    ],
    type: 'numeric',
    overwriteCategories: [
      "M", "T", "W", "Th", "F", "S", "S"
    ],
    stepSize: 1,
    min: 0,
    max: 6,
    tickPlacement: 'on',
  },
  yaxis: {
    min: 0,
    max: 24,
    tickAmount: 6,
    labels: {
      formatter: function (val) {
        const hour = Math.floor(val);
        const minute = Math.round((val - hour) * 60);
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        return `${formattedHour}:${formattedMinute}`;
      },
    },
  },
  legend: {
    show: false,
  },
  fill: {
    opacity: 1,
  },
};

export default function ScatterChartComp({ data }: any) {
  return (
  
    <div
     className="col-span-12 bg-white text-lg rounded-sm border p-4 pb-0 font-semibold col-span-6"
     >
      <div className=" justify-between gap-4">
        <div>
          <h4 className="">
            Peak Interaction Time
          </h4>
        </div>
      </div>
      <div>
        <div id="hi" className="-mb-[300px] -ml-5">
          <ReactApexChart
            options={options}
            series={data}
            type="scatter"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};
