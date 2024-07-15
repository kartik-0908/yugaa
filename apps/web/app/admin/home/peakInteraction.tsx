"use client"
import { format, toZonedTime } from 'date-fns-tz'
export const fetcher = (url: string) => axios.get(url).then(res => res.data)
import axios from "axios";
import { useUser } from '@clerk/nextjs';
import useSWR from 'swr';
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
function getDayOfWeekIndex(dateString: string): { dayIndex: number, hour: number } {
    const [datePart, timePart] = dateString.split(' ');
    if (!datePart) return { dayIndex: 0, hour: 0 };
    const [year, month, day] = datePart.split('-').map(Number);
    if (!timePart) return { dayIndex: 0, hour: 0 };
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    if (!year || !month || !day || !hours || !minutes || !seconds) return { dayIndex: 0, hour: 0 };
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    let dayIndex = date.getDay();
    dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    const hour = hours + minutes / 60;
    return { dayIndex, hour };
}
import { Card, Skeleton } from "@nextui-org/react";

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


export default function Chart() {

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
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ai-tickets?shop=${user?.publicMetadata.shopDomain}&start=${start}&end=${end}`,
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
    let finalData: {
        name: string,
        data: number[][]
    }[] = [{ name: "Mon", data: [] }, { name: "Tue", data: [] }, { name: "Wed", data: [] }, { name: "Thur", data: [] }, { name: "Fri", data: [] }, { name: "Sat", data: [] }, { name: "Sun", data: [] }]
    formattedTickets.forEach((ticket) => {
        const { dayIndex, hour } = getDayOfWeekIndex(ticket.localCreatedAt)
        finalData[dayIndex]?.data.push([dayIndex, hour])
    })
    return (
        <ScatterChartComp data={finalData} />
    )


}
import { ApexOptions } from "apexcharts";
import React, { useEffect } from 'react';
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

function ScatterChartComp({ data }: any) {
    return (

        <div
            className=" bg-white text-lg rounded-sm border p-4 pb-0 font-semibold "
        >
            <div className=" justify-between gap-4">
                <div>
                    <h4 className="">
                        Peak Interaction Time
                    </h4>
                    <h1 className="text-3xl text-white">
                        {"data.total"}
                    </h1>
                </div>
            </div>
            <div>
                <div id="hi" className="-mb-[] -ml-5">
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


export function SkeletonComp() {
    return (
        <div className=" bg-white text-lg rounded-sm border p-4 pb-0 font-semibold ">
            <Skeleton className="rounded-lg">
                <div className="h-96 rounded-lg bg-default-300"></div>
            </Skeleton>
        </div>
    )
}