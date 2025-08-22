import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "anime",
    });

    console.log("Conectado ao banco de dados com sucesso");
  } catch (error) {
    throw error;
  }
};

export default connectToDatabase;
