import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Skeleton } from '@nextui-org/react';

const TextMessage = ({ heading, message }: { heading: string, message: string }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (heading) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{heading}</h2>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            aria-label="Copy text"
                        >
                            {copied ? (
                                <Check className="h-5 w-5 text-green-500" />
                            ) : (
                                <Copy className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    {message ? (
                        <p className="mt-2 text-gray-600">{message}</p>

                    ) : (
                        <Skeleton
                        >
                            <p className="mt-2 text-gray-600">This is a long messagemessagemessagemessag for skleleton</p>

                        </Skeleton>
                    )}
                </div>
            </div>
        );
    }


};

export default TextMessage;