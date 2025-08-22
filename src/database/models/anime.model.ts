import { IAnime } from "@/interfaces/models/anime.model";
import { model, Schema } from "mongoose";

const AnimeModelSchema = new Schema<IAnime>(
  {
    title: { type: String, required: true },
    synopsis: { type: String, required: true },
    category: { type: String, required: true },
    genres: { type: [String], required: true },
    typeOfMaterialOrigin: { type: String, required: true },
    materialOriginName: { type: String, required: true },
    releaseDate: { type: Date, required: true },
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

const AnimeModel = model<IAnime>("Anime", AnimeModelSchema);

export default AnimeModel;
