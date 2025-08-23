import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ApiResponse from "../utils/api.response";

const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const value = req.params.id;

  if (!Types.ObjectId.isValid(value)) {
    const result = ApiResponse.error(400, "Id inválido", null);

    res.status(result.statusCode).json(result);
    return;
  }

  next();
};

export default validateObjectId;
