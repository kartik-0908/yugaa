function splitMessages(messageString: string): string[] {
    const messages = messageString.split('\n\n');
    return messages
        .map(msg => msg.trim())
        .filter(msg => msg.length > 0);
}
function formatMessage(message: string) {
    const parts = message.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}
export default function ({ message, time }: any) {
    const formattedMessages = splitMessages(message)
    // console.log(formattedMessages)
    return (
        <div className="flex w-full mb-4 flex-row-reverse">
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">Y</span>
            </div>
            <div className="max-w-[55%] mr-3">
                {
                    formattedMessages.map((msg) => {
                        return (
                            <div className="rounded-tl-lg rounded-b-lg bg-blue-300 cursor-pointer p-2 mb-2 ">
                                <p className="color-[#ADBAC7] text-pretty m-0">
                                    {formatMessage(msg)}
                                </p>
                            </div>
                        )
                    })
                }
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