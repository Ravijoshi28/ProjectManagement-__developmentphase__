import { axiosInstance } from "@/app/lib/axios";

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  status: string;
}
interface createTaskProp{
    projectId:string,
    formData:TaskFormData
}
interface createProjectProp{
  name:string,
  about:string
}


export const getProject=async()=>{
    const res=await axiosInstance.get("/project/getProject");
    console.log(res.data.projects);
    return res.data.projects;
}

export const getProjectTask=async(projectId:string)=>{
    
    const res=await axiosInstance.get(`/project/getProjectTask/${projectId}`);
   
    return res.data.data;
}

export const createTask=async({projectId,formData}:createTaskProp)=>{
    const res=await axiosInstance.post(`/project/createTask/${projectId}`,formData)
    return res.data.message;
}

export const AddMembers=async ({
  projectId,
  formdata,
}: {
  projectId: string;
  formdata: {
    addedEmail: {
      email: string;
      id: string;
    }[];
  };
})=>{
    console.log(projectId);
    const res=await axiosInstance.post(`/project/addMembers?project=${projectId}`,formdata);
}

export const AssignTask=async(formdata:{
  taskId:string,
  member:string | null
})=>{
 await axiosInstance.patch("/project/assign",formdata);
} 

export const createProject=async(formData:createProjectProp)=>{
    const res=await axiosInstance.post(`/project/createProject`,formData)
    return res.data.message;
}