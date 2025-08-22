import { IAnimeRepository } from "@/interfaces/repositories/anime.repositories";
import { CreateAnimeSchema, UpdateAnimeSchema } from "@/schemas/anime.schema";
import { AnimeDTO } from "@/interfaces/dto/anime.dto";
import { DuplicateAnimeTitleError } from "@/errors/anime.errors";
import AnimeModel from "@/database/models/anime.model";

export class AnimeService {
  constructor(private readonly repo: IAnimeRepository) {}

  async create(data: CreateAnimeSchema): Promise<AnimeDTO> {
    const exists = await AnimeModel.exists({ title: data.title });

    if (exists) {
      throw new DuplicateAnimeTitleError(data.title);
    }

    return this.repo.create(data);
  }

  async update(id: string, data: UpdateAnimeSchema): Promise<AnimeDTO | null> {
    if (data.title) {
      const exists = await AnimeModel.exists({
        title: data.title,
        _id: { $ne: id },
      });

      if (exists) {
        throw new DuplicateAnimeTitleError(data.title);
      }
    }

    return this.repo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findById(id: string): Promise<AnimeDTO | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<AnimeDTO[]> {
    return this.repo.findAll();
  }
}
