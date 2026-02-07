import { Schema } from 'mongoose';
import movieStatusSchema, { IMovieStatusSchema } from './movieStatus.schema.js';
import seasonStatusSchema, { ISeasonStatusSchema } from './seasonStatus.schema.js';

export type IAnimeStatusSchema = {
  anime: string;
  status: 'watching' | 'finished' | 'in_list' | 'dropped';
  moviesStatus: IMovieStatusSchema[];
  seasonsStatus: ISeasonStatusSchema[];
  isLiked: boolean;
};

const animeStatusSchema = new Schema<IAnimeStatusSchema>(
  {
    anime: {
      type: String,
      ref: 'Anime',
      required: true,
    },
    status: { type: String, enum: ['watching', 'finished', 'in_list', 'dropped'], required: true },
    moviesStatus: [movieStatusSchema],
    seasonsStatus: [seasonStatusSchema],
    isLiked: { type: Boolean, required: true },
  },
  { _id: false, versionKey: false, timestamps: false },
);

export default animeStatusSchema;
