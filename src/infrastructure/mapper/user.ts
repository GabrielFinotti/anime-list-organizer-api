import Anime from "../../domain/entity/Anime.js";
import User from "../../domain/entity/User.js";

type UserDocument = {
  _id: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  imageUrl: string;
  bio: string;
  dateOfBirth: Date;
  role: string;
  animeList: {
    list: string[];
    updatedAt: Date;
  };
  favoritesAnimes: {
    list: string[];
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

class UserPersistenceMapper {
  static toDomain(
    doc: UserDocument,
    animeList: Anime[],
    favoritesAnimes: Anime[],
  ) {
    return User.fromPersistence({
      ...doc,
      animeList: { list: animeList, updatedAt: doc.animeList.updatedAt },
      favoritesAnimes: {
        list: favoritesAnimes,
        updatedAt: doc.favoritesAnimes.updatedAt,
      },
    });
  }

  static toPersistence(user: User) {
    return {
      _id: user.id.value,
      username: user.username.value,
      email: user.email.value,
      password: user.getPasswordFromPersistence(),
      phoneNumber: user.phoneNumber.value,
      imageUrl: user.imageUrl.value,
      bio: user.bio.value,
      dateOfBirth: user.dateOfBirth,
      role: user.role.value,
      animeList: {
        list: user.animeList.list.map((anime) => anime.id.value),
        updatedAt: user.animeList.updatedAt,
      },
      favoritesAnimes: {
        list: user.favoritesAnimes.list.map((anime) => anime.id.value),
        updatedAt: user.favoritesAnimes.updatedAt,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default UserPersistenceMapper;
