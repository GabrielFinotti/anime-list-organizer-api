import express from "express";
import dotenv from "dotenv";
import MongoConfig from "@/database/config/mongo.config";
import adminRoute from "@/router/admin.route";
import animeRoute from "@/router/anime.route";
import openAiRoute from "@/router/openAi.route";

dotenv.config();

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    await MongoConfig.connectToDatabase(process.env.MONGO_URI as string);

    app.use("/api/v3", adminRoute, animeRoute, openAiRoute);

    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
