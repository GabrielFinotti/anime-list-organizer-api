import { AnimeDTO } from "@/interface/dto/anime.dto";
import CategoryRepository from "@/repositories/category.repository";
import GenreRepository from "@/repositories/genre.repository";

const animeNormalization = async (anime: Partial<AnimeDTO>) => {
  try {
    const { category, genres } = anime;
    const categoryRepository = new CategoryRepository();
    const genreRepository = new GenreRepository();

    if (!category || !genres) {
      throw new Error("Category and Genres are required");
    }

    const categoryId = await categoryRepository.findByName(category.name);

    const genresId = await Promise.all(
      genres.map((genre) => genreRepository.findByName(genre.name))
    );

    const normalizedAnime = {
      ...anime,
      category: categoryId.id,
      genres: genresId.map((genre) => genre.id),
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
