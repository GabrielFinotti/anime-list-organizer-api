import dotenv from "dotenv";

dotenv.config();

type EnvProps = {
  NODE_ENV: string;
  PORT: number;
  VERSION: string;
  SECRET_KEY: string;
  ACCESS_TOKEN_EXPIRATION: string;
};

class Env {
  private readonly _env: EnvProps;

  private static _instance: Env;

  private constructor(props: EnvProps) {
    this._env = props;
  }

  get values() {
    return this._env;
  }

  static create() {
    const envProps = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: Number(process.env.PORT),
      VERSION: process.env.VERSION,
      SECRET_KEY: process.env.SECRET_KEY,
      ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
    };

    if (Object.values(envProps).some((value) => value === undefined)) {
      throw new Error("Missing required environment variables");
    }

    return new Env(envProps as EnvProps);
  }

  static getInstance() {
    if (!Env._instance) {
      Env._instance = Env.create();
    }

    return Env._instance;
  }
}

export default Env;
