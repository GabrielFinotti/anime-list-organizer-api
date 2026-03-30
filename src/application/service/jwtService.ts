export type IJwtService = {
  createToken(userId: string): string;
  verifyToken(token: string): string;
};
