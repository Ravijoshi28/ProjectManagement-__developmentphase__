import { axiosInstance } from "@/app/lib/axios"



export const getNotification=async() => {
    const res=await axiosInstance.get("/notifications");
    return res.data.data;
}