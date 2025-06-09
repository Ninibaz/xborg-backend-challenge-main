export const production: any = {
  HTTP: {
    PORT: 8080,
    HOST: process.env.HTTP_HOST,
    BASE_URL: process.env.HTTP_BASE_URL,
  },

  JWT: {
    SECRET: process.env.JWT_SECRET,
  },
};
