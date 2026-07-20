import { axiosInstance } from "@/app/lib/axios"



export const UserTasks=async(userId:string | null)=>{
   
    console.log("working")
const res=await axiosInstance.get(`/user/usertask?user=${userId}`);
    console.log(res);
      return res.data.message;
} 

export const updateTaskStatus=async(taskId:string,status:string)=>{
    await axiosInstance.patch(`/project/updateStatus?task=${taskId}`,{status})
} 