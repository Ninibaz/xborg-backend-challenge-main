export const production: any = {
  DATABASE_URL: process.env.DATABASE_URL,

  JWT: {
    SECRET: process.env.JWT_SECRET,
  },
};
