import { Schema } from 'mongoose';
import movieSchema, { IMovieSchema } from './movie.schema.js';

export type IMovieStatusSchema = {
  movie: IMovieSchema;
  status: 'watching' | 'finished' | 'in_list';
  isLiked: boolean;
};

const movieStatusSchema = new Schema<IMovieStatusSchema>(
  {
    movie: movieSchema,
    status: {
      type: String,
      enum: ['watching', 'finished', 'in_list'],
      required: true,
    },
    isLiked: { type: Boolean, required: true },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: false,
  },
);

export default movieStatusSchema;
