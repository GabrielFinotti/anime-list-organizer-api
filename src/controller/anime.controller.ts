import { Request, Response } from "express";
import AnimeService from "@/service/anime.service";
import { AnimeDTO } from "@/interface/dto/anime.dto";

class AnimeController {
  private constructor(private animeService = new AnimeService()) {}

  static async create(req: Request, res: Response) {
    try {
      const animeData = req.body as AnimeDTO;

      const createdAnime = await new AnimeController().animeService.createAnime(
        animeData
      );

      if (!createdAnime) {
        return res.status(400).json({ message: "Anime already exists" });
      }

      return res.status(201).json(createdAnime);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error creating anime" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const animeData = req.body as Partial<AnimeDTO>;

      const updatedAnime = await new AnimeController().animeService.updateAnime(
        animeData
      );

      if (!updatedAnime) {
        return res.status(404).json({ message: "Anime not found" });
      }

      return res.status(200).json(updatedAnime);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error updating anime" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const animeId = req.params.animeId;

      const data = await new AnimeController().animeService.deleteAnime(
        animeId
      );

      if (!data) {
        return res.status(404).json({ message: "Anime not found" });
      }

      return res.status(200).json({ message: "Anime deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error deleting anime" });
    }
  }

  static async deleteAll(req: Request, res: Response) {
    try {
      const data = await new AnimeController().animeService.deleteAllAnimes();

      if (!data) {
        return res.status(404).json({ message: "No animes found" });
      }

      return res
        .status(200)
        .json({ message: "All animes deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error deleting all animes" });
    }
  }

  static async getByQuery(req: Request, res: Response) {
    try {
      const { name, category, genre } = req.query;

      const data = await new AnimeController().animeService.getAnimeByQuery(
        name as string,
        category as string,
        genre as string
      );

      if (!data) {
        return res.status(404).json({ message: "No animes found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error getting animes" });
    }
  }

  static async getData(req: Request, res: Response) {
    try {
      const animeId = req.params.animeId;

      const data = await new AnimeController().animeService.getAnimeData(
        animeId
      );

      if (!data) {
        return res.status(404).json({ message: "Anime not found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error getting anime data" });
    }
  }

  static async getAnimeByCategory(req: Request, res: Response) {
    try {
      const category = req.params.category;

      const data = await new AnimeController().animeService.getAnimeByCategory(
        category
      );

      if (!data) {
        return res.status(404).json({ message: "No animes found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error getting animes" });
    }
  }

  static async getAnimeByGenre(req: Request, res: Response) {
    try {
      const genre = req.params.genre;

      const data = await new AnimeController().animeService.getAnimeByGenre(
        genre
      );

      if (!data) {
        return res.status(404).json({ message: "No animes found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error getting animes" });
    }
  }

  static async getAnimeByAdultGenre(req: Request, res: Response) {
    try {
      const adultGenre = req.params.adultGenre;

      const data =
        await new AnimeController().animeService.getAnimeByAdultGenre(
          adultGenre
        );

      if (!data) {
        return res.status(404).json({ message: "No animes found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error getting animes" });
    }
  }
}

export default AnimeController;
