import { db } from "../lib/astradb";
import { projectMembers } from "./typeValidator";

export const pMembers = db.collection<projectMembers>("pMembers");





// import mongoose from "mongoose";


// const PMemberSchema=new mongoose.Schema({
//     projectId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Project"
//     },
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     },
//     role:{
//       type:String,
//         enum:["admin","member"]
//     },
// },{
//     timestamps:true
// });

//         PMemberSchema.index({
//             projectId:1
//         })

//          PMemberSchema.index({
//             userId:1
//         })
         


// export default mongoose.models.PMember || mongoose.model("PMember",PMemberSchema)