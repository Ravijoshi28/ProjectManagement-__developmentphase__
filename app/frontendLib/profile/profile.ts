import { axiosInstance } from "@/app/lib/axios";
interface Data{
    name:string,
    image:string | null
}
export const changeProfile =async(data:Data)=>{
        const res=axiosInstance.patch("/profile",data)

}