import { Document, model, Schema, Types } from "mongoose";

type IGenreModule = {
  name: string;
  characteristics: string[];
} & Document<Types.ObjectId>;

const GenreModelSchema = new Schema<IGenreModule>(
  {
    name: {
      type: String,
      required: true,
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

const GenreModel = model<IGenreModule>("Genre", GenreModelSchema);

export default GenreModel;
