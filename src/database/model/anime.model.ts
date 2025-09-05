import { Document, model, Schema, Types } from "mongoose";

type IAnimeModel = {
  name: string;
  synopsis: string;
  category: Types.ObjectId;
  genres: Types.ObjectId[];
  adultGenres: Types.ObjectId[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: Date;
  isMovie: boolean;
  isAdult: boolean;
  derivate: {
    movies: string[];
    ovas: string[];
    specials: string[];
  };
  lastReleaseSeason: number;
  lastWatchedSeason: number;
  lastWatchedEpisode: number;
  actualStatus: "publishing" | "completed" | "cancelled" | "in production";
  status: "watching" | "completed" | "in list" | "dropped";
} & Document<Types.ObjectId>;

const animeModelSchema = new Schema<IAnimeModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    synopsis: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true,
      },
    ],
    adultGenres: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "AdultGenre",
          required: true,
        },
      ],
      default: [],
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
    isMovie: {
      type: Boolean,
      required: true,
      index: true,
    },
    isAdult: {
      type: Boolean,
      required: true,
      index: true,
    },
    derivate: {
      type: new Schema(
        {
          movies: {
            type: [String],
            required: false,
          },
          ovas: {
            type: [String],
            required: false,
          },
          specials: {
            type: [String],
            required: false,
          },
        },
        { _id: false }
      ),
      required: false,
      default: {},
    },
    lastReleaseSeason: {
      type: Number,
      required: true,
    },
    lastWatchedSeason: {
      type: Number,
      required: true,
    },
    lastWatchedEpisode: {
      type: Number,
      required: true,
    },
    actualStatus: {
      type: String,
      enum: ["publishing", "completed", "cancelled", "in production"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["watching", "completed", "in list", "dropped"],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const AnimeModel = model<IAnimeModel>("Anime", animeModelSchema);

export default AnimeModel;
