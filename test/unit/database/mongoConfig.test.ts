import mongoose, { MongooseError } from "mongoose";
import MongoConfig from "@/infrastructure/database/config/mongo.config";

jest.mock("mongoose");

const mockedMongoose = mongoose as jest.Mocked<typeof mongoose>;

describe("MongoConfig", () => {
  const testUrl = "mongodb://localhost:27017/test";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create instance with provided URL", () => {
      const mongoConfig = new MongoConfig(testUrl);

      expect(mongoConfig).toBeInstanceOf(MongoConfig);
    });
  });

  describe("connectToDatabase", () => {
    it("should connect to database successfully", async () => {
      mockedMongoose.connect.mockResolvedValueOnce({} as any);

      const mongoConfig = new MongoConfig(testUrl);
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      await expect(mongoConfig.connectToDatabase()).resolves.toBeUndefined();

      expect(mockedMongoose.connect).toHaveBeenCalledWith(testUrl, {
        dbName: "anime-list",
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Conectado ao banco de dados com sucesso"
      );

      consoleSpy.mockRestore();
    });

    it("should throw MongooseError message when connection fails with MongooseError", async () => {
      const errorMessage = "Connection failed";
      const mongooseError = new MongooseError(errorMessage);
      mongooseError.message = errorMessage; // Ensure message is set

      mockedMongoose.connect.mockRejectedValueOnce(mongooseError);

      const mongoConfig = new MongoConfig(testUrl);

      await expect(mongoConfig.connectToDatabase()).rejects.toBe(errorMessage);

      expect(mockedMongoose.connect).toHaveBeenCalledWith(testUrl, {
        dbName: "anime-list",
      });
    });

    it("should throw generic error message when connection fails with unknown error", async () => {
      const unknownError = new Error("Unknown error");

      mockedMongoose.connect.mockRejectedValueOnce(unknownError);

      const mongoConfig = new MongoConfig(testUrl);

      const expectedMessage = `Erro desconhecido ao tentar se conectar ao banco: ${unknownError}`;

      await expect(mongoConfig.connectToDatabase()).rejects.toBe(
        expectedMessage
      );

      expect(mockedMongoose.connect).toHaveBeenCalledWith(testUrl, {
        dbName: "anime-list",
      });
    });

    it("should throw generic error message when connection fails with non-Error object", async () => {
      const nonError = "String error";

      mockedMongoose.connect.mockRejectedValueOnce(nonError);

      const mongoConfig = new MongoConfig(testUrl);

      const expectedMessage = `Erro desconhecido ao tentar se conectar ao banco: ${nonError}`;

      await expect(mongoConfig.connectToDatabase()).rejects.toBe(
        expectedMessage
      );

      expect(mockedMongoose.connect).toHaveBeenCalledWith(testUrl, {
        dbName: "anime-list",
      });
    });
  });
});
