import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in environment variables');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

if (!process.env.MODEL_API_URL) {
  throw new Error('MODEL_API_URL is required in environment variables');
}

export const appConfig = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
};

export const modelConfig = {
  url: process.env.MODEL_API_URL,
};
