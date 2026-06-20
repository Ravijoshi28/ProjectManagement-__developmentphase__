import {create} from "zustand"
import { axiosInstance } from "../lib/axios";
import { persist } from "zustand/middleware";

interface Formdata{
    email:string,
    password:string
}

interface user{
    username:string,
    email:string,
    id:string
}



interface ZustandState {
  
    loggedin:boolean,
    user:user,
  signup: (formdata:Formdata) => Promise<void>;
  login: (formdata:Formdata) => Promise<void>;
  logout:()=>Promise<void>
}


export const useUserState=create<ZustandState>()(persist((set)=>({
   user:null,
   loggedin:false,

    login:async(formdata:Formdata)=>{
        const response=await axiosInstance.post("/auth/login",formdata)
       
        set({loggedin:true});
        console.log(response.data.user)
        
        set({user:response.data.user})
       
    },

    signup:async()=>{

    },

    logout:async()=>{
        const response =await axiosInstance.post("/auth/logout");
    }

})))