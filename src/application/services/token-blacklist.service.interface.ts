export interface ITokenBlacklistService {
  addToBlacklist(token: string, remainingTTLInSeconds: number): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
  removeFromBlacklist(token: string): Promise<void>;
}
