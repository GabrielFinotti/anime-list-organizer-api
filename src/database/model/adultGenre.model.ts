import { Document, Types, Schema, model } from "mongoose";

type IAdultGenreModel = {
  name: string;
  characteristics: string[];
} & Document<Types.ObjectId>;

const adultGenreModelSchema = new Schema<IAdultGenreModel>(
  {
    name: {
      type: String,
      required: true,
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

const AdultGenreModel = model<IAdultGenreModel>(
  "AdultGenre",
  adultGenreModelSchema
);

export default AdultGenreModel;
