"use client"
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

let options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  tooltip:{
    enabled: false
  },
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

  xaxis: {
    categories: ["M", "T", "W", "T", "F", "S", "S"],
  },
  yaxis: {
    min: 0,
    decimalsInFloat:0,
    stepSize:10,
    forceNiceScale: false
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


export default function  ChartTwo  ({data}: any){

  if(data.total === 0){
    options.yaxis = {
      min: 0,
      decimalsInFloat:0,
      stepSize:10,
      forceNiceScale: true
    }
  }

  // console.log(data)


  return (
   
    <div className=" col-span-12 text-lg rounded-sm border p-4 font-semibold col-span-6 col-span-12 rounded-sm border border-stroke col-span-6">
      <div className="justify-between gap-4">
        <div>
          <h4 className=" text-xl">
            Total Interaction
          </h4>
          <h1 className="text-3xl">
            {data.total}
          </h1>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5">
          <ReactApexChart
            options={options}
            series={data.data}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};
