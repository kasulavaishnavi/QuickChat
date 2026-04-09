import express from "express";
import auth from "../middlewares/auth.js";
import textMsgController from "../controllers/messageController.js";

const msgRouter = express.Router();

msgRouter.post("/text", auth, textMsgController);

export default msgRouter;
