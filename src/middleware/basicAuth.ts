import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const basicAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid Authorization header" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf-8"
    );
    const [username, password] = credentials.split(":");

    if (
      username !== process.env.BASIC_USERNAME ||
      password !== process.env.BASIC_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export default basicAuth;
