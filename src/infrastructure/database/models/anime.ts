import { Document, model, Schema } from "mongoose";

export type IAnimeDocument = Document & {
  _id: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  releaseDate: Date;
  category: string;
  genres: string[];
  typeOfAnime: "series" | "movie" | "mixed";
  typeOfProduction: "original" | "adaptation";
  typeOfSourceMaterial:
    | "manga"
    | "manhwa"
    | "donghua"
    | "light novel"
    | "game"
    | "other"
    | "none";
  isAdultContent: boolean;
  totalSeasons: number;
  totalEpisodes: number;
  movies: {
    list: string[];
    updatedAt: Date;
  };
};

const animeSchema = new Schema<IAnimeDocument>(
  {
    _id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    synopsis: { type: String, required: true },
    coverUrl: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    category: { type: String, ref: "Category", required: true },
    genres: [{ type: String, ref: "Genre", required: true }],
    typeOfAnime: {
      type: String,
      enum: ["series", "movie", "mixed"],
      required: true,
    },
    typeOfProduction: {
      type: String,
      enum: ["original", "adaptation"],
      required: true,
    },
    typeOfSourceMaterial: {
      type: String,
      enum: [
        "manga",
        "manhwa",
        "donghua",
        "light novel",
        "game",
        "other",
        "none",
      ],
      required: true,
    },
    isAdultContent: { type: Boolean, required: true },
    totalSeasons: { type: Number, default: 0 },
    totalEpisodes: { type: Number, default: 0 },
    movies: {
      list: [{ type: String, default: [] }],
      updatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  },
);

const AnimeModel = model<IAnimeDocument>("Anime", animeSchema);

export default AnimeModel;
