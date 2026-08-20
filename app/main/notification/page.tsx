"use client";

import { getNotification } from "@/app/frontendLib/notifications/notifications";
import { socket } from "@/app/lib/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  TriangleAlert,
  BellOff,
} from "lucide-react";
import { useEffect } from "react";

interface NotificationItem {
  _id: string;
  senderId: string;
  sendername: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  projectId: string|null;
  taskId:string|null
  createdAt?: string;
}

export default function Notification() {
 const {

data: notifications = [],

isLoading,

error,

} = useQuery<NotificationItem[], Error>({

queryKey: ["Notifications"],

queryFn: getNotification,
staleTime:5*60*1000

});
const queryClient=useQueryClient();
useEffect(()=>{
    const refetch=async()=>{
      await queryClient.refetchQueries({
        queryKey:["Notifications"]
      })
    }

     socket.on("notification",refetch);

     return ()=>{
      socket.off("notification",refetch);
     }
},[])

  const getAlertStyles = (type?: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50 border-emerald-200/80",
          text: "text-emerald-800",
          desc: "text-emerald-600",
          icon: (
            <CheckCircle2
              size={16}
              className="text-emerald-500 shrink-0"
            />
          ),
        };

      case "error":
        return {
          bg: "bg-red-50 border-red-200/80",
          text: "text-red-800",
          desc: "text-red-600",
          icon: (
            <AlertCircle
              size={16}
              className="text-red-500 shrink-0"
            />
          ),
        };

      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200/80",
          text: "text-amber-800",
          desc: "text-amber-600",
          icon: (
            <TriangleAlert
              size={16}
              className="text-amber-500 shrink-0"
            />
          ),
        };

      default:
        return {
          bg: "bg-white border-slate-200",
          text: "text-slate-800",
          desc: "text-slate-500",
          icon: (
            <Info
              size={16}
              className="text-blue-500 shrink-0"
            />
          ),
        };
    }
  };

  if (isLoading) {
    return (
      <div className="fixed top-20 left-30 z-50 sm:top-20 sm:left-10">
        <div className="p-3 rounded-xl border bg-white shadow-sm text-sm">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" z-50">
        <div className="p-3 rounded-xl border bg-red-50 text-red-600 shadow-sm text-sm">
          Failed to load notifications
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="fixed top-13 left-5 z-1 w-full max-w-sm p-4 md:left-50">
        <div className="flex items-center gap-3 p-3 rounded-xl border bg-white shadow-sm">
          <BellOff
            size={16}
            className="text-slate-400"
          />
          <p className="text-sm text-slate-500">
            No new notifications
          </p>
        </div>
      </div>
    );
  }

  return (
<div className=" flex flex-col gap-3 w-full max-w-sm sm:max-w-md p-4">      {notifications.map((notification) => {
        const styles = getAlertStyles(notification.type);

        return (
          <div
            key={notification._id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-md ${styles.bg}`}
          >
            {styles.icon}

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold ${styles.text}`}
              >
                {notification.title}
              </p>

              <p
                className={`text-xs mt-1 ${styles.desc}`}
              >
                {notification.message}
              </p>

              <p className="text-[10px] text-slate-400 mt-2">
                From: {notification.sendername}
              </p>
            </div>

            <button
              className="p-1 rounded hover:bg-slate-100"
              type="button"
            >
              <X
                size={14}
                className="text-slate-400"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
