import { Request, Response, NextFunction } from "express";
import { getAnimeDataByName } from "@/api/openai/getAnimeData";
import { mapError } from "./_shared";

export const fetchAnimeAi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Parâmetro 'name' é obrigatório" });
    }

    const data = await getAnimeDataByName(name);

    res.json({ data });
  } catch (err: any) {
    if (err instanceof Error) {
      if (err.name === "OpenAIQuotaExceededError") {
        return res.status(429).json({
          error: err.message,
          type: "quota_exceeded",
        });
      }

      if (err.name === "OpenAIRateLimitError") {
        res.setHeader("Retry-After", "30");

        return res.status(429).json({
          error: err.message,
          type: "rate_limited",
        });
      }

      if (err.message.startsWith("OpenAITimeout:")) {
        return res.status(504).json({
          error: "Tempo limite ao consultar modelo. Tente novamente.",
          type: "timeout",
        });
      }

      if (
        err.message.includes("parsear JSON") ||
        err.message.includes("Resposta vazia")
      ) {
        return res.status(502).json({
          error: err.message,
          type: "upstream_invalid_response",
        });
      }
    }

    const mapped = mapError(err);

    if (mapped.status === 500) return next(err);

    res.status(mapped.status).json(mapped.body);
  }
};
