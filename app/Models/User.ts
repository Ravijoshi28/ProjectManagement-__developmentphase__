import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password:{
        type:String,
    },

    image: {
      type: String,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    bio: {
      type: String,
    },

    provider: {
      type: String,
      enum: ["google", "github"],
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeenAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);