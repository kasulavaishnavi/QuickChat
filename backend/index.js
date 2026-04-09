import express from "express";
import "dotenv/config";
import cors from "cors";
import connectionDb from "./configs/connection.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import msgRouter from "./routes/msgRoutes.js";

const app = express();

//connection
await connectionDb();
//middleware
app.use(cors());
app.use(express.json()); //all the request will be passed using the jsonmethod for the backend server

//routes
app.get("/", (req, res) => res.send("server running"));
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/chat", msgRouter);
//port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
