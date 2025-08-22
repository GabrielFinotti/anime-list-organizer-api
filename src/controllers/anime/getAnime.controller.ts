import { Request, Response, NextFunction } from "express";
import { animeService, mapError, notFound } from "./_shared";

export const getAnime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const anime = await animeService.findById(req.params.id);

    if (!anime) return notFound(res);

    res.json({ data: anime });
  } catch (err) {
    const mapped = mapError(err);

    if (mapped.status === 500) return next(err);
    
    res.status(mapped.status).json(mapped.body);
  }
};
