import { IR2Service } from '../../../../application/services/r2.service.js';
import R2Client from '../config/r2.client.js';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

class R2Service implements IR2Service {
  private readonly r2Client: R2Client;

  private static instance: R2Service;

  private constructor() {
    this.r2Client = R2Client.getInstance();
  }

  static getInstance() {
    if (!R2Service.instance) {
      R2Service.instance = new R2Service();
    }

    return R2Service.instance;
  }

  async uploadObject(body: Buffer, key: string): Promise<URL> {
    const bucket = this.r2Client.bucketName;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: 'image/webp',
    });

    const result = await this.r2Client.client.send(command);

    if (
      result.$metadata.httpStatusCode &&
      (result.$metadata.httpStatusCode < 200 || result.$metadata.httpStatusCode >= 300)
    ) {
      throw new Error('Failed to upload object to R2');
    }

    const publicDomain = this.r2Client.publicDomain;

    return new URL(`https://${publicDomain}/${key}`);
  }

  async updateObject(body: Buffer, key: string): Promise<URL> {
    return this.uploadObject(body, key);
  }

  async deleteObject(key: string): Promise<void> {
    const bucket = this.r2Client.bucketName;

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const result = await this.r2Client.client.send(command);

    if (
      result.$metadata.httpStatusCode &&
      (result.$metadata.httpStatusCode < 200 || result.$metadata.httpStatusCode >= 300)
    ) {
      throw new Error('Failed to delete object from R2');
    }
  }
}

export default R2Service;
