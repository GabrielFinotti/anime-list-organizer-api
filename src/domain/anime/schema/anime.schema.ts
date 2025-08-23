import z from "zod";

const preprocessDate = z.preprocess((date) => {
  if (typeof date === "string") return new Date(date);

  return date;
}, z.date());

const AnimeSchema = z.object({
  name: z.string().trim(),
  synopsis: z.string().trim(),
  category: z.string().trim(),
  genres: z.array(z.string().trim()),
  typeOfMaterialOrigin: z.string().trim(),
  materialOriginName: z.string().trim(),
  releaseDate: preprocessDate,
  isAMovie: z.boolean(),
  derivates: z
    .object({
      movies: z.array(z.string().trim()),
      ova: z.array(z.string().trim()),
      specials: z.array(z.string().trim()),
    })
    .nullable(),
  lastReleaseSeason: z.number().min(0).nullable(),
  lastWatchedSeason: z.number().min(0).nullable(),
  lastWatchedEpisode: z.number().min(0).nullable(),
  status: z
    .enum(["watching", "completed", "dropped", "in list"])
    .default("in list"),
});

export const createAnimeSchema = AnimeSchema;
export const updateAnimeSchema = AnimeSchema.partial();

export type CreateAnimeSchema = z.infer<typeof createAnimeSchema>;
export type UpdateAnimeSchema = z.infer<typeof updateAnimeSchema>;
