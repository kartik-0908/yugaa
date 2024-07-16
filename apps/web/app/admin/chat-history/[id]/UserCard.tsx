export default function ({ message, time }: any) {
    return (
        <div className="flex w-full mb-4 ">
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-red rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">U</span>
            </div>
            <div className="w-[80%] ml-3 ml-0 w-fit">
                <div className="rounded-tl-lg rounded-b-lg bg-blue-100 cursor-pointer p-2">
                    <div className="color-[#ADBAC7]">
                        {message}
                    </div>

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