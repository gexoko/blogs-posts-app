import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env;

// Логин и пароль супер-админа (можно переопределить переменными окружения).
export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';

export const SETTINGS = {
  PORT: env.PORT || 5003,
  MONGO_URL:
    env.MONGO_URL || 'mongodb://localhost:27017/blogs-posts-app-lesson3',
  DB_NAME: env.DB_NAME || 'blogs-posts-app-lesson3',
};
// || 'mongodb://localhost:27017/ed-back-lessons-uber' f
