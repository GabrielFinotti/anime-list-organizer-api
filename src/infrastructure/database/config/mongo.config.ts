import mongoose, { MongooseError } from "mongoose";

class MongoConfig {
  private readonly _url: string;

  constructor(url: string) {
    this._url = url;
  }

  public async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(this._url, {
        dbName: "anime-list",
      });

      console.log("Conectado ao banco de dados com sucesso");
    } catch (error) {
      throw error instanceof MongooseError
        ? error.message
        : `Erro desconhecido ao tentar se conectar ao banco: ${error}`;
    }
  }
}

export default MongoConfig;
