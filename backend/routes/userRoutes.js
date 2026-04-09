import express from "express";
import {
  userSignup,
  userLogin,
  getUser,
} from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.get("/me", auth, getUser);

export default userRouter;
