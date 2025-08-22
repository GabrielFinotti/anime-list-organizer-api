import { model, Schema, InferSchemaType, HydratedDocument } from "mongoose";

const AnimeModelSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, index: true },
    synopsis: { type: String, required: true },
    category: { type: String, required: true },
    genres: { type: [String], required: true },
    typeOfMaterialOrigin: { type: String, required: true },
    materialOriginName: { type: String, required: true },
    releaseDate: { type: Date, required: true, index: true },
    isAMovie: { type: Boolean, required: true },
    isSerieContentAnyDerivativeMovie: { type: Boolean, required: true },
    isSerieContentAnyDerivativeOva: { type: Boolean, required: true },
    isSerieContentAnyDerivativeSpecial: { type: Boolean, required: true },
    moviesOrOvasOrSpecialsNames: { type: [String], default: null },
    lastReleaseSeason: { type: Number, default: null },
    lastWatchedSeason: { type: Number, default: null },
    lastWatchedEpisode: { type: Number, default: null },
  },
  {
    timestamps: true,
  }
);

export type AnimeSchemaType = InferSchemaType<typeof AnimeModelSchema> & {
  createdAt: Date;
  updatedAt: Date;
};
export type AnimeDocument = HydratedDocument<AnimeSchemaType>;
export type AnimeLean = Omit<AnimeSchemaType, never> & { _id: string };

const AnimeModel = model<AnimeSchemaType>("Anime", AnimeModelSchema);

export const toAnimeDTO = (doc: AnimeDocument | AnimeLean) => {
  const base: any = doc as any;

  return {
    id: String(base._id),
    title: base.title,
    synopsis: base.synopsis,
    category: base.category,
    genres: base.genres,
    typeOfMaterialOrigin: base.typeOfMaterialOrigin,
    materialOriginName: base.materialOriginName,
    releaseDate: base.releaseDate,
    isAMovie: base.isAMovie,
    isSerieContentAnyDerivativeMovie: base.isSerieContentAnyDerivativeMovie,
    isSerieContentAnyDerivativeOva: base.isSerieContentAnyDerivativeOva,
    isSerieContentAnyDerivativeSpecial: base.isSerieContentAnyDerivativeSpecial,
    moviesOrOvasOrSpecialsNames: base.moviesOrOvasOrSpecialsNames,
    lastReleaseSeason: base.lastReleaseSeason,
    lastWatchedSeason: base.lastWatchedSeason,
    lastWatchedEpisode: base.lastWatchedEpisode,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
  } as const;
};

export default AnimeModel;
