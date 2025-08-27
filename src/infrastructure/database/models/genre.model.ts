import { Document, Types, Schema, model } from "mongoose";
import { IGenre } from "@/domain/genre/entity/genre.entity";

type IGenreModel = Document<Types.ObjectId, unknown, IGenre> & IGenre;

const genreModelSchema = new Schema<IGenreModel>(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
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

genreModelSchema.virtual("animes", {
  ref: "Anime",
  localField: "_id",
  foreignField: "genre",
});

genreModelSchema.set("toObject", { virtuals: true });
genreModelSchema.set("toJSON", { virtuals: true });

const GenreModel = model<IGenreModel>("Genre", genreModelSchema);

export default GenreModel;
