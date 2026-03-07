import User from "../../domain/entity/User.js";
import { IAnimeRepository } from "../../domain/repository/anime.js";
import { IUserRepository } from "../../domain/repository/user.js";
import UserModel from "../database/models/user.js";
import UserPersistenceMapper, { UserDocument } from "../mapper/user.js";

class UserRepositoryImpl implements IUserRepository {
  private constructor(private animeRepository: IAnimeRepository) {}

  async findById(id: string) {
    const userDoc = await UserModel.findById(id).lean<UserDocument>();

    return userDoc ? this.mapToDomain(userDoc) : null;
  }

  async findByEmail(email: string) {
    const userDoc = await UserModel.findOne({
      email,
    }).lean<UserDocument>();

    return userDoc ? this.mapToDomain(userDoc) : null;
  }

  async findAll() {
    const userDocs = await UserModel.find().lean<UserDocument[]>();

    return Promise.all(userDocs.map((doc) => this.mapToDomain(doc)));
  }

  async create(user: User) {
    await UserModel.create(UserPersistenceMapper.toPersistence(user));
  }

  async update(user: User) {
    await UserModel.findByIdAndUpdate(
      user.id,
      UserPersistenceMapper.toPersistence(user),
    );

    return user;
  }

  async delete(id: string) {
    await UserModel.findByIdAndDelete(id);
  }

  private async mapToDomain(userDoc: UserDocument) {
    const animeList = await Promise.all(
      userDoc.animeList.list.map(async (animeId) => {
        const anime = await this.animeRepository.findById(animeId);

        if (!anime) {
          throw new Error(`Anime with ID ${animeId} not found`);
        }

        return anime;
      }),
    );

    const favoritesAnimes = await Promise.all(
      userDoc.favoritesAnimes.list.map(async (animeId) => {
        const anime = await this.animeRepository.findById(animeId);

        if (!anime) {
          throw new Error(`Anime with ID ${animeId} not found`);
        }

        return anime;
      }),
    );

    return UserPersistenceMapper.toDomain(userDoc, animeList, favoritesAnimes);
  }
}

export default UserRepositoryImpl;
