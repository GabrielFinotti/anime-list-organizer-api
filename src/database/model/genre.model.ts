import { Document, model, Schema, Types } from "mongoose";

type IGenreModel = {
  name: string;
  characteristics: string[];
} & Document<Types.ObjectId>;

const genreModelSchema = new Schema<IGenreModel>(
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

const GenreModel = model<IGenreModel>("Genre", genreModelSchema);

export default GenreModel;
