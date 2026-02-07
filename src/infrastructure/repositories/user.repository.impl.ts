import Anime from '../../domain/entities/Anime.entity.js';
import User from '../../domain/entities/User.entity.js';
import { IAnimeRepository } from '../../domain/repositories/anime.repository.js';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import UserPersistenceMapper, { UserDocument } from '../mappers/user.persistence-mapper.js';
import UserModel from '../database/models/user.model.js';

class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id).lean<UserDocument>();

    if (!userDoc) {
      return null;
    }

    return this.mapToDomain(userDoc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email }).lean<UserDocument>();

    if (!userDoc) {
      return null;
    }

    return this.mapToDomain(userDoc);
  }

  async findAll(): Promise<User[]> {
    const userDocs = await UserModel.find().lean<UserDocument[]>();

    return Promise.all(userDocs.map((doc) => this.mapToDomain(doc)));
  }

  async create(user: User): Promise<User> {
    await UserModel.create(UserPersistenceMapper.toPersistence(user));

    return user;
  }

  async update(user: User): Promise<User> {
    await UserModel.findByIdAndUpdate(user.id.value, UserPersistenceMapper.toPersistence(user));

    return user;
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  private async mapToDomain(doc: UserDocument): Promise<User> {
    const animeIds = doc.animeList.list.map((item) => item.anime);

    const allAnimeIds = [...new Set([...animeIds])];

    const animesMap = new Map<string, Anime>();

    await Promise.all(
      allAnimeIds.map(async (animeId) => {
        const anime = await this.animeRepository.findById(animeId);

        if (anime) {
          animesMap.set(animeId, anime);
        }
      }),
    );

    return UserPersistenceMapper.toDomain(doc, animesMap);
  }
}

export default UserRepositoryImpl;
