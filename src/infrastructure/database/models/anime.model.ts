import { Document, model, Schema } from 'mongoose';
import movieSchema, { IMovieSchema } from './schemas/movie.schema.js';
import seasonSchema, { ISeasonSchema } from './schemas/season.schema.js';

type IAnimeDocument = Document & {
  _id: string;
  imageUrl: string;
  name: string;
  synopsis: string;
  category: string;
  genres: string[];
  animeType: 'serie' | 'movie' | 'mixed';
  productionType: 'original' | 'adaptation';
  movies: IMovieSchema[];
  seasons: ISeasonSchema[];
  isAdultContent: boolean;
};

const animeSchema = new Schema<IAnimeDocument>(
  {
    _id: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    synopsis: { type: String, required: true },
    category: {
      type: String,
      ref: 'Category',
      required: true,
    },
    genres: [{ type: String, ref: 'Genre', required: true }],
    animeType: { type: String, enum: ['serie', 'movie', 'mixed'], required: true },
    productionType: { type: String, enum: ['original', 'adaptation'], required: true },
    movies: [movieSchema],
    seasons: [seasonSchema],
    isAdultContent: { type: Boolean, required: true },
  },
  { timestamps: true },
);

const AnimeModel = model<IAnimeDocument>('Anime', animeSchema);

export default AnimeModel;
