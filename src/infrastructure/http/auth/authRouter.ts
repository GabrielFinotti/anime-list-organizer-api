import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import ApiResponse from "../utils/api.response";

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const expectedUser = process.env.BASIC_AUTH_USER || "";
  const expectedPass = process.env.BASIC_AUTH_PASSWORD || "";

  if (!expectedUser || !expectedPass) {
    const result = ApiResponse.error(
      500,
      "Credenciais de autenticação não configuradas",
      null
    );

    res.status(result.statusCode).json(result);
    return;
  }

  const header = req.headers["authorization"];

  if (!header || !header.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="API"');

    const result = ApiResponse.error(401, "Autenticação necessária", null);

    res.status(result.statusCode).json(result);
    return;
  }

  const base64Credentials = header.split(" ")[1];
  let decoded = "";

  try {
    decoded = Buffer.from(base64Credentials, "base64").toString("utf8");
  } catch {
    const result = ApiResponse.error(
      400,
      "Header de autorização inválido",
      null
    );

    res.status(result.statusCode).json(result);
    return;
  }

  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    const result = ApiResponse.error(
      400,
      "Formato de credencial inválido",
      null
    );

    res.status(result.statusCode).json(result);
    return;
  }

  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  const userMatch = safeEqual(user, expectedUser);
  const passMatch = safeEqual(pass, expectedPass);

  if (!userMatch || !passMatch) {
    res.setHeader("WWW-Authenticate", 'Basic realm="API"');

    const result = ApiResponse.error(401, "Credenciais inválidas", null);

    res.status(result.statusCode).json(result);
    return;
  }

  return next();
};

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export default basicAuth;
