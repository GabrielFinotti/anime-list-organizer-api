import { Document, model, Schema, Types } from "mongoose";

type IAnimeModule = {
  name: string;
  synopsis: string;
  category: Types.ObjectId;
  genres: Types.ObjectId[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: Date;
  isMovie: boolean;
  derivate: Types.ObjectId;
  lastReleaseSeason: number;
  lastWatchedSeason: number;
  lastWatchedEpisode: number;
  status: "watching" | "completed" | "in list" | "dropped";
} & Document<Types.ObjectId>;

const animeModelSchema = new Schema<IAnimeModule>(
  {
    name: {
      type: String,
      required: true,
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
    derivate: {
      type: Schema.Types.ObjectId,
      ref: "Derivative",
      required: false,
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

const AnimeModel = model<IAnimeModule>("Anime", animeModelSchema);

export default AnimeModel;
