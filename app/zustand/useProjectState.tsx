import { create } from "zustand"
import { persist } from "zustand/middleware";







interface useProject{
    projectId:string |null,
    setProjectId:(projectId:string)=>Promise<void>
}



export const useProjectState=create<useProject>()(persist((set,get)=>({
   projectId:null,
   projectMember:null,

   setProjectId:(projectId)=>{
    set({projectId:projectId})
    
   }
       
})))

