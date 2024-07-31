import Link from "next/link"

export default function ({ heading, message, time }: {
    heading: string,
    message: string,
    time: string
}) {
    return (

        <Link
            className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
            href="#"
        >
            <div className="text-sm">
                <div className="text-black dark:text-white">
                    {heading}
                </div>{" "}
                {message}
            </div>
            <p className="text-xs">{time}</p>
        </Link>

    )
}