import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const EXPECTED_USER = process.env.BASIC_AUTH_USER;
const EXPECTED_PASS = process.env.BASIC_AUTH_PASS;

function parseBasicAuth(header?: string) {
  if (!header) return null;

  const [type, value] = header.split(" ");

  if (!type || type.toLowerCase() !== "basic" || !value) return null;

  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    const idx = decoded.indexOf(":");

    if (idx === -1) return null;

    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);

    return { user, pass };
  } catch {
    return null;
  }
}

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const credentials = parseBasicAuth(req.header("authorization"));

  if (!credentials) {
    return res
      .status(401)
      .set("WWW-Authenticate", 'Basic realm="Restricted"')
      .json({ error: "Credenciais necessárias" });
  }
  const { user, pass } = credentials;

  if (user !== EXPECTED_USER || pass !== EXPECTED_PASS) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  return next();
};

export default basicAuth;
