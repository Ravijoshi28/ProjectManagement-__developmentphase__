import { axiosInstance } from "@/app/lib/axios";

interface geminiData{
    text:string,
    file:{
        url:string,
        mimeType:string
    }
}
export  const AiAnalysis=async(data:geminiData)=>{

    try {
        const res=await axiosInstance.post('/gemini/sendmessage',data);
        return res;
    } catch (error) {
        
    }
}

export  const  FetchData=async()=>{

    try {
       const res=await axiosInstance.get('/gemini/fetchMessage');
       return res.data;
    } catch (error) {
        
    }
}
