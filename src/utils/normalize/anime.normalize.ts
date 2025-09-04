import { AnimeDTO } from "@/interface/dto/anime.dto";
import CategoryRepository from "@/repository/category.repository";
import GenreRepository from "@/repository/genre.repository";
import AdultGenreRepository from "@/repository/adultGenre.repository";
import { AdultGenreDTO } from "@/interface/dto/adultGenre.dto";

const animeNormalization = async (anime: Partial<AnimeDTO>) => {
  try {
    const { category, genres, adultGenres } = anime;
    const categoryRepository = new CategoryRepository();
    const genreRepository = new GenreRepository();
    const adultGenreRepository = new AdultGenreRepository();
    let adultGenresId: AdultGenreDTO[] = [];

    if (!category || !genres) {
      throw new Error("Category and Genres are required");
    }

    const categoryId = await categoryRepository.findByName(category.name);

    if (!categoryId) {
      throw new Error(`Category "${category.name}" not found`);
    }

    const genresId = await Promise.all(
      genres.map(async (genre) => {
        const genreDoc = await genreRepository.findByName(genre.name);

        if (!genreDoc) {
          throw new Error(`Genre "${genre.name}" not found`);
        }

        return genreDoc;
      })
    );

    if (adultGenres && adultGenres.length > 0) {
      adultGenresId = await Promise.all(
        adultGenres.map(async (adultGenre) => {
          const adultGenreDoc = await adultGenreRepository.findByName(
            adultGenre.name
          );

          if (!adultGenreDoc) {
            throw new Error(`Adult genre "${adultGenre.name}" not found`);
          }

          return adultGenreDoc;
        })
      );
    }

    const normalizedAnime = {
      ...anime,
      category: categoryId.id,
      genres: genresId.map((genre) => genre.id),
      adultGenres: adultGenresId.map((adultGenre) => adultGenre.id),
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
