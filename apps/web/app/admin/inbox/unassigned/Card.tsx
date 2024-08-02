import { usePathname } from "next/navigation";

function formatTimeDifference(timestamp: string): string {
    const now: Date = new Date();
    const messageTime: Date = new Date(timestamp);
    const timeDifference: number = now.getTime() - messageTime.getTime();

    const seconds: number = Math.floor(timeDifference / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);

    if (seconds < 60) {
        return `${seconds}s`;
    } else if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else {
        return `${days}d`;
    }
}

function truncateString(str: string, numWords: number = 5): string {
    if(str === null || str === undefined) {
        return "";
    }
    if(str.length <= numWords) {
        return str;
    }
    const words = str.split(/\s+/);

    if (words.length <= numWords) {
        return str;
    }

    // Join the first `numWords` words and add ellipsis
    return words.slice(0, numWords).join(' ') + '...';
}


export default function Card({ id, time, name, messages }: { id: string, messages: string, time: string, name: string }) {
    const  pathname = usePathname()
    return (
        <div className={`flex flex-col p-4 border-b-[1px] border-b-[#D3D3D3] ${pathname.includes(id) ? "bg-gray-100" : ""}`}>
            <div className="flex justify-between gap-2">
                <div className="flex items-center">
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-red rounded-full dark:bg-gray-600">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{name? name.substring(0,1) : "A"}</span>
                    </div>
                    <div className="ml-1.5">
                        <p className="leading-4 font-bold">{name}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <p className="text-sm">
                        {formatTimeDifference(time)}
                    </p>

                </div>
            </div>
            <p className="text-sm leading-4 text-ellipsis font-normal mt-2">
                {truncateString(messages)}
            </p>
        </div>
    );
}
