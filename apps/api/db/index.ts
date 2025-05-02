// packages/api/src/db/index.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
// import 'dotenv/config'; // Ensure env vars are loaded

// --- Construct DATABASE_URL dynamically (if using components) ---
const dbUser = process.env.DB_USER || process.env.CATAPULTUSER;
const dbPassword = process.env.DB_PASSWORD || process.env.CATAPULTPASSWORD;
const dbHost = process.env.DB_HOST || process.env.SERVER;
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || process.env.CATAPULTDATABASENAME;
const dbSchema = process.env.DB_SCHEMA || 'catapult'; // Keep schema variable

if (!dbUser || !dbPassword || !dbHost || !dbName) {
  throw new Error('Missing required database environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME)');
}

const encodedDbPassword = encodeURIComponent(dbPassword);

// Construct URL WITHOUT the schema parameter
const databaseUrl = `postgresql://${dbUser}:${encodedDbPassword}@${dbHost}:${dbPort}/${dbName}`;
// --- End dynamic construction ---

// Create the connection pool
const pool = postgres(databaseUrl, {
    // --- Add search_path option here ---
    search_path: dbSchema, // Use the schema variable
    // --- End add ---
});

// Create the Drizzle instance with the schema
export const db = drizzle(pool, { schema });

export { schema };

console.log('🐘 Database connection pool initialized.');

// Optional: Add graceful shutdown logic if needed for your deployment
process.on('SIGTERM', async () => {
  console.log('🔌 Closing database pool...');
  await pool.end({ timeout: 5 });
  console.log('🐘 Database pool closed.');
  process.exit(0);
});
