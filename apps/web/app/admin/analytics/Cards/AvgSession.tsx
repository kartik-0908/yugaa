import CardDataStats from "../../../../components/CardDataStats";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";


export async function AverageSession({ start, end }: { start: Date, end: Date }) {
    const { sessionClaims } = auth()
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/avg-session`, {
        shopDomain: sessionClaims?.metadata.shopDomain,
        startTime: start,
        endTime: end
    })
    let unit: string = "sec";
    const { avgSession } = res.data;
    console.log(avgSession)
    let finalAnswer = avgSession;
    if(finalAnswer >= 3600){
        finalAnswer = finalAnswer/3600;
        unit = 'hr' 
    }
    else if(finalAnswer >=60){
        finalAnswer = finalAnswer/60;
        unit = "min";
    }
    finalAnswer = Math.floor(finalAnswer)

    return (
        <CardDataStats title="Average Session Duration" total={`${finalAnswer} ${unit}`}>
 
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

      </CardDataStats>
    )
}
