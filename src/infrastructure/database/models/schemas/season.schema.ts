import { Schema } from 'mongoose';

export type ISeasonSchema = {
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

const seasonSchema = new Schema<ISeasonSchema>(
  {
    seasonNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    totalEpisodes: { type: Number, required: true },
  },
  { versionKey: false, _id: false, timestamps: false },
);

export default seasonSchema;
