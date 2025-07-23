import dotenv from 'dotenv';
import path from 'path';

// Load .env based on NODE_ENV(development by default)
const env = process.env.NODE_ENV || 'development';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`), // Load environment variables from .env file
});

// Helper function to get environment variables with a fallback option
// Throws an error if the variable is not defined and no fallback is provided
function getEnvVariable(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value?? fallback!;
}

// Configuration object for the application
// Uses environment variables with sensible defaults
export const config = {
  env: getEnvVariable('NODE_ENV', 'development'),
  port: parseInt(getEnvVariable('PORT','3000'), 10),
  scyllaDb: {
    contactPoints: getEnvVariable('SCYLLADB_CONTACT_POINTS', 'localhost'),
    username: getEnvVariable('SCYLLADB_USERNAME', 'scylla'),
    password: getEnvVariable('SCYLLADB_PASSWORD', 'scylla'),
    localDataCenter: getEnvVariable('SCYLLADB_LOCAL_DATACENTER', 'datacenter1'),
    port: parseInt(getEnvVariable('SCYLLADB_PORT', '9042'), 10),
    keyspace: getEnvVariable('SCYLLADB_KEYSPACE', 'youtube_comments_app'),
  },
};