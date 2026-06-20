import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender:{
        type:String,
        required:true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "task_assigned",
        "task_updated",
        "project_invite",
      ],
    },

    seen: {
      type: Boolean,
      default: false,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks",
    },
  },
  {
    timestamps: true,
  }
);

    NotificationSchema.index({
        userId:1
    });

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);