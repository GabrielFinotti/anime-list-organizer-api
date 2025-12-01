import jwt, { JsonWebTokenError, TokenExpiredError, SignOptions } from 'jsonwebtoken';
import StartEnv from '../env/startEnv.config.js';
import { IJwtService, TokenPayload } from '../../application/services/jwt.service.interface.js';

type DecodedToken = TokenPayload & {
  iat: number;
  exp: number;
};

class JwtService implements IJwtService {
  private readonly secretKey: string;
  private readonly tokenExpiration: string;
  private static instance: JwtService;

  private constructor() {
    const env = StartEnv.getInstance().value;
    this.secretKey = env.SECRET_KEY;
    this.tokenExpiration = env.TOKEN_EXPIRATION;
  }

  static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }

    return JwtService.instance;
  }

  generateToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: this.tokenExpiration as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(payload, this.secretKey, options);
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secretKey) as DecodedToken;

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error('Token expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new Error('Invalid token');
      }

      throw error;
    }
  }

  getTokenRemainingTTL(token: string): number {
    try {
      const decoded = jwt.decode(token) as DecodedToken | null;

      if (!decoded || !decoded.exp) {
        return 0;
      }

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const remainingTTL = decoded.exp - currentTimeInSeconds;

      return remainingTTL > 0 ? remainingTTL : 0;
    } catch {
      return 0;
    }
  }
}

export default JwtService;
