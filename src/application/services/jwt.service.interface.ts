export type TokenPayload = {
  userId: string;
  email: string;
  role: 'user' | 'admin';
};

export interface IJwtService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
  getTokenRemainingTTL(token: string): number;
}
