const validationEnv = async () => {
  const envs = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
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
