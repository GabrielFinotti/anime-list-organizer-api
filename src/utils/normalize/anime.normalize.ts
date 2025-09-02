import CategoryModel from "@/database/model/category.model";
import DerivativeModel from "@/database/model/derivate.model";
import GenreModel from "@/database/model/genre.model";
import { AnimeDTO } from "@/interface/dto/anime.dto";

const animeNormalization = async (anime: AnimeDTO) => {
  try {
    const categoryId = await CategoryModel.findOne({
      name: anime.category.name,
    });

    const genresId = await GenreModel.find({
      name: { $in: anime.genres.map((genre) => genre.name) },
    });

    if (!categoryId || !genresId)
      throw new Error("Category or Genre not found");

    const normalizedAnime = {
      ...anime,
      category: categoryId._id,
      genres: genresId.map((genre) => genre._id),
    };

    return normalizedAnime;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Anime normalization failed: ${error.message}`);
    }

    throw new Error("Anime normalization failed");
  }
};

export default animeNormalization;
