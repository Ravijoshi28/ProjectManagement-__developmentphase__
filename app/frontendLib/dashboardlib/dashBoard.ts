import { axiosInstance } from "@/app/lib/axios"

export const recentActivity=async()=>{
    const res=await axiosInstance.get("/dashboard/recentActivity");
    return res.data.message;
}

export const userDeadline=async()=>{
    const res=await axiosInstance.get("/dashboard/userDeadlines");
    return res.data.message;
}