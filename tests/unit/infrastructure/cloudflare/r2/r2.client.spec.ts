import R2Client from '../../../../../src/infrastructure/cloudflare/r2/config/r2.client';
import StartEnv from '../../../../../src/infrastructure/env/startEnv.config';
import { S3Client } from '@aws-sdk/client-s3';

// Mock StartEnv
jest.mock('../../../../../src/infrastructure/env/startEnv.config');

// Mock S3Client
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({})),
}));

describe('R2Client', () => {
  const mockEnvValues = {
    CLOUDFLARE_ACCOUNT_ID: 'test-account-id',
    CLOUDFLARE_ACCESS_KEY_ID: 'test-access-key',
    CLOUDFLARE_SECRET_ACCESS_KEY: 'test-secret-key',
    CLOUDFLARE_R2_BUCKET_NAME: 'test-bucket',
    CLOUDFLARE_R2_PUBLIC_DOMAIN: 'cdn.example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset singleton instance
    (R2Client as any).instance = undefined;

    // Mock StartEnv.getInstance
    (StartEnv.getInstance as jest.Mock).mockReturnValue({
      value: mockEnvValues,
    });
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = R2Client.getInstance();
      const instance2 = R2Client.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should create S3Client with correct configuration', () => {
      R2Client.getInstance();

      expect(S3Client).toHaveBeenCalledWith({
        region: 'auto',
        endpoint: `https://${mockEnvValues.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: mockEnvValues.CLOUDFLARE_ACCESS_KEY_ID,
          secretAccessKey: mockEnvValues.CLOUDFLARE_SECRET_ACCESS_KEY,
        },
      });
    });
  });

  describe('getters', () => {
    it('should return client', () => {
      const r2Client = R2Client.getInstance();

      expect(r2Client.client).toBeDefined();
    });

    it('should return bucketName', () => {
      const r2Client = R2Client.getInstance();

      expect(r2Client.bucketName).toBe(mockEnvValues.CLOUDFLARE_R2_BUCKET_NAME);
    });

    it('should return publicDomain', () => {
      const r2Client = R2Client.getInstance();

      expect(r2Client.publicDomain).toBe(mockEnvValues.CLOUDFLARE_R2_PUBLIC_DOMAIN);
    });
  });

  describe('endpoint configuration', () => {
    it('should construct correct R2 endpoint URL', () => {
      R2Client.getInstance();

      expect(S3Client).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: 'https://test-account-id.r2.cloudflarestorage.com',
        }),
      );
    });

    it('should use auto region for R2', () => {
      R2Client.getInstance();

      expect(S3Client).toHaveBeenCalledWith(
        expect.objectContaining({
          region: 'auto',
        }),
      );
    });
  });
});
