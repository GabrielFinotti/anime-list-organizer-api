import z from "zod";

const preprocessDate = z.preprocess((date) => {
  if (typeof date === "string") return new Date(date);

  return date;
}, z.date());

const AnimeSchema = z
  .object({
    name: z.string().trim().min(1),
    synopsis: z.string().trim().min(1),
    category: z.string().trim().min(1),
    genres: z.array(z.string().trim().min(1)),
    typeOfMaterialOrigin: z.string().trim().min(1),
    materialOriginName: z.string().trim().min(1),
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
  })
  .strict();

export const createAnimeSchema = AnimeSchema;
export const updateAnimeSchema = AnimeSchema.partial();

export type CreateAnimeSchema = z.infer<typeof createAnimeSchema>;
export type UpdateAnimeSchema = z.infer<typeof updateAnimeSchema>;
