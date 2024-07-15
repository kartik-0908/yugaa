import CardDataStats from "../../../../components/CardDataStats";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";


export async function Answered({ start, end }: { start: Date, end: Date }) {
    const { sessionClaims } = auth()
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/answered`, {
        shopDomain: sessionClaims?.metadata.shopDomain,
        startTime: start,
        endTime: end
    })
    const { count } = res.data;

    return (
        <CardDataStats title="Answered Questions" total={`${count}`}>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="22" viewBox="0 0 115.031 122.88" enable-background="new 0 0 115.031 122.88" ><g><path d="M68.988,7.718H27.144c-2.73,0-5.25,0.473-7.508,1.418c-2.258,0.945-4.357,2.362-6.248,4.252 c-1.89,1.89-3.307,3.99-4.252,6.248c-0.945,2.258-1.417,4.777-1.417,7.508V67.99c0,2.73,0.473,5.25,1.417,7.508 c0.945,2.258,2.363,4.357,4.252,6.248c1.943,1.89,4.043,3.36,6.301,4.252c2.258,0.945,4.725,1.418,7.455,1.418h17.956 c2.101,0,3.833,1.732,3.833,3.833c0,0.473-0.105,0.893-0.21,1.313c-0.683,2.52-1.417,5.04-2.258,7.455 c-0.893,2.572-1.837,4.987-2.888,7.35c-0.525,1.208-1.155,2.363-1.837,3.57c3.675-1.627,7.14-3.518,10.343-5.617 c3.36-2.205,6.511-4.673,9.398-7.351c2.939-2.73,5.564-5.723,7.979-8.925c0.735-0.998,1.891-1.522,3.046-1.522h15.436 c2.729,0,5.197-0.473,7.455-1.418c2.258-0.944,4.357-2.362,6.301-4.253c1.89-1.89,3.307-3.99,4.252-6.248 c0.945-2.257,1.418-4.777,1.418-7.508V27.249c0-2.73-0.473-5.25-1.418-7.508c-0.945-2.258-2.362-4.358-4.252-6.248 c-1.891-1.89-3.991-3.308-6.248-4.252c-2.258-0.945-4.778-1.417-7.508-1.417H68.988V7.718L68.988,7.718z M38.325,52.816 c-0.918-0.882-1.394-2.057-1.418-3.239c-0.023-1.182,0.404-2.375,1.286-3.294c0.882-0.918,2.056-1.394,3.238-1.417 c1.183-0.024,2.375,0.401,3.294,1.285l7.941,7.64l15.808-20.081c-0.007-0.02,0.132-0.137,0.153-0.152 c1.905-1.649,4.779-1.466,6.463,0.411c1.686,1.88,1.549,4.767-0.308,6.477L55.81,63.54c0.009,0.009-0.104,0.108-0.117,0.119 c-0.888,0.779-2.01,1.162-3.125,1.143c-1.125-0.02-2.247-0.446-3.121-1.285L38.325,52.816L38.325,52.816z M46.097,0.053h41.845 c3.675,0,7.14,0.683,10.395,1.995c3.203,1.313,6.144,3.308,8.769,5.933c2.625,2.625,4.62,5.565,5.933,8.768 c1.313,3.203,1.994,6.668,1.994,10.396V67.99c0,3.728-0.682,7.192-1.994,10.396s-3.308,6.143-5.933,8.768s-5.565,4.568-8.769,5.933 c-3.202,1.313-6.667,1.995-10.395,1.995H74.396c-2.362,2.993-4.936,5.828-7.665,8.4c-3.256,3.045-6.721,5.775-10.448,8.19 c-3.728,2.468-7.718,4.62-11.971,6.458c-4.2,1.838-8.715,3.359-13.44,4.62c-1.365,0.367-2.835-0.053-3.833-1.155 c-1.417-1.575-1.26-3.99,0.315-5.408c2.205-1.942,4.095-3.938,5.618-5.932c1.47-1.943,2.678-3.938,3.57-5.986v-0.052 c0.998-2.205,1.891-4.463,2.678-6.721c0.262-0.787,0.525-1.627,0.788-2.467H27.091c-3.675,0-7.14-0.683-10.396-1.996 c-3.203-1.312-6.143-3.307-8.768-5.933c-2.625-2.625-4.62-5.564-5.933-8.768C0.683,75.078,0,71.613,0,67.938V27.091 c0-3.675,0.683-7.141,1.995-10.396c1.313-3.203,3.308-6.143,5.933-8.768c2.625-2.625,5.565-4.62,8.768-5.933S23.363,0,27.091,0 h18.953L46.097,0.053L46.097,0.053z" /></g></svg>
        </CardDataStats>
    )
}


export async function UnAnswered({ start, end }: { start: Date, end: Date }) {
    const { sessionClaims } = auth()
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/unanswered`, {
        shopDomain: sessionClaims?.metadata.shopDomain,
        startTime: start,
        endTime: end
    })
    const { count } = res.data;

    return (
        <CardDataStats title="Unanswered Questions" total={count}>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="22" viewBox="0 0 115.031 122.88" enable-background="new 0 0 115.031 122.88" ><g><path d="M46.097,0.053h41.845c3.675,0,7.14,0.683,10.395,1.995c3.203,1.313,6.144,3.308,8.769,5.933 c2.625,2.625,4.62,5.565,5.933,8.768c1.313,3.203,1.994,6.668,1.994,10.396V67.99c0,3.728-0.682,7.192-1.994,10.396 s-3.308,6.143-5.933,8.768s-5.565,4.568-8.769,5.933c-3.202,1.313-6.667,1.995-10.395,1.995H74.396 c-2.362,2.993-4.936,5.828-7.665,8.4c-3.256,3.045-6.721,5.775-10.448,8.19c-3.728,2.468-7.718,4.62-11.971,6.458 c-4.2,1.838-8.715,3.359-13.44,4.62c-1.365,0.367-2.835-0.053-3.833-1.155c-1.417-1.575-1.26-3.99,0.315-5.408 c2.205-1.942,4.095-3.938,5.618-5.932c1.47-1.943,2.678-3.938,3.57-5.986v-0.052c0.998-2.205,1.891-4.463,2.678-6.721 c0.262-0.787,0.525-1.627,0.788-2.467H27.091c-3.675,0-7.14-0.683-10.396-1.996c-3.203-1.312-6.143-3.307-8.768-5.933 c-2.625-2.625-4.62-5.564-5.933-8.768C0.683,75.078,0,71.613,0,67.938V27.091c0-3.675,0.683-7.141,1.995-10.396 c1.313-3.203,3.308-6.143,5.933-8.768c2.625-2.625,5.565-4.62,8.768-5.933S23.363,0,27.091,0h18.953L46.097,0.053L46.097,0.053z M65.572,31.489c-0.005-0.02,0.141-0.125,0.163-0.139c2.019-1.483,4.854-1.073,6.372,0.92c1.521,1.998,1.156,4.847-0.819,6.395 l-7.53,7.979l-0.014,0.016c2.847,2.532,5.87,5.257,9.555,8.669c0.02-0.005,0.125,0.141,0.139,0.164 c1.483,2.019,1.074,4.853-0.92,6.372c-1.997,1.521-4.847,1.157-6.395-0.819l-8.121-7.771l-7.575,8.725 c-1.367,2.104-4.174,2.718-6.297,1.378c-2.12-1.337-2.777-4.124-1.477-6.266c0.011-0.023,0.104-0.178,0.123-0.175 c3.345-3.693,6.028-6.722,8.537-9.565l-8.521-7.186c-2.105-1.368-2.718-4.174-1.378-6.298c1.337-2.119,4.125-2.777,6.266-1.477 c0.024,0.012,0.178,0.104,0.176,0.123c3.563,3.228,6.508,5.839,9.264,8.271C59.589,38.027,62.257,35.07,65.572,31.489 L65.572,31.489z M68.988,7.718H27.144c-2.73,0-5.25,0.473-7.508,1.418c-2.258,0.945-4.357,2.362-6.248,4.252 c-1.89,1.89-3.307,3.99-4.252,6.248c-0.945,2.258-1.417,4.777-1.417,7.508V67.99c0,2.73,0.473,5.25,1.417,7.508 c0.945,2.258,2.363,4.357,4.252,6.248c1.943,1.89,4.043,3.36,6.301,4.252c2.258,0.945,4.725,1.418,7.455,1.418h17.956 c2.101,0,3.833,1.732,3.833,3.833c0,0.473-0.105,0.893-0.21,1.313c-0.683,2.52-1.417,5.04-2.258,7.455 c-0.893,2.572-1.837,4.987-2.888,7.35c-0.525,1.208-1.155,2.363-1.837,3.57c3.675-1.627,7.14-3.518,10.343-5.617 c3.36-2.205,6.511-4.673,9.398-7.351c2.939-2.73,5.564-5.723,7.979-8.925c0.735-0.998,1.891-1.522,3.046-1.522h15.436 c2.729,0,5.197-0.473,7.455-1.418c2.258-0.944,4.357-2.362,6.301-4.253c1.89-1.89,3.307-3.99,4.252-6.248 c0.945-2.257,1.418-4.777,1.418-7.508V27.249c0-2.73-0.473-5.25-1.418-7.508c-0.945-2.258-2.362-4.358-4.252-6.248 c-1.891-1.89-3.991-3.308-6.248-4.252c-2.258-0.945-4.778-1.417-7.508-1.417H68.988V7.718L68.988,7.718z" /></g></svg>
        </CardDataStats>
    )
}