import sharp from 'sharp';
import { IImagesService } from '../../application/services/images.service.js';

class ImagesService implements IImagesService {
  private static instance: ImagesService;

  private constructor() {}

  static getInstance() {
    if (!ImagesService.instance) {
      ImagesService.instance = new ImagesService();
    }

    return ImagesService.instance;
  }

  async downloadImage(url: string, name: string) {
    try {
      if (!(await this.validateUrl(url))) {
        throw new Error('Invalid URL provided for image download.');
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download image from ${url}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type')?.toLowerCase() || '';

      if (!contentType.startsWith('image/')) {
        throw new Error(`Invalid content-type for image download: ${contentType}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      const buffer = await this.proccessImage(Buffer.from(arrayBuffer), name);

      return buffer;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Unknown error occurred while downloading image.');
    }
  }

  private async validateUrl(url: string) {
    try {
      new URL(url);

      return true;
    } catch {
      return false;
    }
  }

  private async proccessImage(buffer: Buffer, name: string) {
    return await sharp(buffer)
      .webp({
        quality: 100,
      })
      .withExif({
        IFD0: {
          DocumentName: name,
          DateTime: new Date().toLocaleString(),
        },
      })
      .toBuffer();
  }
}

export default ImagesService;
