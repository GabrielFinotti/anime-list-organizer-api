import { Types, Document, Schema, model } from "mongoose";

type IDerivativeModule = {
  animeRef: Types.ObjectId;
  movies: string[];
  ovas: string[];
  specials: string[];
} & Document<Types.ObjectId>;

const derivativeModelSchema = new Schema<IDerivativeModule>(
  {
    animeRef: {
      type: Schema.Types.ObjectId,
      ref: "Anime",
      required: true,
      index: true,
    },
    movies: {
      type: [String],
      required: true,
    },
    ovas: {
      type: [String],
      required: true,
    },
    specials: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DerivativeModel = model<IDerivativeModule>(
  "Derivative",
  derivativeModelSchema
);

export default DerivativeModel;
