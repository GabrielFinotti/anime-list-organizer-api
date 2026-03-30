import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtService } from "../../application/service/jwtService.js";
import Env from "../env/envConfig.js";

class JwtService implements IJwtService {
  private readonly _secretKey: string;
  private readonly _accessTokenExpiration: string;

  private static _instance: JwtService;

  private constructor() {
    const env = Env.getInstance();
    this._secretKey = env.values.SECRET_KEY;
    this._accessTokenExpiration = env.values.ACCESS_TOKEN_EXPIRATION;
  }

  static getInstance() {
    if (!JwtService._instance) {
      JwtService._instance = new JwtService();
    }

    return JwtService._instance;
  }

  createToken(userId: string) {
    const options: SignOptions = {
      expiresIn: this._accessTokenExpiration as SignOptions["expiresIn"],
    };

    return jwt.sign({ userId }, this._secretKey, options);
  }

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this._secretKey);

      if (typeof decoded === "string") {
        throw new Error("Invalid token payload");
      }

      return decoded.userId as string;
    } catch (error) {
      throw error;
    }
  }
}

export default JwtService;
