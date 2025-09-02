import CategoryModel from "@/database/model/category.model";
import GenreModel from "@/database/model/genre.model";
import { AnimeDTO } from "@/interface/dto/anime.dto";

const animeNormalization = async (anime: Partial<AnimeDTO>) => {
  try {
    const { category, genres } = anime;

    if (!category || !genres) {
      throw new Error("Category and Genres are required");
    }

    const categoryId = await CategoryModel.findOne({
      name: category.name,
    });

    const genresId = await GenreModel.find({
      name: { $in: genres.map((genre) => genre.name) },
    });

    if (!categoryId || genresId.length <= 0)
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
