import { IUserRepository } from "../../../domain/repository/user.js";
import { IAnimeRepository } from "../../../domain/repository/anime.js";
import UserApplicationMapper from "../../mapper/user.js";

class LikeAnimeUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly animeRepository: IAnimeRepository
  ) {}

  async execute(userId: string, animeId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const anime = await this.animeRepository.findById(animeId);

    if (!anime) {
      throw new Error("Anime not found");
    }

    user.likeAnime(anime);

    const updatedUser = await this.userRepository.update(user);

    return UserApplicationMapper.toResponse(updatedUser);
  }
}

export default LikeAnimeUseCase;
