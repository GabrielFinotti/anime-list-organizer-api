import { Document, model, Schema } from 'mongoose';

type ICategoryDocument = Document & {
  _id: string;
  name: string;
  description: string;
};

const categorySchema = new Schema<ICategoryDocument>(
  {
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

const CategoryModel = model<ICategoryDocument>('Category', categorySchema);

export default CategoryModel;
