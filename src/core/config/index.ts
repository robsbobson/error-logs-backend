import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    DATABASE_PATH: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    INITIAL_ADMIN_USERNAME?: string;
    INITIAL_ADMIN_PASSWORD?: string;
}

// Helper function to get environment variables with defaults or throw error
function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

const config: EnvConfig = {
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
    PORT: parseInt(getEnvVar('PORT', '3000'), 10),
    DATABASE_PATH: getEnvVar('DATABASE_PATH'),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '1h'),
    // Optional for initial admin setup - might be set later
    INITIAL_ADMIN_USERNAME: process.env.INITIAL_ADMIN_USERNAME,
    INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD,
};

// Validate essential configurations
if (!config.DATABASE_PATH) {
    throw new Error('DATABASE_PATH environment variable is not set.');
}
if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set.');
}
if (config.NODE_ENV === 'production' && config.JWT_SECRET === 'your_very_secret_key_here') {
     console.warn('WARNING: Using default JWT_SECRET in production environment. Please set a strong, unique secret.');
}


export default config; 