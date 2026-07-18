import { axiosInstance } from "@/app/lib/axios";

interface File{
  url:string,
  mimeType:string
}

interface SendMessageArgs {
  projectId: string
  message: {
    content:string,
    file:File,
    type:string
  };
}

export const sendMessage = async ({
  projectId,
  message,
}: SendMessageArgs) => {
  
console.log(message)
try{
  const res = await axiosInstance.post(
    `/messages/${projectId}/sendMessage`,
    message
  );
   return res.data.messages;  
}catch(error){
console.log(error)
}



 
};

export const getMessages=async(projectId:string)=>{
    const res=await axiosInstance.get(`/messages/${projectId}/getMessage`);
    console.log(res);
    return res.data.messages;
}