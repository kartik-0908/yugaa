"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Message {
  id: string;
  conversationId: string;
  timestamp: string;
  senderId: number;
  text: string;
  senderType: string;
  unanswered: boolean;
}

interface Conversation {
  id: string;
  shopDomain: string;
  startedAt: string;
  Message: Message[];
}

interface TicketConversation {
  id: number;
  ticketId: string;
  conversationId: string;
  shopDomain: string;
  createdAt: string;
  updatedAt: string;
  Conversation: Conversation;
}

interface Ticket {
  id: string;
  shopDomain: string;
  createdAt: string;
  updatedAt: string;
  TicketConversation: TicketConversation[];
}

type ChatData = Ticket[];

interface ChatCard2Props {
  onConversationClick: (conversations: Conversation[]) => void;
  setHasConversations: (hasConversations: boolean) => void;
  filter: string; // Accept filter prop
}

const ChatCard2: React.FC<ChatCard2Props> = ({ onConversationClick, setHasConversations, filter }) => {
  const [chatData, setChatData] = React.useState<ChatData>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const isDuplicate = (newTickets: any, existingTickets: any) => {
    const existingIds = new Set(existingTickets.map((ticket: any) => ticket.id));
    return newTickets.filter((ticket: any) => !existingIds.has(ticket.id));
  };

  const fetchMoreData = async () => {
    try {
      const response = await axios.get(`/api/v1/data/chat?page=${page}&limit=${limit}`);
      const data = response.data;

      if (data.data && data.data.length > 0) {
        const filteredData = data.data.filter((ticket: Ticket) => {
          if (filter === 'unanswered') {
            return ticket.TicketConversation.some(tc =>
              tc.Conversation.Message.some(message => message.unanswered)
            );
          }
          return true;
        });

        const uniqueFilteredData = isDuplicate(filteredData, chatData);

        setChatData((prevData) => [...prevData, ...uniqueFilteredData]);
        setHasConversations(true);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
        if (chatData.length === 0) {
          setHasConversations(false);
        }
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  useEffect(() => {
    // Reset page and chat data, then fetch initial data
    setChatData([]);
    setPage(1);
  }, [filter]);

  useEffect(() => {
    fetchMoreData();
  }, [page]);

  useEffect(() => {
    // fetchMoreData();
  }, [filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    window.location.href = `/chat?filter=${newFilter}`;
  };

  const handleTicketClick = (ticketId: string, conversations: Conversation[]) => {
    setSelectedTicketId(ticketId);
    onConversationClick(conversations);
  };

  return (
    <div className="h-[600px] overflow-y-auto col-span-12 rounded-sm border border-stroke bg-white py-6 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="flex justify-between items-center px-7.5 mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Tickets
        </h4>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="unanswered">Unanswered</option>
        </select>
      </div>
      <div>
        <InfiniteScroll
          dataLength={chatData.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {chatData.map((ticket) => {
            const firstTicketConversation = ticket.TicketConversation[0];
            if (!firstTicketConversation) {
              return null;
            }

            const conversation = firstTicketConversation.Conversation;
            const messages = conversation.Message.slice(0, 2); // Get the first two messages
            const firstMessage = messages[0];
            let firstMessageText;
            let secondMessageText;

            if (firstMessage.senderType === "user") {
              firstMessageText = truncateText(firstMessage.text, 10);
            } else {
              firstMessageText = truncateText(JSON.parse(firstMessage.text).reply, 10);
            }

            const secondMessage = messages[1];
            if (secondMessage && secondMessage.senderType === "user") {
              secondMessageText = truncateText(secondMessage.text, 10);
            } else if (secondMessage) {
              secondMessageText = truncateText(JSON.parse(secondMessage.text).reply, 10);
            }

            return (
              <Link
                href="#"
                className={`flex items-center gap-5 px-7.5 py-3 ${selectedTicketId === ticket.id ? 'bg-blue-200' : 'hover:bg-gray-3 dark:hover:bg-meta-4'}`}
                onClick={(e) => {
                  e.preventDefault(); // Prevent link navigation
                  handleTicketClick(ticket.id, ticket.TicketConversation.map(tc => tc.Conversation)); // Pass all conversations of the ticket
                }}
                key={ticket.id}
              >
                <div className="relative h-14 w-14 rounded-full">
                  <Image
                    src="/images/user/user-01.png"
                    alt="User"
                    layout="fill"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      Anonymous user
                    </h5>
                    <p className="text-sm text-black dark:text-white">
                      {firstMessage && (
                        <div>
                          {firstMessage.senderType}: {firstMessageText}
                        </div>
                      )}
                      {secondMessage && (
                        <div>
                          {secondMessage.senderType}: {secondMessageText}
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatCard2;
