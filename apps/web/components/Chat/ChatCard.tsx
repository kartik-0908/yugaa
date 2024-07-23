import Link from "next/link";
import Image from "next/image";

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const ChatCard = ({ data }: any) => {
  console.log(data)
  console.log("data.events")
  return (
    <div className="p-4 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-lg">
        Recent conversations
      </h4>
      <div>

        {data?.map((ticket: any) => {
          const customerEmail = "Anonymous user";
          const id = ticket.id;
          const { events } = ticket;

          // Get the last event, regardless of type
          const lastEvent = events[events.length - 1];

          if (lastEvent) {
            let messageContent = '';
            let sender = '';

            if (lastEvent.type === 'AI_TO_USER') {
              messageContent = lastEvent.AI_TO_USER.message;
              sender = 'Bot';
            } else if (lastEvent.type === 'USER_TO_AI') {
              messageContent = lastEvent.USER_TO_AI.message;
              sender = 'User';
            }
            const truncatedMessage = truncateText(messageContent, 10);


            return (
              <Link href={`/chat-history/${id}`} className="flex items-center gap-5 px-7.5 py-3 text-black" key={id}>
                <div className="relative h-14 w-14 rounded-full">
                  <Image src='/images/user/user-01.png' alt="User" layout="fill" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <h5 className="font-medium">
                      {customerEmail}
                    </h5>
                    <div className="text-sm">
                      <div>
                        {`${sender}: ${truncatedMessage}`}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          }
          return null; // If there are no events, don't render anything for this ticket
        })}
      </div>
    </div>
  );
};

export default ChatCard;
