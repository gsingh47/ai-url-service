import dotenv from 'dotenv';

dotenv.config();

export const DEV = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';
export const PROD = process.env.NODE_ENV === 'production';

export const SERVER_HOSTNAME = 'localhost';
export const SERVER_PORT = 4000;

export const SERVER = {
  SERVER_HOSTNAME,
  SERVER_PORT
};