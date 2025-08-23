import { Request, Response } from "express";
import AnimeLookupUseCase from "@/application/use-cases/openai/animeLookup.use-case";
import ApiResponse from "../../utils/api.response";

class AnimeLookupController {
  private animeLookupUseCase: AnimeLookupUseCase;

  constructor() {
    this.animeLookupUseCase = new AnimeLookupUseCase();
  }

  handle = async (req: Request, res: Response) => {
    try {
      const animeName = req.query.name;

      if (typeof animeName !== "string") {
        const result = ApiResponse.error(
          400,
          "Parâmetro 'name' é obrigatório e deve ser uma string",
          null
        );

        res.status(result.statusCode).json(result);
        return;
      }

      const result = await this.animeLookupUseCase.execute(animeName);

      if (!result.success) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.status(result.statusCode).json(result);
    } catch (error) {
      const result = ApiResponse.error(500, "Erro interno do servidor", null);

      res.status(result.statusCode).json(result);
    }
  };
}

export default AnimeLookupController;
