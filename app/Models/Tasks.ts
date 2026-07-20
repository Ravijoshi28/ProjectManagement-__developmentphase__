import { db } from "../lib/astradb";

import { Tasks } from "./typeValidator";

export const tasks=db.collection<Tasks>("tasks");
// import mongoose from "mongoose";

// const TaskSchema=new mongoose.Schema({
//     projectId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Project",
//         required:true
//     },
//     title:{
//         type:String,
//         required:true
//     },
//     description:{
//         type:String,

//     },
//     priority:{
//         type:String,
//         enum:["High Priority" ,"Medium Priority","Low Priority"]
//     },
//     status:{
//         type:String,
//         enum:["To Do","In Progress","Review","Completed"]
//     },
//     dueDate:{
//         type:Date,
//         required:true
//     },
//     completedAt:{
//         type:Date
//     },
//     assignedTo:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     },
//     watchers:{
//          type: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }],
//     default: []
//     }

// },{timestamps:true})

//     TaskSchema.index({
//          projectId:1
//         })

//         TaskSchema.index({
//          assignedTo:1
//         })
   

// export default mongoose.models.Task || mongoose.model("Task",TaskSchema);