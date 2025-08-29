import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  VERSION: z.string().min(1),
  MONGODB_URI: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
});

type EnvSchema = z.infer<typeof envSchema>;

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
