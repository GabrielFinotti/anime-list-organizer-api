import express from "express";
import dotenv from "dotenv";
import animeRoute from "@/router/anime.route";
import basicAuth from "@/middlewares/auth.middleware";
import connectToDatabase from "@/database/config/mongo";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", basicAuth, animeRoute);

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(
      error instanceof Error
        ? `Erro ao iniciar o servidor: ${error.message}`
        : `Erro desconhecido ao iniciar o servidor: ${error}`
    );
  }
};

startServer();
