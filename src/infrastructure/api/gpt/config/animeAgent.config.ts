import OpenAI from 'openai';
import StartEnv from '../../../env/startEnv.config.js';

class AnimeAgentConfig {
  private readonly client: OpenAI;

  private static instance: AnimeAgentConfig;

  private constructor() {
    const env = StartEnv.getInstance().value;

    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      timeout: 900000,
    });
  }

  get clientInstance() {
    return this.client;
  }

  static getInstance() {
    if (!AnimeAgentConfig.instance) {
      AnimeAgentConfig.instance = new AnimeAgentConfig();
    }

    return AnimeAgentConfig.instance;
  }
}

export default AnimeAgentConfig;
