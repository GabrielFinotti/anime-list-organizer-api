import dotenv from 'dotenv';

dotenv.config({ debug: process.env.NODE_ENV === 'development' });

type StartEnvProps = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  VERSION: number;
  MONGO_URI: string;
  MONGO_NAME: string;
  REDIS_URL: string;
  SECRET_KEY: string;
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
      VERSION: Number(process.env.VERSION),
      MONGO_URI: process.env.MONGO_URI,
      MONGO_NAME: process.env.MONGO_NAME,
      REDIS_URL: process.env.REDIS_URL,
      SECRET_KEY: process.env.SECRET_KEY,
      TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
    };

    if (Object.values(envProps).some((value) => value === undefined)) {
      throw new Error('Missing environment variables');
    }

    return new StartEnv(envProps as StartEnvProps);
  }
}

export default StartEnv;
