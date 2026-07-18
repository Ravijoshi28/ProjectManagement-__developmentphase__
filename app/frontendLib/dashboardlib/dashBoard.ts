import { axiosInstance } from "@/app/lib/axios"

export const recentActivity=async()=>{
    const res=await axiosInstance.get("/dashboard/recentActivity");
    console.log(res.data.message)
    return res.data.message;
}

export const userDeadline=async()=>{
    const res=await axiosInstance.get("/dashboard/userDeadlines");
    console.log(res.data.message)
    return res.data.message;
}