import { CreateAnimeDto, UpdateAnimeDto } from "@/application/dtos/anime.dto";
import { IAnimeRepository } from "@/domain/anime/repositories/anime.repository";
import AnimeModel from "../models/anime.models";
import Anime from "@/domain/anime/entity/anime.entity";

class AnimeRepository implements IAnimeRepository {
  async create(data: CreateAnimeDto) {
    const newAnime = await AnimeModel.create(data);

    return new Anime(newAnime);
  }

  async update(id: string, data: UpdateAnimeDto) {
    const updatedAnime = await AnimeModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    return updatedAnime ? new Anime(updatedAnime) : null;
  }

  async delete(id: string): Promise<boolean> {
    const deletedAnime = await AnimeModel.findByIdAndDelete(id);

    return !!deletedAnime;
  }

  async deleteAll(): Promise<boolean> {
    await AnimeModel.deleteMany();

    return true;
  }

  async findById(id: string) {
    const anime = await AnimeModel.findById(id);

    return anime ? new Anime(anime) : null;
  }

  async findByName(name: string) {
    const anime = await AnimeModel.findOne({ name });

    return anime ? new Anime(anime) : null;
  }

  async findAll() {
    const animes = await AnimeModel.find();

    return animes.map((anime) => new Anime(anime));
  }
}

export default AnimeRepository;
