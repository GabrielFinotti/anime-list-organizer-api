import R2Service from '../../../../../src/infrastructure/cloudflare/r2/service/r2.service';
import R2Client from '../../../../../src/infrastructure/cloudflare/r2/config/r2.client';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Mock R2Client
jest.mock('../../../../../src/infrastructure/cloudflare/r2/config/r2.client');

// Mock AWS SDK commands
jest.mock('@aws-sdk/client-s3', () => ({
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

describe('R2Service', () => {
  let service: R2Service;
  let mockR2Client: jest.Mocked<R2Client>;
  let mockS3Client: { send: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset singleton instances
    (R2Service as any).instance = undefined;
    (R2Client as any).instance = undefined;

    mockS3Client = {
      send: jest.fn(),
    };

    mockR2Client = {
      client: mockS3Client,
      bucketName: 'test-bucket',
      publicDomain: 'cdn.example.com',
    } as unknown as jest.Mocked<R2Client>;

    (R2Client.getInstance as jest.Mock).mockReturnValue(mockR2Client);

    service = R2Service.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = R2Service.getInstance();
      const instance2 = R2Service.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('uploadObject', () => {
    it('should upload object successfully', async () => {
      const buffer = Buffer.from('test-image');
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
      });

      const result = await service.uploadObject(buffer, key);

      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: key,
        Body: buffer,
        ContentType: 'image/webp',
      });
      expect(mockS3Client.send).toHaveBeenCalled();
      expect(result).toBeInstanceOf(URL);
      expect(result.toString()).toBe('https://cdn.example.com/animes/123/test-anime.webp');
    });

    it('should throw error when upload fails with non-2xx status', async () => {
      const buffer = Buffer.from('test-image');
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 500 },
      });

      await expect(service.uploadObject(buffer, key)).rejects.toThrow(
        'Failed to upload object to R2',
      );
    });

    it('should throw error when upload fails with 4xx status', async () => {
      const buffer = Buffer.from('test-image');
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 403 },
      });

      await expect(service.uploadObject(buffer, key)).rejects.toThrow(
        'Failed to upload object to R2',
      );
    });

    it('should handle upload with 201 status', async () => {
      const buffer = Buffer.from('test-image');
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 201 },
      });

      const result = await service.uploadObject(buffer, key);

      expect(result.toString()).toBe('https://cdn.example.com/animes/123/test-anime.webp');
    });

    it('should handle missing httpStatusCode', async () => {
      const buffer = Buffer.from('test-image');
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: {},
      });

      const result = await service.uploadObject(buffer, key);

      expect(result.toString()).toBe('https://cdn.example.com/animes/123/test-anime.webp');
    });
  });

  describe('updateObject', () => {
    it('should update object by calling uploadObject', async () => {
      const buffer = Buffer.from('test-image');
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
      });

      const result = await service.updateObject(buffer, key);

      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: key,
        Body: buffer,
        ContentType: 'image/webp',
      });
      expect(result.toString()).toBe('https://cdn.example.com/animes/123/test-anime.webp');
    });
  });

  describe('deleteObject', () => {
    it('should delete object successfully', async () => {
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 204 },
      });

      await expect(service.deleteObject(key)).resolves.not.toThrow();

      expect(DeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: key,
      });
      expect(mockS3Client.send).toHaveBeenCalled();
    });

    it('should throw error when delete fails with non-2xx status', async () => {
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 500 },
      });

      await expect(service.deleteObject(key)).rejects.toThrow(
        'Failed to delete object from R2',
      );
    });

    it('should throw error when delete fails with 4xx status', async () => {
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 404 },
      });

      await expect(service.deleteObject(key)).rejects.toThrow(
        'Failed to delete object from R2',
      );
    });

    it('should handle delete with 200 status', async () => {
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
      });

      await expect(service.deleteObject(key)).resolves.not.toThrow();
    });

    it('should handle missing httpStatusCode', async () => {
      const key = 'animes/123/test-anime.webp';

      mockS3Client.send.mockResolvedValue({
        $metadata: {},
      });

      await expect(service.deleteObject(key)).resolves.not.toThrow();
    });
  });
});
