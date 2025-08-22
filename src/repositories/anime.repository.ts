import AnimeModel, {
  toAnimeDTO,
  AnimeLean,
} from "@/database/models/anime.model";
import { IAnimeRepository } from "@/interfaces/repositories/anime.repositories";
import { CreateAnimeSchema, UpdateAnimeSchema } from "@/schemas/anime.schema";
import { AnimeDTO } from "@/interfaces/dto/anime.dto";
import mongoose from "mongoose";

class AnimeRepository implements IAnimeRepository {
  async create(anime: CreateAnimeSchema): Promise<AnimeDTO> {
    const created = await AnimeModel.create(anime);

    return toAnimeDTO(created);
  }

  async update(id: string, anime: UpdateAnimeSchema): Promise<AnimeDTO | null> {
    if (!mongoose.isValidObjectId(id)) return null;

    const updated = await AnimeModel.findByIdAndUpdate(id, anime, {
      new: true,
    });

    return updated ? toAnimeDTO(updated) : null;
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.isValidObjectId(id)) return;

    await AnimeModel.findByIdAndDelete(id).exec();
  }

  async findById(id: string): Promise<AnimeDTO | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await AnimeModel.findById(id).lean<AnimeLean>().exec();

    return doc ? toAnimeDTO(doc) : null;
  }

  async findAll(): Promise<AnimeDTO[]> {
    const docs = await AnimeModel.find().lean<AnimeLean[]>().exec();

    return docs.map((d) => toAnimeDTO(d));
  }
}

export default AnimeRepository;
