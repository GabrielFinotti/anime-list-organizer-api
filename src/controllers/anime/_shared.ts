import AnimeRepository from "@/repositories/anime.repository";
import { AnimeService } from "@/services/anime.service";
import { Response } from "express";
import { DuplicateAnimeTitleError } from "@/errors/anime.errors";

const repo = new AnimeRepository();
export const animeService = new AnimeService(repo);

export const notFound = (res: Response) =>
  res.status(404).json({ error: "Anime não encontrado" });

export function mapError(err: unknown) {
  if (err instanceof DuplicateAnimeTitleError) {
    return { status: 409, body: { error: err.message } } as const;
  }

  if (
    err &&
    typeof err === "object" &&
    (err as any).name === "ValidationError"
  ) {
    return { status: 400, body: { error: (err as any).message } } as const;
  }

  return { status: 500, body: { error: "Erro interno" } } as const;
}
