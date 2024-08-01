
export default function ({ message, time }: any) {
    return (
        <div className="flex w-full mb-4 flex-row-reverse">
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">Y</span>
            </div>
            <div className="max-w-[55%] mr-3">
                <div className="rounded-tl-lg rounded-b-lg bg-blue-300 cursor-pointer p-2 mb-2 ">
                    <pre className=" whitespace-pre-wrap break-words font-sans text-black text-sm m-0">
                        {message}
                    </pre>
                </div>
                <div className="flex justify-end">
                    <div className="flex items-center mt-2">
                        <p className="text-xs">
                            {time}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}