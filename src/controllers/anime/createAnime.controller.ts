import { Request, Response, NextFunction } from "express";
import { animeService, mapError } from "./_shared";

export const createAnime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const created = await animeService.create(req.body);

    res.status(201).json({ data: created });
  } catch (err) {
    const mapped = mapError(err);

    if (mapped.status === 500) return next(err);

    res.status(mapped.status).json(mapped.body);
  }
};
