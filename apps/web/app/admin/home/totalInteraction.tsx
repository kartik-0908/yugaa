"use client"
import { format, toZonedTime } from 'date-fns-tz'

function getWeekTimestamps(): [string, string] {
    const now = new Date(new Date().toLocaleString("en-US"));
    // console.log(now)

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const startUtc = new Date(startOfWeek).toISOString();
    const endUtc = new Date(endOfWeek).toISOString();
    return [startUtc, endUtc];
}
interface Ticket {
    id: string;
    createdAt: Date;
}

function convertTicketsToLocalTime(
    tickets: Ticket[],
    timezone: string
): { id: string; localCreatedAt: string }[] {
    return tickets.map(ticket => ({
        id: ticket.id,
        localCreatedAt: format(
            toZonedTime(ticket.createdAt, timezone),
            'yyyy-MM-dd HH:mm:ss',
            { timeZone: timezone }
        )
    }));
}

function getLocalTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function getDayOfWeekIndex(dateString: string) {
    const [datePart, timePart] = dateString.split(' ');
    if (!datePart || !timePart) {
        return -1;
    }
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    //@ts-ignore
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    let dayIndex = date.getDay();
    dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return dayIndex;
}



export default function TotalInteraction() {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return (
            <SkeletonComp />
        )
    }
    useEffect(() => {
    }, [])
    const [start, end] = getWeekTimestamps();
    const { data, isLoading, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/total-interaction?shop=${user?.publicMetadata.shopDomain}&start=${start}&end=${end}`,
        fetcher, {
        refreshInterval: 1000,
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

    const formattedTickets = convertTicketsToLocalTime(data.tickets, getLocalTimezone())
    const finalData: {
        total: number,
        data: { name: string, data: number[] }[]
    } = { total: 0, data: [{ name: "Total Interactions", data: [0, 0, 0, 0, 0, 0, 0] }] }
    let count = 0;
    formattedTickets.forEach((ticket) => {
        const dayIndex = getDayOfWeekIndex(ticket.localCreatedAt)
        // console.log(dayIndex)
        finalData.total++;
        //@ts-ignore
        finalData.data[0].data[dayIndex]++;
    })
    return (
        <ChartTwo data={finalData} />
    )
}

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useUser } from "@clerk/nextjs";
import { SkeletonComp, fetcher } from "./peakInteraction";
import useSWR from "swr";

let options: ApexOptions = {
    colors: ["#3C50E0", "#80CAEE"],
    tooltip: {
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
        decimalsInFloat: 0,
        stepSize: 10,
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


function ChartTwo({ data }: any) {

    if (data.total === 0) {
        options.yaxis = {
            min: 0,
            decimalsInFloat: 0,
            stepSize: 10,
            forceNiceScale: true
        }
    }

    return (
        <div className="text-lg bg-white rounded-sm border p-4 font-semibold rounded-sm border border-stroke">
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
