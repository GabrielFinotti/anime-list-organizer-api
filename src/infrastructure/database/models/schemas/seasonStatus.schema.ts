import { Schema } from 'mongoose';
import seasonSchema, { ISeasonSchema } from './season.schema.js';

export type ISeasonStatusSchema = {
  season: ISeasonSchema;
  status: 'watching' | 'finished' | 'in_list';
  lastEpisodeWatched: number;
  isLiked: boolean;
};

const seasonStatusSchema = new Schema<ISeasonStatusSchema>(
  {
    season: seasonSchema,
    status: { type: String, enum: ['watching', 'finished', 'in_list'], required: true },
    lastEpisodeWatched: { type: Number, required: true },
    isLiked: { type: Boolean, required: true },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: false,
  },
);

export default seasonStatusSchema;
