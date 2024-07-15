// ConversationDetails.tsx
import React from 'react';
import Image from 'next/image';

interface Message {
  id: string;
  timestamp: string;
  senderId: number;
  text: string;
  senderType: string;
}

interface Conversation {
  id: string;
  Message: Message[];
}

const ConversationDetailsEmpty = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-8 h-[600px] overflow-y-auto ">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Conversation Details
      </h4>
      <div className="px-7.5">
        <h1>Select any conversation to see</h1>
      </div>
    </div>
  );
};

export default ConversationDetailsEmpty;