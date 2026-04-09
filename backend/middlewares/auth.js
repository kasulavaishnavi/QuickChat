import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "no toke provided",
      });
    }
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized,user not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default auth;
