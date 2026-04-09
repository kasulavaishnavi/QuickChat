import Chat from "../models/chatModel.js";
import User from "../models/usermodel.js";
import groq from "../configs/groq.js"; // Import the new Groq config

const textMsgController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    // 1. Save User Message
    const userMessage = {
      role: "user",
      content: prompt,
      timeStamps: Date.now(),
      isImage: false,
    };
    chat.messages.push(userMessage);

    // 2. Call Groq API
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "Give short and clear answers." },
        { role: "user", content: prompt },
      ],
    });

    const aiText = completion.choices[0].message.content;

    // 3. Save Assistant Reply
    const reply = {
      role: "assistant",
      content: aiText,
      timeStamps: Date.now(),
    };
    chat.messages.push(reply);

    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Groq Error:", error);
    res.json({
      success: false,
      message: "AI is currently unavailable. Please try again.",
    });
  }
};

export default textMsgController;
