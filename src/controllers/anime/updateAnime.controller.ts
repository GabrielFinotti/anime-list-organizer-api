import { Request, Response, NextFunction } from "express";
import { animeService, mapError, notFound } from "./_shared";

export const updateAnime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await animeService.update(req.params.id, req.body);

    if (!updated) return notFound(res);

    res.json({ data: updated });
  } catch (err) {
    const mapped = mapError(err);

    if (mapped.status === 500) return next(err);

    res.status(mapped.status).json(mapped.body);
  }
};
