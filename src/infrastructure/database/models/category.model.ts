import { Document, model, Schema } from 'mongoose';

type ICategoryDocument = Document & {
  _id: string;
  name: string;
  translatedName: string;
  targetAudience: string;
  description: string;
};

const categorySchema = new Schema<ICategoryDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    translatedName: { type: String, required: true },
    targetAudience: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

const CategoryModel = model<ICategoryDocument>('Category', categorySchema);

export default CategoryModel;
