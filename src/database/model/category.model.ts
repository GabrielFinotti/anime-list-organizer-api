import { Document, model, Schema, Types } from "mongoose";

type ICategoryModel = {
  name: string;
  translatedName: string;
  targetAudience: string;
  characteristics: string[];
} & Document<Types.ObjectId>;

const categoryModelSchema = new Schema<ICategoryModel>(
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

const CategoryModel = model<ICategoryModel>("Category", categoryModelSchema);

export default CategoryModel;
