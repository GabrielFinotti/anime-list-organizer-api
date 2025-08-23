import { IAnime } from "@/domain/anime/entity/anime.entity";
import { Document, model, Schema, Types } from "mongoose";

type IAnimeModel = Document<Types.ObjectId, unknown, IAnime> & IAnime;

const animeModelSchema = new Schema<IAnimeModel>(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    synopsis: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    typeOfMaterialOrigin: {
      type: String,
      required: true,
    },
    materialOriginName: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    isAMovie: {
      type: Boolean,
      required: true,
    },
    derivates: {
      type: {
        movies: {
          type: [String],
          default: [],
        },
        ova: {
          type: [String],
          default: [],
        },
        specials: {
          type: [String],
          default: [],
        },
      },
      default: null,
    },
    lastReleaseSeason: {
      type: Number,
      default: null,
    },
    lastWatchedSeason: {
      type: Number,
      default: null,
    },
    lastWatchedEpisode: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["watching", "completed", "dropped", "in list"],
      default: "in list",
    },
  },
  { timestamps: true }
);

const AnimeModel = model<IAnimeModel>("Anime", animeModelSchema);

export default AnimeModel;
