// packages/api/src/db/migrate.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

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

const runMigrate = async () => {
  console.log('🚀 Starting database migration...');

  // Create a separate, single connection for migrations
  const migrationConnection = postgres(databaseUrl, {
      max: 1,
      // --- Add search_path option here ---
      search_path: dbSchema, // Use the schema variable
      // --- End add ---
  });
  const migrationDb = drizzle(migrationConnection);

  try {
    await migrate(migrationDb, { migrationsFolder: './drizzle' });
    console.log('✅ Database migration completed successfully.');
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  } finally {
    await migrationConnection.end();
    console.log('🔌 Migration connection closed.');
  }
};

runMigrate();
