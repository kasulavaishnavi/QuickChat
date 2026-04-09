import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    messages: [
      {
        isPublished: { type: Boolean, required: false },
        role: { type: String, required: true },
        content: { type: String, required: true },
        timeStamps: { type: Number, required: true },
      },
    ],
  },
  { timeStamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
