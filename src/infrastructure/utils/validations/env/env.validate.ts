const validationEnv = async () => {
  const envs = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    BASIC_AUTH_USER: process.env.BASIC_AUTH_USER,
    BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
  };

  await Promise.all(
    Object.entries(envs).map(async ([key, value]) => {
      if (!value) {
        throw new Error(`Variável de ambiente ausente: ${key}`);
      }
    })
  );
};

export default validationEnv;
