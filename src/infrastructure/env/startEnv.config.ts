import dotenv from 'dotenv';

dotenv.config({ debug: process.env.NODE_ENV === 'development' });

type StartEnvProps = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  VERSION: string;
  MONGO_URI: string;
  MONGO_NAME: string;
  REDIS_URL: string;
  SECRET_KEY: string;
  OPENAI_API_KEY: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_ACCESS_KEY_ID: string;
  CLOUDFLARE_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_R2_BUCKET_NAME: string;
  CLOUDFLARE_R2_PUBLIC_DOMAIN: string;
  TOKEN_EXPIRATION: string;
};

class StartEnv {
  private readonly _env: StartEnvProps;

  private static instance: StartEnv;

  private constructor(props: StartEnvProps) {
    this._env = props;
  }

  get value() {
    return this._env;
  }

  static getInstance() {
    if (!StartEnv.instance) {
      StartEnv.instance = StartEnv.create();
    }

    return StartEnv.instance;
  }

  private static create() {
    const envProps = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: Number(process.env.PORT),
      VERSION: process.env.VERSION,
      MONGO_URI: process.env.MONGO_URI,
      MONGO_NAME: process.env.MONGO_NAME,
      REDIS_URL: process.env.REDIS_URL,
      SECRET_KEY: process.env.SECRET_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID,
      CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      CLOUDFLARE_R2_PUBLIC_DOMAIN: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN,
      TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
    };

    if (Object.values(envProps).some((value) => value === undefined)) {
      throw new Error('Some environment variables are missing or undefined.');
    }

    return new StartEnv(envProps as StartEnvProps);
  }
}

export default StartEnv;
