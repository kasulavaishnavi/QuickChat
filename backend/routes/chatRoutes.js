import express from "express";
import {
  chatCreate,
  deleteChats,
  getChats,
} from "../controllers/chatController.js";
import auth from "../middlewares/auth.js";

const chatRouter = express.Router();

chatRouter.post("/create", auth, chatCreate);
chatRouter.get("/get", auth, getChats);
chatRouter.delete("/delete/:chatId", auth, deleteChats);

export default chatRouter;
