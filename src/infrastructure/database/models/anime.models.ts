import { IAnime } from "@/domain/anime/entity/anime.entity";
import { model, Schema } from "mongoose";

const AnimeSchema = new Schema<IAnime>(
  {
    name: { type: String, required: true, index: true },
    synopsis: { type: String, required: true },
    category: { type: String, required: true },
    genres: [{ type: String, required: true }],
    isMovie: { type: Boolean, required: true },
    isSerieContentAnyMovie: { type: Boolean, required: true },
    moviesNames: [{ type: String, required: true }],
    releaseDate: { type: Date, required: true },
    typeOfOriginMaterial: { type: String, required: true },
    originMaterialName: { type: String, required: true },
    lastReleaseSeason: { type: Number, default: null },
    lastWatchSeason: { type: Number, default: null },
    lastWatchedEpisode: { type: Number, default: null },
    status: {
      type: String,
      enum: ["watching", "completed", "dropped", "in list"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AnimeModel = model<IAnime>("Anime", AnimeSchema);

export default AnimeModel;
