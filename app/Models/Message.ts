import mongoose from "mongoose";


const MessageSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
         required:true
    },
    content:{
        type:String,
         required:true
    },
    type:{
        type:String,
        enum:["text","image","file","system"]
    },
    replyTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    edited:{
        type:Boolean
    },
    editedDate:{
        type:Date
    },

},{
    timestamps:true
})

        MessageSchema.index({
            projectId:1
        })
         MessageSchema.index({
            senderId:1
        })
         


export default mongoose.models.Message || mongoose.model("Message",MessageSchema)