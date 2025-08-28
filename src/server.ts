import express from "express";
import dotenv from "dotenv";
import MongoConfig from "@/infrastructure/database/config/mongo.config";
import validationEnv from "@/infrastructure/utils/validations/env/env.validate";

dotenv.config();

const app = express();
app.use(express.json());

app.use(`/api/${process.env.VERSION}`);

const startServer = async () => {
  try {
    await validationEnv();

    await new MongoConfig().connectToDatabase();

    app.listen(process.env.PORT, () => {
      console.log(
        `Servidor rodando na porta ${process.env.PORT}, versão ${process.env.VERSION}`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
