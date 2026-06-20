import { axiosInstance } from "@/app/lib/axios";



interface SendMessageArgs {
  projectId: string
  formData: {
    message: string;
  };
}

export const sendMessage = async ({
  projectId,
  formData,
}: SendMessageArgs) => {
  

  const res = await axiosInstance.post(
    `/messages/${projectId}/sendMessage`,
    formData
  );

  return res.data.messages;
};

export const getMessages=async(projectId:string)=>{
    const res=await axiosInstance.get(`/messages/${projectId}/getMessage`);
    console.log(res);
    return res.data.messages;
}