import { axiosInstance } from "@/app/lib/axios"



export const UserTasks=async(userId:string | null)=>{
   
const res=await axiosInstance.get(`/user/usertask?user=${userId}`);
      return res.data.message;
} 

export const updateTaskStatus=async(taskId:string,status:string)=>{
    await axiosInstance.patch(`/project/updateStatus?task=${taskId}`,{status})
} 