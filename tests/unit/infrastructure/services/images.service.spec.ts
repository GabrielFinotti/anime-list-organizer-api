import ImagesService from '../../../../src/infrastructure/services/images.service';

// Mock sharp
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    webp: jest.fn().mockReturnThis(),
    withExif: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
  }));
});

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton instance for testing
    (ImagesService as any).instance = undefined;
    service = ImagesService.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = ImagesService.getInstance();
      const instance2 = ImagesService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('downloadImage', () => {
    it('should download and process image successfully', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('image/jpeg'),
        },
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await service.downloadImage(
        'https://example.com/image.jpg',
        'Test Anime',
      );

      expect(result).toBeInstanceOf(Buffer);
      expect(mockFetch).toHaveBeenCalledWith('https://example.com/image.jpg');
    });

    it('should throw error for invalid URL', async () => {
      await expect(
        service.downloadImage('invalid-url', 'Test Anime'),
      ).rejects.toThrow('Invalid URL provided for image download.');
    });

    it('should throw error when fetch fails', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Not Found',
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(
        service.downloadImage('https://example.com/image.jpg', 'Test Anime'),
      ).rejects.toThrow('Failed to download image from https://example.com/image.jpg: Not Found');
    });

    it('should throw error for non-image content type', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('text/html'),
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(
        service.downloadImage('https://example.com/page.html', 'Test Anime'),
      ).rejects.toThrow('Invalid content-type for image download: text/html');
    });

    it('should handle missing content-type header', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(
        service.downloadImage('https://example.com/image.jpg', 'Test Anime'),
      ).rejects.toThrow('Invalid content-type for image download:');
    });

    it('should accept various image content types', async () => {
      const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      for (const contentType of imageTypes) {
        const mockArrayBuffer = new ArrayBuffer(8);
        const mockResponse = {
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue(contentType),
          },
          arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
        };

        mockFetch.mockResolvedValue(mockResponse);

        const result = await service.downloadImage(
          'https://example.com/image.jpg',
          'Test Anime',
        );

        expect(result).toBeInstanceOf(Buffer);
      }
    });

    it('should handle case-insensitive content-type', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('IMAGE/JPEG'),
        },
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await service.downloadImage(
        'https://example.com/image.jpg',
        'Test Anime',
      );

      expect(result).toBeInstanceOf(Buffer);
    });

    it('should rethrow known errors', async () => {
      const knownError = new Error('Known error message');
      mockFetch.mockRejectedValue(knownError);

      await expect(
        service.downloadImage('https://example.com/image.jpg', 'Test Anime'),
      ).rejects.toThrow('Known error message');
    });

    it('should wrap unknown errors', async () => {
      mockFetch.mockRejectedValue('string error');

      await expect(
        service.downloadImage('https://example.com/image.jpg', 'Test Anime'),
      ).rejects.toThrow('Unknown error occurred while downloading image.');
    });
  });
});
