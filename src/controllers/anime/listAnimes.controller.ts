import { Request, Response, NextFunction } from "express";
import { animeService, mapError } from "./_shared";

export const listAnimes = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const list = await animeService.findAll();

    res.json({ data: list });
  } catch (err) {
    const mapped = mapError(err);

    if (mapped.status === 500) return next(err);
    
    res.status(mapped.status).json(mapped.body);
  }
};
