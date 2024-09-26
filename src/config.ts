import dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  cache: {
    duration: parseInt(process.env.CACHE_DURATION!),
  },
  skinport: {
    apiUrl: 'https://api.skinport.com/v1/items',
  },
};
