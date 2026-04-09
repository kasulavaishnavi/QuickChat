import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import groq from "../configs/groq.js";

const textMsgController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    // Save User Message
    const userMessage = {
      role: "user",
      content: prompt,
      timeStamps: Date.now(),
      isImage: false,
    };
    chat.messages.push(userMessage);

    // Groq API
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "",
        },
        { role: "user", content: prompt },
      ],
    });

    const aiText = completion.choices[0].message.content;

    // Assistant Reply
    const reply = {
      role: "assistant",
      content: aiText,
      timeStamps: Date.now(),
    };
    chat.messages.push(reply);

    await chat.save();
    await User.updateOne({ _id: userId });

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
