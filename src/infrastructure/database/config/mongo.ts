import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "anime",
    });

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred while connecting to the database"
    );
  }
};

export default connectToDatabase;
