import { Request, Response, NextFunction } from "express";
import { animeService, mapError } from "./_shared";

export const deleteAnime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await animeService.delete(req.params.id);

    res.status(204).send();
  } catch (err) {
    const mapped = mapError(err);

    if (mapped.status === 500) return next(err);
    
    res.status(mapped.status).json(mapped.body);
  }
};
