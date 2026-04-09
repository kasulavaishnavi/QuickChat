import Chat from "../models/chatModel.js";

//new chat api
const chatCreate = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatData = {
      userId,
      messages: [],
      name: "new Chat",
      userName: req.user.name,
    };
    await Chat.create(chatData);
    res.json({ success: true, message: "chat Created" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

//api for getting all chats
const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//api for deleting chat
const deleteChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;
    await Chat.deleteOne({ _id: chatId, userId });
    console.log("chatId:", chatId);
    res.json({ success: true, message: "chat deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { chatCreate, getChats, deleteChats };
