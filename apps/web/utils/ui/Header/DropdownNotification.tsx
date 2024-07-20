"use client"
import { use, useState } from "react";
import Notification from "./Notification";
import { Badge, Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { fetchNotifications } from "../../../actions/analytics";
import { markNotificationAsRead } from "../../../actions/header";
import { Bell, Check, Eye } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

const DropdownNotification = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  const [start] = useState(new Date());
  const payload = {
    type: "notification",
    userId: user?.id,
    start: start.toISOString(),
  }
  const { data, isLoading, error } = useSWR(JSON.stringify(payload), fetchNotifications, {
    refreshInterval: 1000 * 10,
    keepPreviousData: true,
  });
  let badgeValue = 0;
  if (isLoading) {
    return <div>Loading</div>
  }

  if (error) {
    return <div>Error</div>
  }
  data?.map(noti => {
    if (!noti.isRead) {
      badgeValue++
    }
  })
  // console.log(`notification data`, data)
  return (
    <Popover placement="bottom-end" showArrow offset={10}>
      <PopoverTrigger>
        <div className="p-4">
          {badgeValue != 0 && <Badge color="danger" content={badgeValue} isInvisible={false} shape="circle">
            <svg
              className="cursor-pointer"
              fill="none"
              height={24}
              viewBox="0 0 24 24"
              width={24}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
                fill='currentColor'
                fillRule="evenodd"
              />
            </svg>
          </Badge>}
          {
            badgeValue === 0 && (
              <svg
              className="cursor-pointer"

                fill="none"
                height={24}
                viewBox="0 0 24 24"
                width={24}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
                  fill='currentColor'
                  fillRule="evenodd"
                />
              </svg>
            )
          }

        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <div className=" h-[200px] overflow-y-auto">
          {data?.length ? (
            <>
              {data?.map((notification) => (
                <div className={` p-1 rounded-lg border-b border-stroke ${notification.isRead ? 'bg-gray-100' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold m-0">{notification.title}</h3>
                    {notification.isRead ? (
                      <Eye className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-1 mt-1">{notification.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{notification.createdAt.toDateString()}</span>
                    {!notification.isRead && (
                      <button
                        onClick={() => {
                          markNotificationAsRead(notification.id)
                        }}
                        className="flex items-center text-blue-500 hover:text-blue-600"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center p-4">
              <p className="text-lg font-medium">No new notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownNotification;
