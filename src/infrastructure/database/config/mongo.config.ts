import mongoose from "mongoose";

class MongoConfig {
  private url!: string;

  constructor() {
    this.verifyEnvVariables();

    this.url = process.env.MONGODB_URI as string;
  }

  private verifyEnvVariables() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("Variável de ambiente ausente: MONGODB_URI");
    }
  }

  async connectToDatabase() {
    try {
      await mongoose.connect(this.url, { dbName: "anime-list" });

      console.log("Conectado ao banco de dados com sucesso");
    } catch (error) {
      throw error instanceof Error
        ? error.message
        : `Erro desconhecido ao tentar se conectar ao banco: ${error}`;
    }
  }
}

export default MongoConfig;
