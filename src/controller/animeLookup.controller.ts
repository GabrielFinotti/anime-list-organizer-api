import { Request, Response } from "express";
import AnimeLookupService from "@/api/openai/anime.lookup";

class AnimeLookupController {
  private constructor(private animeLookupService = new AnimeLookupService()) {}

  static async lookup(req: Request, res: Response) {
    try {
      const title = req.query.title;

      if (!title || typeof title !== "string") {
        return res.status(400).json({
          message: "Título do anime é obrigatório e deve ser uma string",
        });
      }

      const animeData =
        await new AnimeLookupController().animeLookupService.lookup(
          title.trim()
        );

      if (!animeData) {
        return res.status(404).json({
          message: "Não foi possível encontrar dados para o anime informado",
        });
      }

      return res.status(200).json({
        message: "Dados do anime encontrados com sucesso",
        data: animeData,
      });
    } catch (error) {
      console.error("Erro no lookup do anime:", error);

      if (error instanceof Error) {
        return res.status(500).json({
          message: "Erro interno do servidor",
          error: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }
}

export default AnimeLookupController;
