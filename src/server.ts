import express from "express";
import dotenv from "dotenv";
import MongoConfig from "@/infrastructure/database/config/mongo.config";
import animeRoutes from "@/infrastructure/http/routes/anime.route";
import validationEnv from "@/infrastructure/utils/validations/env/env.validate";
import animeLookup from "./infrastructure/api/openai/anime.lookup";

dotenv.config();

if (!process.env.VERSION) {
  process.env.VERSION = "v1";
}

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    await validationEnv();

    await new MongoConfig().connectToDatabase();

    app.use(`/api/${process.env.VERSION}`, animeRoutes);

    await animeLookup();

    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
