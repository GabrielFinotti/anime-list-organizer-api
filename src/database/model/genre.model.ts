import { Document, model, Schema, Types } from "mongoose";

type IGenreModule = {
  name: string;
  characteristics: string[];
} & Document<Types.ObjectId>;

const genreModelSchema = new Schema<IGenreModule>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    characteristics: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GenreModel = model<IGenreModule>("Genre", genreModelSchema);

export default GenreModel;
