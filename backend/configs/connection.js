import mongoose from "mongoose";

const connectionDb = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected"),
    );
    await mongoose.connect(`${process.env.MONGODB_URL}/quickchat`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectionDb;
