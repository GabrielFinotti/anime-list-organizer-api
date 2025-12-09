import { Document, model, Schema } from 'mongoose';
import animeStatusSchema, { IAnimeStatusSchema } from './schemas/animeStatus.schema.js';

type IUserDocument = Document & {
  _id: string;
  imageUrl: string;
  username: string;
  email: string;
  password: string;
  biography: string;
  animeList: {
    list: IAnimeStatusSchema[];
    updatedAt: Date;
  };
  role: 'user' | 'admin';
};

const userSchema = new Schema<IUserDocument>(
  {
    _id: { type: String, required: true },
    imageUrl: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    biography: { type: String, required: true },
    animeList: {
      list: [animeStatusSchema],
      updatedAt: { type: Date, required: true },
    },
    role: { type: String, enum: ['user', 'admin'], required: true },
  },
  { timestamps: true },
);

const UserModel = model<IUserDocument>('User', userSchema);

export default UserModel;
