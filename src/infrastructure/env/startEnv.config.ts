import dotenv from 'dotenv';

dotenv.config({ debug: process.env.NODE_ENV === 'development' });

type StartEnvProps = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: string;
  MONGO_URI: string;
  MONGO_NAME: string;
  SECRET_KEY: string;
};

class StartEnv {
  private readonly _env: StartEnvProps;

  private static instance: StartEnv;

  private constructor(props: StartEnvProps) {
    this._env = props;
  }

  get env() {
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
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI,
      MONGO_NAME: process.env.MONGO_NAME,
      SECRET_KEY: process.env.SECRET_KEY,
    };

    if (Object.values(envProps).some((value) => value === undefined)) {
      throw new Error('Missing environment variables');
    }

    return new StartEnv(envProps as StartEnvProps);
  }
}

export default StartEnv;
