import { Document, model, Schema } from "mongoose";

type IGenreDocument = Document & {
  _id: string;
  name: string;
  description: string;
  isAdultGenre: boolean;
};

const genreSchema = new Schema<IGenreDocument>(
  {
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isAdultGenre: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

const GenreModel = model<IGenreDocument>("Genre", genreSchema);

export default GenreModel;
