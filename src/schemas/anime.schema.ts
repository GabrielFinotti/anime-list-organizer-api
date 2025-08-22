import z from "zod";

const DATE_PT_BR_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const cleanString = (msgRequired: string) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, msgRequired))
    .transform((s) => s.replace(/\s+/g, " "));

const datePtBr = z
  .string()
  .trim()
  .regex(DATE_PT_BR_REGEX, "Invalid format. Use dd/MM/yyyy")
  .transform((value) => {
    const [dayStr, monthStr, yearStr] = value.split("/");
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);
    const date = new Date(year, month - 1, day);
    const isValid =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      year >= 1900;

    if (!isValid) {
      throw new Error("Invalid release date");
    }

    return date;
  });

const nonNegativeIntNullable = z
  .number({ invalid_type_error: "Value must be a number" })
  .int("Value must be an integer")
  .min(0, "Cannot be negative")
  .nullable();

const animeObjectBase = z.object({
  title: cleanString("Title is required"),
  synopsis: cleanString("Synopsis is required"),
  category: cleanString("Category is required"),
  genres: z
    .array(cleanString("Genre is required"))
    .min(1, "At least one genre is required")
    .transform((arr) => Array.from(new Set(arr))),
  typeOfMaterialOrigin: cleanString("Type of material origin is required"),
  materialOriginName: cleanString("Material origin name is required"),
  releaseDate: datePtBr,
  isAMovie: z.boolean(),
  isSerieContentAnyDerivativeMovie: z.boolean(),
  isSerieContentAnyDerivativeOva: z.boolean(),
  isSerieContentAnyDerivativeSpecial: z.boolean(),
  moviesOrOvasOrSpecialsNames: z
    .array(cleanString("Name is required"))
    .transform((arr) => (arr.length ? Array.from(new Set(arr)) : arr))
    .nullable(),
  lastReleaseSeason: nonNegativeIntNullable,
  lastWatchedSeason: nonNegativeIntNullable,
  lastWatchedEpisode: nonNegativeIntNullable,
});

const animeSchemaBase = animeObjectBase.strict().superRefine((data, ctx) => {
  if (data.isAMovie) {
    ["lastReleaseSeason", "lastWatchedSeason", "lastWatchedEpisode"].forEach(
      (field) => {
        if (data[field as keyof typeof data] !== null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: "Must be null for a movie",
          });
        }
      }
    );
  } else {
    if (
      data.lastWatchedSeason !== null &&
      data.lastReleaseSeason !== null &&
      data.lastWatchedSeason > data.lastReleaseSeason
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lastWatchedSeason"],
        message: "Watched season cannot exceed last released season",
      });
    }
    if (data.lastWatchedEpisode !== null && data.lastWatchedSeason === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lastWatchedEpisode"],
        message: "Provide the season before the episode",
      });
    }
  }

  const anyDerivative =
    data.isSerieContentAnyDerivativeMovie ||
    data.isSerieContentAnyDerivativeOva ||
    data.isSerieContentAnyDerivativeSpecial;

  if (anyDerivative && !data.moviesOrOvasOrSpecialsNames) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["moviesOrOvasOrSpecialsNames"],
      message: "Derivatives list is required when any derivative flag is true",
    });
  }

  if (
    !anyDerivative &&
    data.moviesOrOvasOrSpecialsNames &&
    data.moviesOrOvasOrSpecialsNames.length
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["moviesOrOvasOrSpecialsNames"],
      message: "Remove the list or enable at least one derivative flag",
    });
  }
});

export const createAnimeSchema = animeSchemaBase;

const updateShape: any = Object.fromEntries(
  Object.entries((animeObjectBase as any).shape).map(([k, v]) => [
    k,
    (v as any).optional(),
  ])
);

export const updateAnimeSchema = z
  .object(updateShape)
  .strict()
  .superRefine((data: any, ctx: z.RefinementCtx) => {
    const isAMovie = data.isAMovie === true;

    if (isAMovie) {
      ["lastReleaseSeason", "lastWatchedSeason", "lastWatchedEpisode"].forEach(
        (field) => {
          if (
            Object.prototype.hasOwnProperty.call(data, field) &&
            data[field] !== null &&
            data[field] !== undefined
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Must be null or omitted for a movie",
            });
          }
        }
      );
    }

    if (
      data.lastWatchedSeason !== undefined &&
      data.lastReleaseSeason !== undefined &&
      data.lastWatchedSeason !== null &&
      data.lastReleaseSeason !== null &&
      data.lastWatchedSeason > data.lastReleaseSeason
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lastWatchedSeason"],
        message: "Watched season cannot exceed last released season",
      });
    }

    if (
      data.lastWatchedEpisode !== undefined &&
      data.lastWatchedEpisode !== null &&
      (data.lastWatchedSeason === undefined || data.lastWatchedSeason === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lastWatchedEpisode"],
        message: "Provide the season before the episode",
      });
    }

    const anyDerivative = [
      data.isSerieContentAnyDerivativeMovie,
      data.isSerieContentAnyDerivativeOva,
      data.isSerieContentAnyDerivativeSpecial,
    ].some((v) => v === true);

    if (
      anyDerivative &&
      Object.prototype.hasOwnProperty.call(
        data,
        "moviesOrOvasOrSpecialsNames"
      ) &&
      data.moviesOrOvasOrSpecialsNames === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["moviesOrOvasOrSpecialsNames"],
        message:
          "Derivatives list is required when any derivative flag is true",
      });
    }
  });

export type CreateAnimeSchema = z.infer<typeof createAnimeSchema>;
export type UpdateAnimeSchema = z.infer<typeof updateAnimeSchema>;
