export type LoginInputDTO = {
  email: string;
  password: string;
};

export type LoginOutputDTO = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    imageUrl: string;
    role: string;
  };
};

export type LogoutInputDTO = {
  token: string;
};
