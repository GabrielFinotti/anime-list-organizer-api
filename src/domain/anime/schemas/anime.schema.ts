import z from "zod";

const animeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim(),
  synopsis: z.string().trim(),
  category: z.string().trim(),
  genres: z.array(z.string().trim()),
  isMovie: z.boolean(),
  isSerieContentAnyMovie: z.boolean(),
  moviesNames: z.array(z.string().trim()).default([]),
  releaseDate: z.date(),
  typeOfOriginMaterial: z.string().trim(),
  originMaterialName: z.string().trim(),
  lastReleaseSeason: z.number().min(1).optional(),
  lastWatchSeason: z.number().min(0).optional(),
  lastWatchedEpisode: z.number().min(0).optional(),
  status: z.enum(["watching", "completed", "dropped", "in list"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createAnimeSchema = animeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateAnimeSchema = animeSchema.partial();

export type CreateAnimeSchema = z.infer<typeof createAnimeSchema>;
export type UpdateAnimeSchema = z.infer<typeof updateAnimeSchema>;
