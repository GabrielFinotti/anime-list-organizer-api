import { Document, model, Schema, Types } from "mongoose";

type ICategoryModule = {
  name: string;
  translatedName: string;
  targetAudience: string;
  characteristics: string[];
} & Document<Types.ObjectId>;

const categoryModelSchema = new Schema<ICategoryModule>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    translatedName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    targetAudience: {
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

const CategoryModel = model<ICategoryModule>("Category", categoryModelSchema);

export default CategoryModel;
