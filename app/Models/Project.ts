
import mongoose from "mongoose";

const ProjectSchema=new mongoose.Schema({
    name:
    {type:String,required:true},

    image:{
        type:String
    },

    about:{
        type:String,
        default:" "
    },

    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: "User",}

}, 
{
    timestamps: true,
  })

  

export default mongoose.models.Project || mongoose.model("Project",ProjectSchema);
