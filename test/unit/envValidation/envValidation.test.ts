import { jest } from "@jest/globals";
import EnvValidationService from "../../../src/infrastructure/utils/validations/env/env.validate";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("EnvValidationService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();

    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("execute()", () => {
    it("deve validar e retornar variáveis de ambiente válidas", () => {
      process.env.PORT = "3000";
      process.env.VERSION = "1.0.0";
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      process.env.OPENAI_API_KEY = "sk-test-key";

      const result = EnvValidationService.execute();

      expect(result).toEqual({
        PORT: 3000,
        VERSION: "1.0.0",
        MONGODB_URI: "mongodb://localhost:27017/test",
        OPENAI_API_KEY: "sk-test-key",
      });
    });

    it("deve lançar erro quando PORT não é um número positivo", () => {
      process.env.PORT = "invalid";
      process.env.VERSION = "1.0.0";
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      process.env.OPENAI_API_KEY = "sk-test-key";

      expect(() => EnvValidationService.execute()).toThrow(
        "Erro na validação das variáveis de ambiente: - PORT : Expected number, received nan"
      );
    });

    it("deve lançar erro quando PORT é negativo", () => {
      process.env.PORT = "-3000";
      process.env.VERSION = "1.0.0";
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      process.env.OPENAI_API_KEY = "sk-test-key";

      expect(() => EnvValidationService.execute()).toThrow(
        "Erro na validação das variáveis de ambiente: - PORT : Number must be greater than 0"
      );
    });

    it("deve lançar erro quando VERSION está vazia", () => {
      process.env.PORT = "3000";
      process.env.VERSION = "";
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      process.env.OPENAI_API_KEY = "sk-test-key";

      expect(() => EnvValidationService.execute()).toThrow(
        "Erro na validação das variáveis de ambiente: - VERSION : String must contain at least 1 character(s)"
      );
    });

    it("deve lançar erro quando MONGODB_URI não é uma URL válida", () => {
      process.env.PORT = "3000";
      process.env.VERSION = "1.0.0";
      process.env.MONGODB_URI = "invalid-url";
      process.env.OPENAI_API_KEY = "sk-test-key";

      expect(() => EnvValidationService.execute()).toThrow(
        "Erro na validação das variáveis de ambiente: - MONGODB_URI : Invalid url"
      );
    });

    it("deve lançar erro quando OPENAI_API_KEY está vazia", () => {
      process.env.PORT = "3000";
      process.env.VERSION = "1.0.0";
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      process.env.OPENAI_API_KEY = "";

      expect(() => EnvValidationService.execute()).toThrow(
        "Erro na validação das variáveis de ambiente: - OPENAI_API_KEY : String must contain at least 1 character(s)"
      );
    });

    it("deve lançar erro quando múltiplas variáveis estão inválidas", () => {
      process.env.PORT = "invalid";
      process.env.VERSION = "";
      process.env.MONGODB_URI = "invalid-url";
      process.env.OPENAI_API_KEY = "";

      expect(() => EnvValidationService.execute()).toThrow(
        /Erro na validação das variáveis de ambiente:/
      );
      expect(() => EnvValidationService.execute()).toThrow(/PORT/);
      expect(() => EnvValidationService.execute()).toThrow(/VERSION/);
      expect(() => EnvValidationService.execute()).toThrow(/MONGODB_URI/);
      expect(() => EnvValidationService.execute()).toThrow(/OPENAI_API_KEY/);
    });

    it("deve lançar erro quando variáveis obrigatórias estão ausentes", () => {
      process.env = {};

      expect(() => EnvValidationService.execute()).toThrow(
        "Erro na validação das variáveis de ambiente:"
      );
    });
  });

  describe("validatedEnv getter", () => {
    it("deve retornar variáveis validadas após execução bem-sucedida", () => {
      process.env.PORT = "3000";
      process.env.VERSION = "1.0.0";
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      process.env.OPENAI_API_KEY = "sk-test-key";

      const result1 = EnvValidationService.execute();

      const result2 = EnvValidationService.execute();

      expect(result1).toEqual(result2);
      expect(result1).toEqual({
        PORT: 3000,
        VERSION: "1.0.0",
        MONGODB_URI: "mongodb://localhost:27017/test",
        OPENAI_API_KEY: "sk-test-key",
      });
    });

    it("deve validar que o singleton mantém o estado validado", () => {
      process.env.PORT = "3000";
      process.env.VERSION = "1.0.0";
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      process.env.OPENAI_API_KEY = "sk-test-key";

      const result1 = EnvValidationService.execute();
      const result2 = EnvValidationService.execute();

      expect(result1).toStrictEqual(result2);
    });
  });

  describe("Singleton behavior", () => {
    it("deve manter o mesmo resultado consistente entre chamadas", () => {
      process.env.PORT = "3000";
      process.env.VERSION = "1.0.0";
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      process.env.OPENAI_API_KEY = "sk-test-key";

      const result1 = EnvValidationService.execute();
      const result2 = EnvValidationService.execute();

      expect(result1).toEqual(result2);
      expect(result1).toStrictEqual(result2);
    });
  });

  describe("Error handling", () => {
    it("deve fornecer mensagens de erro detalhadas para validação Zod", () => {
      process.env.PORT = "invalid";
      process.env.VERSION = "";
      process.env.MONGODB_URI = "not-a-url";
      process.env.OPENAI_API_KEY = "";

      expect(() => EnvValidationService.execute()).toThrow();
      try {
        EnvValidationService.execute();
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain(
          "Erro na validação das variáveis de ambiente"
        );
        expect(errorMessage).toContain("PORT");
        expect(errorMessage).toContain("VERSION");
        expect(errorMessage).toContain("MONGODB_URI");
        expect(errorMessage).toContain("OPENAI_API_KEY");
      }
    });
  });
});
