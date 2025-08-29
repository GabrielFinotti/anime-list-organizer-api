import express from "express";
import MongoConfig from "@/infrastructure/database/config/mongo.config";
import EnvValidationService from "@/infrastructure/utils/validations/env/env.validate";

const app = express();
const env = EnvValidationService.execute();

app.use(express.json());

const startServer = async () => {
  try {
    await new MongoConfig(env.MONGODB_URI).connectToDatabase();

    app.listen(env.PORT, () => {
      console.log(
        `Servidor rodando na porta ${env.PORT}, versão ${env.VERSION}`
      );
    });
  } catch (error) {
    console.error("Erro na inicialização do servidor:", error);
    process.exit(1);
  }
};

startServer();
