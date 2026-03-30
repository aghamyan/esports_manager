const path = require('path');
const dotenv = require('dotenv');

// Always load environment variables from server/.env
const envFilePath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envFilePath });

const parsedPort = Number(process.env.PORT);

const env = {
  // Use PORT from .env when valid, otherwise fallback to 5000
  port: Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 5000,
  // Use CORS_ORIGIN from .env when set, otherwise fallback to frontend dev URL
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
};

module.exports = env;
