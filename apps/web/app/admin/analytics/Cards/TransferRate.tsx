import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import CardDataStats from "../../../../components/CardDataStats";


export async function TransferRate({ start, end }: { start: Date, end: Date }) {
    const { sessionClaims } = auth()
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/transfer-rate`, {
        shopDomain: sessionClaims?.metadata.shopDomain,
        startTime: start,
        endTime: end
    })
    const { ratio } = res.data;

    return (
        <CardDataStats title="Transfer Rate" total={`${Math.floor(ratio)} minutes`}>
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
        </CardDataStats>
    )
}
