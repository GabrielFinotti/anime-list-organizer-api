import express from "express";
import dotenv from "dotenv";
import MongoConfig from "./infrastructure/database/config/mongo.config";

dotenv.config();

const app = express();
app.use(express.json());

// app.use("/api");

const startServer = async () => {
  try {
    await new MongoConfig().connectToDatabase();

    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
