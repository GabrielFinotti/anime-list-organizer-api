import mongoose, { MongooseError } from "mongoose";

class MongoConfig {
  constructor() {}

  static async connectToDatabase(url: string) {
    try {
      await mongoose.connect(url, {
        dbName: "anime-list",
      });
      console.log("Connected to database");
    } catch (error) {
      if (error instanceof MongooseError) {
        console.error("Mongoose error:", error.message);
      } else {
        console.error("Error connecting to database:", error);
      }
    }
  }
}

export default MongoConfig;
