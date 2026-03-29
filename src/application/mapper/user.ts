import User from "../../domain/entity/User.js";

class UserApplicationMapper {
  static toResponse(user: User) {
    return {
      id: user.id.value,
      username: user.username.value,
      email: user.email.value,
      phoneNumber: user.phoneNumber.value,
      imageUrl: user.imageUrl.value,
      bio: user.bio.value,
      dateOfBirth: user.dateOfBirth,
      role: user.role.value,
      animeList: {
        list: user.animeList.list.map((anime) => {
          return {
            id: anime.id.value,
            title: anime.title.value,
            coverUrl: anime.coverUrl.value,
          };
        }),
        updatedAt: user.animeList.updatedAt,
      },
      favoritesAnimes: {
        list: user.favoritesAnimes.list.map((anime) => {
          return {
            id: anime.id.value,
            title: anime.title.value,
            coverUrl: anime.coverUrl.value,
          };
        }),
        updatedAt: user.favoritesAnimes.updatedAt,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default UserApplicationMapper;