import { GenreDTO } from "@/interface/dto/genre.dto";
import GenreService from "@/service/genre.service";
import { Request, Response } from "express";

class GenreController {
  private constructor(private genreService = new GenreService()) {}

  static async create(req: Request, res: Response) {
    try {
      const body = req.body as GenreDTO;

      const data = await new GenreController().genreService.createGenre(body);

      if (!data) {
        return res.status(409).json({ message: "Genre already exists" });
      }

      return res.status(201).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error creating genre" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.genreId;

      const data = await new GenreController().genreService.deleteGenre(id);

      if (!data) {
        return res.status(404).json({ message: "Genre not found" });
      }

      return res.status(200).json({ message: "Genre deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error deleting genre" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const data = await new GenreController().genreService.getAllGenres();

      if (!data) {
        return res.status(404).json({ message: "No genres found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error getting all genres" });
    }
  }
}

export default GenreController;
