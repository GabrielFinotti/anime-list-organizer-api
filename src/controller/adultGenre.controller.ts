import { AdultGenreDTO } from "@/interface/dto/adultGenre.dto";
import AdultGenreService from "@/service/adultGenre.service";
import { Request, Response } from "express";

class AdultGenreController {
  private constructor(private adultGenreService = new AdultGenreService()) {}

  static async create(req: Request, res: Response) {
    try {
      const body = req.body as AdultGenreDTO;

      const data =
        await new AdultGenreController().adultGenreService.createAdultGenre(
          body
        );

      if (!data) {
        return res.status(409).json({ message: "Adult genre already exists" });
      }

      return res.status(201).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error creating adult genre" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.adultGenreId;

      const data =
        await new AdultGenreController().adultGenreService.deleteAdultGenre(id);

      if (!data) {
        return res.status(404).json({ message: "Adult genre not found" });
      }

      return res
        .status(200)
        .json({ message: "Adult genre deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error deleting adult genre" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const data =
        await new AdultGenreController().adultGenreService.getAllAdultGenres();

      if (!data) {
        return res.status(404).json({ message: "No adult genres found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res
        .status(500)
        .json({ message: "Error getting all adult genres" });
    }
  }
}

export default AdultGenreController;
