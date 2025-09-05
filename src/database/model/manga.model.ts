import { model, Schema, Types } from "mongoose";

type IMangaModel = {
  name: string;
  synopsis: string;
  category: Types.ObjectId;
  genres: Types.ObjectId[];
  typeOfMaterialOrigin: string;
  releaseDate: Date;
  lastReleasedVolume: number;
  lastReleasedChapter: number;
  lastReadVolume: number;
  lastReadChapter: number;
  actualStatus: "publishing" | "completed" | "hiatus" | "cancelled";
  status: "reading" | "completed" | "in list" | "dropped";
};

const mangaModelSchema = new Schema<IMangaModel>({
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
  releaseDate: {
    type: Date,
    required: true,
  },
  lastReleasedVolume: {
    type: Number,
    required: true,
  },
  lastReleasedChapter: {
    type: Number,
    required: true,
  },
  lastReadVolume: {
    type: Number,
    required: true,
  },
  lastReadChapter: {
    type: Number,
    required: true,
  },
  actualStatus: {
    type: String,
    enum: ["publishing", "completed", "hiatus", "cancelled"],
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["reading", "completed", "in list", "dropped"],
    required: true,
    index: true,
  },
});

const MangaModel = model<IMangaModel>("Manga", mangaModelSchema);

export default MangaModel;
