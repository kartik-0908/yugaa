import Link from "next/link";
import Image from "next/image";

const ChatCard = ({ data }: any) => {
  return (
    <div className="p-4 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-lg">
        Recent conversations
      </h4>
      <div>
        {data.map((tickets: any, index: any) => {
          const customerEmail = "Anonymous user";
          const id = tickets.id;
          const messages = tickets.messages
          messages.map((message: any) => {
            message.createdAt = new Date(message.createdAt)
          })
          messages.sort((a: any, b: any) => a.createdAt - b.createdAt);
          console.log(messages)


          return (
            <Link href={`/chat-history/${id}`} className="flex items-center gap-5 px-7.5 py-3 " key={index}>
              <div className="relative h-14 w-14 rounded-full">
                <Image src='/images/user/user-01.png' alt="User" layout="fill" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium ">
                    {customerEmail}
                  </h5>
                  <div className="text-sm ">
                    {messages.map((message: any) => {
                      if (message.sender === 'ai') {
                        return (
                          <div>
                            {`Bot: ${message.message}`}
                          </div>
                        )
                      }
                      else {
                        return (
                          <div>
                            {`User: ${message.message}`}
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ChatCard;
