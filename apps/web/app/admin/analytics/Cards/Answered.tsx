import { useUser } from "@clerk/nextjs";
import axios from "axios";
import useSWR from "swr";
import { Card, CardHeader, CardBody, Skeleton } from "@nextui-org/react";
import { getFcrPercentage, getMissed, getTransferRate } from "../../../../actions/analytics";
import React from "react";

function SkeletonComp() {
    return (
        <div className=" bg-white text-lg rounded-sm border p-4 pb-0 font-semibold ">
            <Skeleton className="rounded-lg">
                <div className="h-32 rounded-lg bg-default-300"></div>
            </Skeleton>
        </div>
    )
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export function Answered({ start, end }: { start: string, end: string }) {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }
    const { data, isLoading, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/answered?shop=${user?.publicMetadata.shopDomain}&start=${start}&end=${end}`,
        fetcher, {
        refreshInterval: 1000,

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

    return (
        <Card className="">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 115.031 122.88" enable-background="new 0 0 115.031 122.88">
                        <g>
                            <path d="M68.988,7.718H27.144c-2.73,0-5.25,0.473-7.508,1.418c-2.258,0.945-4.357,2.362-6.248,4.252 c-1.89,1.89-3.307,3.99-4.252,6.248c-0.945,2.258-1.417,4.777-1.417,7.508V67.99c0,2.73,0.473,5.25,1.417,7.508 c0.945,2.258,2.363,4.357,4.252,6.248c1.943,1.89,4.043,3.36,6.301,4.252c2.258,0.945,4.725,1.418,7.455,1.418h17.956 c2.101,0,3.833,1.732,3.833,3.833c0,0.473-0.105,0.893-0.21,1.313c-0.683,2.52-1.417,5.04-2.258,7.455 c-0.893,2.572-1.837,4.987-2.888,7.35c-0.525,1.208-1.155,2.363-1.837,3.57c3.675-1.627,7.14-3.518,10.343-5.617 c3.36-2.205,6.511-4.673,9.398-7.351c2.939-2.73,5.564-5.723,7.979-8.925c0.735-0.998,1.891-1.522,3.046-1.522h15.436 c2.729,0,5.197-0.473,7.455-1.418c2.258-0.944,4.357-2.362,6.301-4.253c1.89-1.89,3.307-3.99,4.252-6.248 c0.945-2.257,1.418-4.777,1.418-7.508V27.249c0-2.73-0.473-5.25-1.418-7.508c-0.945-2.258-2.362-4.358-4.252-6.248 c-1.891-1.89-3.991-3.308-6.248-4.252c-2.258-0.945-4.778-1.417-7.508-1.417H68.988V7.718L68.988,7.718z M38.325,52.816 c-0.918-0.882-1.394-2.057-1.418-3.239c-0.023-1.182,0.404-2.375,1.286-3.294c0.882-0.918,2.056-1.394,3.238-1.417 c1.183-0.024,2.375,0.401,3.294,1.285l7.941,7.64l15.808-20.081c-0.007-0.02,0.132-0.137,0.153-0.152 c1.905-1.649,4.779-1.466,6.463,0.411c1.686,1.88,1.549,4.767-0.308,6.477L55.81,63.54c0.009,0.009-0.104,0.108-0.117,0.119 c-0.888,0.779-2.01,1.162-3.125,1.143c-1.125-0.02-2.247-0.446-3.121-1.285L38.325,52.816L38.325,52.816z M46.097,0.053h41.845 c3.675,0,7.14,0.683,10.395,1.995c3.203,1.313,6.144,3.308,8.769,5.933c2.625,2.625,4.62,5.565,5.933,8.768 c1.313,3.203,1.994,6.668,1.994,10.396V67.99c0,3.728-0.682,7.192-1.994,10.396s-3.308,6.143-5.933,8.768s-5.565,4.568-8.769,5.933 c-3.202,1.313-6.667,1.995-10.395,1.995H74.396c-2.362,2.993-4.936,5.828-7.665,8.4c-3.256,3.045-6.721,5.775-10.448,8.19 c-3.728,2.468-7.718,4.62-11.971,6.458c-4.2,1.838-8.715,3.359-13.44,4.62c-1.365,0.367-2.835-0.053-3.833-1.155 c-1.417-1.575-1.26-3.99,0.315-5.408c2.205-1.942,4.095-3.938,5.618-5.932c1.47-1.943,2.678-3.938,3.57-5.986v-0.052 c0.998-2.205,1.891-4.463,2.678-6.721c0.262-0.787,0.525-1.627,0.788-2.467H27.091c-3.675,0-7.14-0.683-10.396-1.996 c-3.203-1.312-6.143-3.307-8.768-5.933c-2.625-2.625-4.62-5.564-5.933-8.768C0.683,75.078,0,71.613,0,67.938V27.091 c0-3.675,0.683-7.141,1.995-10.396c1.313-3.203,3.308-6.143,5.933-8.768c2.625-2.625,5.565-4.62,8.768-5.933S23.363,0,27.091,0 h18.953L46.097,0.053L46.097,0.053z" />
                        </g>
                    </svg>
                </div>
                <div>
                    <p className="text-3xl text-default-500 font-bold">{data.count}</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">Answered Questions</p>

            </CardBody>
        </Card>

    )
}
export function UnAnswered({ start, end }: { start: string, end: string }) {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }
    const { data, isLoading, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/unanswered?shop=${user?.publicMetadata.shopDomain}&start=${start}&end=${end}`,
        fetcher, {
        refreshInterval: 1000 * 60 * 10,
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

    return (
        <Card className="">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 115.031 122.88" enable-background="new 0 0 115.031 122.88" ><g><path d="M46.097,0.053h41.845c3.675,0,7.14,0.683,10.395,1.995c3.203,1.313,6.144,3.308,8.769,5.933 c2.625,2.625,4.62,5.565,5.933,8.768c1.313,3.203,1.994,6.668,1.994,10.396V67.99c0,3.728-0.682,7.192-1.994,10.396 s-3.308,6.143-5.933,8.768s-5.565,4.568-8.769,5.933c-3.202,1.313-6.667,1.995-10.395,1.995H74.396 c-2.362,2.993-4.936,5.828-7.665,8.4c-3.256,3.045-6.721,5.775-10.448,8.19c-3.728,2.468-7.718,4.62-11.971,6.458 c-4.2,1.838-8.715,3.359-13.44,4.62c-1.365,0.367-2.835-0.053-3.833-1.155c-1.417-1.575-1.26-3.99,0.315-5.408 c2.205-1.942,4.095-3.938,5.618-5.932c1.47-1.943,2.678-3.938,3.57-5.986v-0.052c0.998-2.205,1.891-4.463,2.678-6.721 c0.262-0.787,0.525-1.627,0.788-2.467H27.091c-3.675,0-7.14-0.683-10.396-1.996c-3.203-1.312-6.143-3.307-8.768-5.933 c-2.625-2.625-4.62-5.564-5.933-8.768C0.683,75.078,0,71.613,0,67.938V27.091c0-3.675,0.683-7.141,1.995-10.396 c1.313-3.203,3.308-6.143,5.933-8.768c2.625-2.625,5.565-4.62,8.768-5.933S23.363,0,27.091,0h18.953L46.097,0.053L46.097,0.053z M65.572,31.489c-0.005-0.02,0.141-0.125,0.163-0.139c2.019-1.483,4.854-1.073,6.372,0.92c1.521,1.998,1.156,4.847-0.819,6.395 l-7.53,7.979l-0.014,0.016c2.847,2.532,5.87,5.257,9.555,8.669c0.02-0.005,0.125,0.141,0.139,0.164 c1.483,2.019,1.074,4.853-0.92,6.372c-1.997,1.521-4.847,1.157-6.395-0.819l-8.121-7.771l-7.575,8.725 c-1.367,2.104-4.174,2.718-6.297,1.378c-2.12-1.337-2.777-4.124-1.477-6.266c0.011-0.023,0.104-0.178,0.123-0.175 c3.345-3.693,6.028-6.722,8.537-9.565l-8.521-7.186c-2.105-1.368-2.718-4.174-1.378-6.298c1.337-2.119,4.125-2.777,6.266-1.477 c0.024,0.012,0.178,0.104,0.176,0.123c3.563,3.228,6.508,5.839,9.264,8.271C59.589,38.027,62.257,35.07,65.572,31.489 L65.572,31.489z M68.988,7.718H27.144c-2.73,0-5.25,0.473-7.508,1.418c-2.258,0.945-4.357,2.362-6.248,4.252 c-1.89,1.89-3.307,3.99-4.252,6.248c-0.945,2.258-1.417,4.777-1.417,7.508V67.99c0,2.73,0.473,5.25,1.417,7.508 c0.945,2.258,2.363,4.357,4.252,6.248c1.943,1.89,4.043,3.36,6.301,4.252c2.258,0.945,4.725,1.418,7.455,1.418h17.956 c2.101,0,3.833,1.732,3.833,3.833c0,0.473-0.105,0.893-0.21,1.313c-0.683,2.52-1.417,5.04-2.258,7.455 c-0.893,2.572-1.837,4.987-2.888,7.35c-0.525,1.208-1.155,2.363-1.837,3.57c3.675-1.627,7.14-3.518,10.343-5.617 c3.36-2.205,6.511-4.673,9.398-7.351c2.939-2.73,5.564-5.723,7.979-8.925c0.735-0.998,1.891-1.522,3.046-1.522h15.436 c2.729,0,5.197-0.473,7.455-1.418c2.258-0.944,4.357-2.362,6.301-4.253c1.89-1.89,3.307-3.99,4.252-6.248 c0.945-2.257,1.418-4.777,1.418-7.508V27.249c0-2.73-0.473-5.25-1.418-7.508c-0.945-2.258-2.362-4.358-4.252-6.248 c-1.891-1.89-3.991-3.308-6.248-4.252c-2.258-0.945-4.778-1.417-7.508-1.417H68.988V7.718L68.988,7.718z" /></g></svg>
                </div>
                <div>
                    <p className="text-3xl text-default-500 font-bold">{data.count}</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">UnAnswered Questions</p>
            </CardBody>
        </Card>
    )
}
export function TimeSaved({ start, end }: { start: string, end: string }) {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }
    const { data, isLoading, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/count-ai-tickets?shop=${user?.publicMetadata.shopDomain}&start=${start}&end=${end}`,
        fetcher, {
        refreshInterval: 1000 * 60 * 10,
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

    return (
        <Card className="">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="30"
                        height="32"
                        viewBox="0 0 122.88 116.33"
                        xmlSpace="preserve"
                    >
                        <style type="text/css">
                            {`
      .st0{fill-rule:evenodd;clip-rule:evenodd;}
    `}
                        </style>
                        <g>
                            <path
                                className="st0"
                                d="M26.44,103.06V64.79h17.21c7.3,1.31,14.59,5.26,21.89,9.86h13.37c6.05,0.36,9.22,6.5,3.34,10.53
      c-4.69,3.44-10.87,3.24-17.21,2.67c-4.37-0.22-4.56,5.66,0,5.68c1.58,0.12,3.3-0.25,4.81-0.25c7.91-0.01,14.43-1.52,18.42-7.77
      l2.01-4.68l19.89-9.86c9.95-3.28,17.02,7.13,9.69,14.37c-14.4,10.48-29.18,19.1-44.29,26.07c-10.97,6.67-21.95,6.45-32.92,0
      L26.44,103.06L26.44,103.06L26.44,103.06L26.44,103.06z M90.38,2.38c11.95,4.95,19.78,16.61,19.78,29.61
      c0,8.85-3.59,16.86-9.38,22.66c-5.8,5.8-13.81,9.39-22.66,9.39c-8.84,0-16.85-3.59-22.65-9.39c-5.8-5.8-9.39-13.81-9.39-22.66
      c0-12.9,8.02-24.93,19.94-29.82C73.41-0.85,83.03-0.66,90.38,2.38L90.38,2.38L90.38,2.38z M73.2,31.14c0.4-0.44,0.89-0.81,1.41-1.1
      l0-13.94c0-1.42,1.15-2.57,2.57-2.57c1.42,0,2.58,1.15,2.58,2.57v13.94c0.94,0.51,1.71,1.28,2.22,2.22h10.57
      c1.42,0,2.57,1.15,2.57,2.57s-1.15,2.57-2.57,2.57H81.98c-0.92,1.71-2.72,2.87-4.79,2.87c-1.63,0-3.09-0.72-4.09-1.86
      C71.25,36.3,71.33,33.15,73.2,31.14L73.2,31.14L73.2,31.14z M97.14,13.47C83.87,0.2,61.48,3.95,53.72,20.67
      c-1.6,3.44-2.49,7.27-2.49,11.32c0,7.43,3.01,14.15,7.87,19.02c4.87,4.87,11.59,7.88,19.02,7.88S92.28,55.87,97.14,51
      c4.87-4.86,7.88-11.59,7.88-19.02c0-4.21-0.97-8.2-2.7-11.75C101.01,17.55,99.26,15.59,97.14,13.47L97.14,13.47L97.14,13.47z
      M0,61.11h21.26v45.79H0V61.11L0,61.11L0,61.11z"
                            />
                        </g>
                    </svg>
                </div>
                <div>
                    <p className="text-3xl text-default-500 font-bold">{data.count}</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">Time Saved</p>
            </CardBody>
        </Card>

    )
}

export function AverageSession({ start, end }: { start: string, end: string }) {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }
    const { data, isLoading, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/avg-session?shop=${user?.publicMetadata.shopDomain}&start=${start}&end=${end}`,
        fetcher, {
        refreshInterval: 1000 * 60 * 10,
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
    let finalAnswer = data.avgSession;
    let unit;
    if (finalAnswer >= 3600) {
        finalAnswer = finalAnswer / 3600;
        unit = 'hr'
    }
    else if (finalAnswer >= 60) {
        finalAnswer = finalAnswer / 60;
        unit = "min";
    }
    finalAnswer = Math.floor(finalAnswer)

    return (
        <Card className="">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="30"
                        viewBox="0 0 237.54 237.54"
                        xmlSpace="preserve"
                    >
                        <g>
                            <path
                                d="M118.77,0c32.8,0,62.49,13.29,83.98,34.79c21.49,21.49,34.79,51.19,34.79,83.98s-13.29,62.49-34.79,83.98
      c-21.49,21.49-51.19,34.79-83.98,34.79c-32.8,0-62.49-13.29-83.98-34.79C13.29,181.26,0,151.56,0,118.77s13.29-62.49,34.79-83.98
      C56.28,13.29,85.97,0,118.77,0L118.77,0z M109.06,60.2c0-3.59,2.91-6.5,6.5-6.5s6.5,2.91,6.5,6.5v60l45.14,26.76
      c3.08,1.82,4.11,5.8,2.29,8.89c-1.82,3.08-5.8,4.11-8.89,2.29l-47.99-28.45c-2.11-1.08-3.55-3.27-3.55-5.79V60.2L109.06,60.2z
      M193.56,43.98C174.42,24.84,147.98,13,118.77,13c-29.21,0-55.65,11.84-74.79,30.98C24.84,63.12,13,89.56,13,118.77
      c0,29.21,11.84,55.65,30.98,74.79c19.14,19.14,45.58,30.98,74.79,30.98c29.21,0,55.65-11.84,74.79-30.98
      c19.14-19.14,30.98-45.58,30.98-74.79C224.54,89.56,212.7,63.12,193.56,43.98L193.56,43.98z"
                            />
                        </g>
                    </svg>
                </div>
                <div>
                    <p className="text-3xl text-default-500 font-bold">{finalAnswer} {unit}</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">Average Session</p>
            </CardBody>
        </Card>

    )
}
export function TransferRate({ start, end, users }: { start: string, end: string, users: React.Key[] }) {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }
    const payload = {
        shopDomain: user?.publicMetadata.shopDomain,
        type: 'transfer-rate',
        start,
        end,
        users
    };
    const { data, isLoading, error } = useSWR(
        JSON.stringify(payload),
        getTransferRate, {
        refreshInterval: 1000 * 60 * 10,
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
    return (
        <Card className="">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="30"
                        height="32"
                        viewBox="0 0 122.88 116.33"
                        xmlSpace="preserve"
                    >
                        <style type="text/css">
                            {`
      .st0{fill-rule:evenodd;clip-rule:evenodd;}
    `}
                        </style>
                        <g>
                            <path
                                className="st0"
                                d="M26.44,103.06V64.79h17.21c7.3,1.31,14.59,5.26,21.89,9.86h13.37c6.05,0.36,9.22,6.5,3.34,10.53
      c-4.69,3.44-10.87,3.24-17.21,2.67c-4.37-0.22-4.56,5.66,0,5.68c1.58,0.12,3.3-0.25,4.81-0.25c7.91-0.01,14.43-1.52,18.42-7.77
      l2.01-4.68l19.89-9.86c9.95-3.28,17.02,7.13,9.69,14.37c-14.4,10.48-29.18,19.1-44.29,26.07c-10.97,6.67-21.95,6.45-32.92,0
      L26.44,103.06L26.44,103.06L26.44,103.06L26.44,103.06z M90.38,2.38c11.95,4.95,19.78,16.61,19.78,29.61
      c0,8.85-3.59,16.86-9.38,22.66c-5.8,5.8-13.81,9.39-22.66,9.39c-8.84,0-16.85-3.59-22.65-9.39c-5.8-5.8-9.39-13.81-9.39-22.66
      c0-12.9,8.02-24.93,19.94-29.82C73.41-0.85,83.03-0.66,90.38,2.38L90.38,2.38L90.38,2.38z M73.2,31.14c0.4-0.44,0.89-0.81,1.41-1.1
      l0-13.94c0-1.42,1.15-2.57,2.57-2.57c1.42,0,2.58,1.15,2.58,2.57v13.94c0.94,0.51,1.71,1.28,2.22,2.22h10.57
      c1.42,0,2.57,1.15,2.57,2.57s-1.15,2.57-2.57,2.57H81.98c-0.92,1.71-2.72,2.87-4.79,2.87c-1.63,0-3.09-0.72-4.09-1.86
      C71.25,36.3,71.33,33.15,73.2,31.14L73.2,31.14L73.2,31.14z M97.14,13.47C83.87,0.2,61.48,3.95,53.72,20.67
      c-1.6,3.44-2.49,7.27-2.49,11.32c0,7.43,3.01,14.15,7.87,19.02c4.87,4.87,11.59,7.88,19.02,7.88S92.28,55.87,97.14,51
      c4.87-4.86,7.88-11.59,7.88-19.02c0-4.21-0.97-8.2-2.7-11.75C101.01,17.55,99.26,15.59,97.14,13.47L97.14,13.47L97.14,13.47z
      M0,61.11h21.26v45.79H0V61.11L0,61.11L0,61.11z"
                            />
                        </g>
                    </svg>
                </div>
                <div>
                    <p className="text-3xl text-default-500 font-bold">{data?.toPrecision(1)} %</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">Transfer Rate</p>
            </CardBody>
        </Card>

    )
}

export function FcrPercentage({ start, end, users }: { start: string, end: string, users: React.Key[] }) {
    const payload = {
        type: 'fcr-percentage',
        start: start,
        end: end,
        users: users
    }
    const { data, isLoading, error } = useSWR(JSON.stringify(payload), getFcrPercentage, { refreshInterval: 1000 * 60 * 10, keepPreviousData: true })
    if (isLoading) {
        return (
            <SkeletonComp />
        )
    }
    console.log(data)
    if (error) {
        return <div>Error from SWR...</div>
    }
    return (
        <Card className="">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="30"
                        height="32"
                        viewBox="0 0 122.88 116.33"
                        xmlSpace="preserve"
                    >
                        <style type="text/css">
                            {`
      .st0{fill-rule:evenodd;clip-rule:evenodd;}
    `}
                        </style>
                        <g>
                            <path
                                className="st0"
                                d="M26.44,103.06V64.79h17.21c7.3,1.31,14.59,5.26,21.89,9.86h13.37c6.05,0.36,9.22,6.5,3.34,10.53
      c-4.69,3.44-10.87,3.24-17.21,2.67c-4.37-0.22-4.56,5.66,0,5.68c1.58,0.12,3.3-0.25,4.81-0.25c7.91-0.01,14.43-1.52,18.42-7.77
      l2.01-4.68l19.89-9.86c9.95-3.28,17.02,7.13,9.69,14.37c-14.4,10.48-29.18,19.1-44.29,26.07c-10.97,6.67-21.95,6.45-32.92,0
      L26.44,103.06L26.44,103.06L26.44,103.06L26.44,103.06z M90.38,2.38c11.95,4.95,19.78,16.61,19.78,29.61
      c0,8.85-3.59,16.86-9.38,22.66c-5.8,5.8-13.81,9.39-22.66,9.39c-8.84,0-16.85-3.59-22.65-9.39c-5.8-5.8-9.39-13.81-9.39-22.66
      c0-12.9,8.02-24.93,19.94-29.82C73.41-0.85,83.03-0.66,90.38,2.38L90.38,2.38L90.38,2.38z M73.2,31.14c0.4-0.44,0.89-0.81,1.41-1.1
      l0-13.94c0-1.42,1.15-2.57,2.57-2.57c1.42,0,2.58,1.15,2.58,2.57v13.94c0.94,0.51,1.71,1.28,2.22,2.22h10.57
      c1.42,0,2.57,1.15,2.57,2.57s-1.15,2.57-2.57,2.57H81.98c-0.92,1.71-2.72,2.87-4.79,2.87c-1.63,0-3.09-0.72-4.09-1.86
      C71.25,36.3,71.33,33.15,73.2,31.14L73.2,31.14L73.2,31.14z M97.14,13.47C83.87,0.2,61.48,3.95,53.72,20.67
      c-1.6,3.44-2.49,7.27-2.49,11.32c0,7.43,3.01,14.15,7.87,19.02c4.87,4.87,11.59,7.88,19.02,7.88S92.28,55.87,97.14,51
      c4.87-4.86,7.88-11.59,7.88-19.02c0-4.21-0.97-8.2-2.7-11.75C101.01,17.55,99.26,15.59,97.14,13.47L97.14,13.47L97.14,13.47z
      M0,61.11h21.26v45.79H0V61.11L0,61.11L0,61.11z"
                            />
                        </g>
                    </svg>
                </div>
                <div>
                    <p className="text-3xl text-default-500 font-bold">{JSON.stringify(data)} %</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">First Contact Resolution</p>
            </CardBody>
        </Card>

    )
}

export function MissedConv({ start, end, users }: { start: string, end: string, users: React.Key[] }) {
    const payload = {
        type: 'missed-conv',
        start: start,
        end: end,
        users: users
    }
    const { data, isLoading, error } = useSWR(JSON.stringify(payload), getMissed, { refreshInterval: 1000 * 60 * 10, keepPreviousData: true })
    if (isLoading) {
        return (
            <SkeletonComp />
        )
    }
    console.log(data)
    if (error) {
        return <div>Error from SWR...</div>
    }
    return (
        <Card className="">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="30"
                        height="32"
                        viewBox="0 0 122.88 116.33"
                        xmlSpace="preserve"
                    >
                        <style type="text/css">
                            {`
      .st0{fill-rule:evenodd;clip-rule:evenodd;}
    `}
                        </style>
                        <g>
                            <path
                                className="st0"
                                d="M26.44,103.06V64.79h17.21c7.3,1.31,14.59,5.26,21.89,9.86h13.37c6.05,0.36,9.22,6.5,3.34,10.53
      c-4.69,3.44-10.87,3.24-17.21,2.67c-4.37-0.22-4.56,5.66,0,5.68c1.58,0.12,3.3-0.25,4.81-0.25c7.91-0.01,14.43-1.52,18.42-7.77
      l2.01-4.68l19.89-9.86c9.95-3.28,17.02,7.13,9.69,14.37c-14.4,10.48-29.18,19.1-44.29,26.07c-10.97,6.67-21.95,6.45-32.92,0
      L26.44,103.06L26.44,103.06L26.44,103.06L26.44,103.06z M90.38,2.38c11.95,4.95,19.78,16.61,19.78,29.61
      c0,8.85-3.59,16.86-9.38,22.66c-5.8,5.8-13.81,9.39-22.66,9.39c-8.84,0-16.85-3.59-22.65-9.39c-5.8-5.8-9.39-13.81-9.39-22.66
      c0-12.9,8.02-24.93,19.94-29.82C73.41-0.85,83.03-0.66,90.38,2.38L90.38,2.38L90.38,2.38z M73.2,31.14c0.4-0.44,0.89-0.81,1.41-1.1
      l0-13.94c0-1.42,1.15-2.57,2.57-2.57c1.42,0,2.58,1.15,2.58,2.57v13.94c0.94,0.51,1.71,1.28,2.22,2.22h10.57
      c1.42,0,2.57,1.15,2.57,2.57s-1.15,2.57-2.57,2.57H81.98c-0.92,1.71-2.72,2.87-4.79,2.87c-1.63,0-3.09-0.72-4.09-1.86
      C71.25,36.3,71.33,33.15,73.2,31.14L73.2,31.14L73.2,31.14z M97.14,13.47C83.87,0.2,61.48,3.95,53.72,20.67
      c-1.6,3.44-2.49,7.27-2.49,11.32c0,7.43,3.01,14.15,7.87,19.02c4.87,4.87,11.59,7.88,19.02,7.88S92.28,55.87,97.14,51
      c4.87-4.86,7.88-11.59,7.88-19.02c0-4.21-0.97-8.2-2.7-11.75C101.01,17.55,99.26,15.59,97.14,13.47L97.14,13.47L97.14,13.47z
      M0,61.11h21.26v45.79H0V61.11L0,61.11L0,61.11z"
                            />
                        </g>
                    </svg>
                </div>
                <div>
                    <p className="text-3xl text-default-500 font-bold">{JSON.stringify(data)}</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">Missed Conversations</p>
            </CardBody>
        </Card>

    )
}



export function AvgResponseTime({ start, end, users }: { start: string, end: string, users: React.Key[] }) {
    // const payload = {
    //     start: start,
    //     end: end,
    //     users: users
    // }
    // const { data, isLoading, error } = useSWR(JSON.stringify(payload),
    //     fetcher, {
    //     refreshInterval: 1000 * 60 * 10,
    //     keepPreviousData: true

    // }
    // )
    // if (isLoading) {
    //     return (
    //         <SkeletonComp />
    //     )
    // }
    // console.log(data)
    // if (error) {
    //     return <div>Error from SWR...</div>
    // }

    return (
        <Card className="">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="30"
                        height="32"
                        viewBox="0 0 122.88 116.33"
                        xmlSpace="preserve"
                    >
                        <style type="text/css">
                            {`
      .st0{fill-rule:evenodd;clip-rule:evenodd;}
    `}
                        </style>
                        <g>
                            <path
                                className="st0"
                                d="M26.44,103.06V64.79h17.21c7.3,1.31,14.59,5.26,21.89,9.86h13.37c6.05,0.36,9.22,6.5,3.34,10.53
      c-4.69,3.44-10.87,3.24-17.21,2.67c-4.37-0.22-4.56,5.66,0,5.68c1.58,0.12,3.3-0.25,4.81-0.25c7.91-0.01,14.43-1.52,18.42-7.77
      l2.01-4.68l19.89-9.86c9.95-3.28,17.02,7.13,9.69,14.37c-14.4,10.48-29.18,19.1-44.29,26.07c-10.97,6.67-21.95,6.45-32.92,0
      L26.44,103.06L26.44,103.06L26.44,103.06L26.44,103.06z M90.38,2.38c11.95,4.95,19.78,16.61,19.78,29.61
      c0,8.85-3.59,16.86-9.38,22.66c-5.8,5.8-13.81,9.39-22.66,9.39c-8.84,0-16.85-3.59-22.65-9.39c-5.8-5.8-9.39-13.81-9.39-22.66
      c0-12.9,8.02-24.93,19.94-29.82C73.41-0.85,83.03-0.66,90.38,2.38L90.38,2.38L90.38,2.38z M73.2,31.14c0.4-0.44,0.89-0.81,1.41-1.1
      l0-13.94c0-1.42,1.15-2.57,2.57-2.57c1.42,0,2.58,1.15,2.58,2.57v13.94c0.94,0.51,1.71,1.28,2.22,2.22h10.57
      c1.42,0,2.57,1.15,2.57,2.57s-1.15,2.57-2.57,2.57H81.98c-0.92,1.71-2.72,2.87-4.79,2.87c-1.63,0-3.09-0.72-4.09-1.86
      C71.25,36.3,71.33,33.15,73.2,31.14L73.2,31.14L73.2,31.14z M97.14,13.47C83.87,0.2,61.48,3.95,53.72,20.67
      c-1.6,3.44-2.49,7.27-2.49,11.32c0,7.43,3.01,14.15,7.87,19.02c4.87,4.87,11.59,7.88,19.02,7.88S92.28,55.87,97.14,51
      c4.87-4.86,7.88-11.59,7.88-19.02c0-4.21-0.97-8.2-2.7-11.75C101.01,17.55,99.26,15.59,97.14,13.47L97.14,13.47L97.14,13.47z
      M0,61.11h21.26v45.79H0V61.11L0,61.11L0,61.11z"
                            />
                        </g>
                    </svg>
                </div>
                <div>
                    <p className="text-3xl text-default-500 font-bold">{"Yet "} %</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className="text-xl">Average Response Time</p>
            </CardBody>
        </Card>

    )
}