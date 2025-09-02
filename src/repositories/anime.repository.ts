import AnimeModel from "@/database/model/anime.model";
import { AnimeDTO } from "@/interface/dto/anime.dto";
import { IAnimeRepository } from "@/interface/repository/anime.repository";
import animeNormalization from "@/utils/normalize/anime.normalize";

class AnimeRepository implements IAnimeRepository {
  async create(anime: AnimeDTO) {
    try {
      const normalizedAnime = await animeNormalization(anime);

      const newAnime = await AnimeModel.create(normalizedAnime);

      const createdAnime: AnimeDTO = {
        id: newAnime._id.toString(),
        name: newAnime.name,
        synopsis: newAnime.synopsis,
        category: await newAnime.populate("category"),
        genres: await newAnime.populate("genres"),
        typeOfMaterialOrigin: newAnime.typeOfMaterialOrigin,
        materialOriginName: newAnime.materialOriginName,
        releaseDate: newAnime.releaseDate.toLocaleDateString("pt-BR"),
        isMovie: newAnime.isMovie,
        derivate: newAnime.derivate,
        lastReleaseSeason: newAnime.lastReleaseSeason,
        lastWatchedSeason: newAnime.lastWatchedSeason,
        lastWatchedEpisode: newAnime.lastWatchedEpisode,
        status: newAnime.status,
      };

      return createdAnime;
    } catch (error) {
      console.error(error);

      throw new Error("Error creating anime");
    }
  }
}
