import { Document, model, Schema } from 'mongoose';

type IGenreDocument = Document & {
  _id: string;
  name: string;
  description: string;
  isAdultContent: boolean;
};

const genreSchema = new Schema<IGenreDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    isAdultContent: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

const GenreModel = model<IGenreDocument>('Genre', genreSchema);

export default GenreModel;
