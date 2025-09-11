import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import MongoConfig from "@/database/config/mongo.config";
import adminRoute from "@/router/admin.route";
import animeRoute from "@/router/anime.route";
import openAiRoute from "@/router/openAi.route";
import basicAuth from "./middleware/basicAuth";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    allowedHeaders: "*",
    origin: process.env.CORS_ORIGIN,
  })
);

const startServer = async () => {
  try {
    await MongoConfig.connectToDatabase(process.env.MONGODB_URI as string);

    app.get(`/api/${process.env.VERSION}/health`, (req, res) => {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.VERSION,
        uptime: process.uptime(),
      });
    });

    app.use(
      `/api/${process.env.VERSION}`,
      basicAuth,
      adminRoute,
      animeRoute,
      openAiRoute
    );

    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
