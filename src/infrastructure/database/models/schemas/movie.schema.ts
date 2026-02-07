import { Schema } from 'mongoose';

export type IMovieSchema = {
  title: string;
  releaseDate: Date;
};

const movieSchema = new Schema<IMovieSchema>(
  {
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
  },
  { versionKey: false, _id: false, timestamps: false },
);

export default movieSchema;
