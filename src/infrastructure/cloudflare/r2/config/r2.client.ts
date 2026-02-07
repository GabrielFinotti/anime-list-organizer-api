import { S3Client } from '@aws-sdk/client-s3';
import StartEnv from '../../../env/startEnv.config.js';

class R2Client {
  private readonly _client: S3Client;
  private readonly _bucketName: string;
  private readonly _publicDomain: string;

  private static instance: R2Client;

  private constructor() {
    const env = StartEnv.getInstance().value;

    this._bucketName = env.CLOUDFLARE_R2_BUCKET_NAME;
    this._publicDomain = env.CLOUDFLARE_R2_PUBLIC_DOMAIN;
    this._client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    });
  }

  get client() {
    return this._client;
  }

  get bucketName() {
    return this._bucketName;
  }

  get publicDomain() {
    return this._publicDomain;
  }

  static getInstance() {
    if (!R2Client.instance) {
      R2Client.instance = new R2Client();
    }

    return R2Client.instance;
  }
}

export default R2Client;
