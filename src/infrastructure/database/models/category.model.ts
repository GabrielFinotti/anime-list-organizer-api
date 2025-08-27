import { Document, model, Schema, Types } from "mongoose";
import { ICategory } from "@/domain/category/entity/category.entity";

type ICategoryModel = Document<Types.ObjectId, unknown, ICategory> & ICategory;

const categoryModelSchema = new Schema<ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    traduction: {
      type: String,
      required: true,
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

categoryModelSchema.virtual("animes", {
  ref: "Anime",
  localField: "_id",
  foreignField: "category",
});

categoryModelSchema.set("toObject", { virtuals: true });
categoryModelSchema.set("toJSON", { virtuals: true });

const CategoryModel = model<ICategoryModel>("Category", categoryModelSchema);

export default CategoryModel;
