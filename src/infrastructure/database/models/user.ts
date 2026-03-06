import { Document, model, Schema } from "mongoose";
import { IAnimeDocument } from "./anime.js";

type IUserDocument = Document & {
  _id: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  imageUrl: string;
  bio: string;
  dateOfBirth: Date;
  role: "user" | "admin";
  animeList: {
    list: IAnimeDocument[];
    updatedAt: Date;
  };
  favoritesAnimes: {
    list: IAnimeDocument[];
    updatedAt: Date;
  };
};

const userSchema = new Schema<IUserDocument>({
  _id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  imageUrl: { type: String, required: true },
  bio: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
  animeList: {
    list: [{ type: String, ref: "Anime", default: [] }],
    updatedAt: { type: Date, default: Date.now },
  },
  favoritesAnimes: {
    list: [{ type: String, ref: "Anime", default: [] }],
    updatedAt: { type: Date, default: Date.now },
  },
});

const UserModel = model<IUserDocument>("User", userSchema);

export default UserModel;
