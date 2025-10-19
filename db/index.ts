import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import ws from 'ws';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Neon for WebSocket in development
neonConfig.webSocketConstructor = ws;

// Get database URL from environment variables
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable is not set');
}

// Create connection pool
const pool = new Pool({ connectionString });

// Create Drizzle instance
export const db = drizzle(pool, { schema });

export { schema };
