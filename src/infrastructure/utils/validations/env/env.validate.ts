import * as dotenv from "dotenv";
import z from "zod";
import { EnvSchema, envSchema } from "./envSchema";

dotenv.config();
export class EnvValidationService {
  private _validatedEnv: EnvSchema | null = null;

  private constructor() {
    this.validateAndLoad();
  }

  get validatedEnv() {
    if (this._validatedEnv) {
      return this._validatedEnv;
    }

    throw new Error("Variáveis de ambiente não validadas");
  }

  static execute() {
    const instance = new EnvValidationService();

    return instance.validatedEnv;
  }

  private validateAndLoad() {
    try {
      this._validatedEnv = envSchema.parse(process.env);
      console.log("Variáveis de ambiente validadas com sucesso");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors
          .map((err) => `- ${err.path.join(".")} : ${err.message}`)
          .join("\n");

        throw new Error(
          `Erro na validação das variáveis de ambiente: ${messages}`
        );
      }

      throw new Error(
        `Erro desconhecido na validação das variáveis de ambiente: ${error}`
      );
    }
  }
}

export default EnvValidationService;
