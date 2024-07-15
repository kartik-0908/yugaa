import React from 'react';
import Image from 'next/image';
import { stringify } from 'postcss';

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

interface ParsedMessage {
  reply: string;
  products: { name: string; price: string; imageUrl: string }[];
}
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const newminutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + newminutes + ' ' + ampm;
  return "Sent at " + strTime;
};


const ConversationDetails: React.FC<{ conversations: Conversation[] }> = ({ conversations }) => {
  const splitMessage = (text: string) => {
    const words = text.split(' ');
    let chunks: string[] = [];
    let currentChunk: string[] = [];

    words.forEach(word => {
      currentChunk.push(word);
      const chunkText = currentChunk.join(' ');
      if (chunkText.split(' ').length > 30 && (word.endsWith('.') || word.endsWith(':'))) {
        chunks.push(chunkText);
        currentChunk = [];
      }
    });
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }
    return chunks;
  };

  const createCardElement = (messageText: string, isUser: boolean) => {
    messageText = messageText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    return (
      <div
        className={`rounded-lg px-4 py-2 max-w-100 ${isUser ? 'bg-blue-500 text-white' : 'bg-gray text-black'}`}
        dangerouslySetInnerHTML={{ __html: messageText }}
      />
    );
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-8 h-[600px] overflow-y-auto">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Conversation Details
      </h4>
      <div className="px-7.5">
        {conversations.map((conversation) => (
          <div key={conversation.id}>
            <h5 className="mb-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">User joined</h5>
            {conversation.Message.map((message) => {
              let parsedMessage: ParsedMessage | null = null;

              if (message.senderType !== 'user') {
                try {
                  parsedMessage = JSON.parse(message.text);
                } catch (error) {
                  console.error('Failed to parse message JSON:', error);
                }
              }

              return (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.senderType === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div>
                    {message.senderType === 'user' ? (
                      <>
                        {createCardElement(message.text, true)}
                        <p className="text-xs text-gray-500 pt-1">{formatTime(message.timestamp)}</p>
                      </>
                    ) : (
                      <>
                        {parsedMessage && (
                          <>
                            {splitMessage(parsedMessage.reply).map((chunk, index) => (
                              <div className='pt-2' key={index}>
                                {createCardElement(chunk, false)}
                              </div>
                            ))}
                          </>
                        )}
                        <p className="text-xs text-gray-500 text-right pt-1">{formatTime(message.timestamp)}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationDetails;
