"use client"
import { useState } from "react";
import { Badge } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { fetchNotifications } from "../../../actions/analytics";
import { markNotificationAsRead } from "../../../actions/header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { timeDifference } from "../../../common/function";

const DropdownNotification = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [badgeValue, setBadgeValue] = useState(0);

  const [start] = useState(new Date());
  const payload = {
    type: "notification",
    userId: user?.id,
    start: start.toISOString(),
  }
  const { isLoading, error } = useSWR(
    JSON.stringify(payload),
    fetchNotifications,
    {
      refreshInterval: 1000,
      onSuccess: (data) => {
        setNotifications(data);
        setBadgeValue(data.filter(noti => !noti.isRead).length);
      }
    }
  );

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prevNotifications: any[]) =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setBadgeValue(prevValue => Math.max(0, prevValue - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  return (
    <DropdownMenu >
      <DropdownMenuTrigger className="focus:outline-none">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="relative right-2 bg-white w-[340px]">
        <Card style={{
          maxHeight: "400px",
          maxWidth: "380px"
        }} className={cn("border-none overflow-y-auto ")} >
          <CardHeader className="">
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[200px] overflow-y-auto">
            <div >
              {notifications?.map((notification, index) => (
                <div
                  key={index}
                  className="mb-0 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm leading-none text-muted-foreground ${notification.isRead ? "" : "font-bold"}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {timeDifference(notification.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm text-muted-foreground ${notification.isRead ? "" : "font-bold"}`}>
                      {notification.content}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      className="max-h-[30px]"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Separator style={{
                    backgroundColor: "rgba(0,0,0,.1)",

                  }} className="mt-2" />
                </div>

              ))}
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownNotification;
