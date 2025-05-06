import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { schema } from "./schema.js";

dotenv.config({ path: '.env' });

const dbUser = process.env.DB_USER || process.env.CATAPULTUSER;
const dbPassword = process.env.DB_PASSWORD || process.env.CATAPULTPASSWORD;
const dbHost = process.env.DB_HOST || process.env.SERVER;
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || process.env.CATAPULTDATABASENAME;

if (!dbUser || !dbPassword || !dbHost || !dbName) {
    throw new Error('Missing required database environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME)');
}

const encodedDbPassword = encodeURIComponent(dbPassword);

const databaseUrl = `postgresql://${dbUser}:${encodedDbPassword}@${dbHost}:${dbPort}/${dbName}`;

const runMigrate = async () => {
  console.log('🚀 Starting database migration...');

  // Create migration connection (schema set via migrations scripts or URL parameters)
  const migrationConnection = postgres(databaseUrl, {
      max: 1,
  });
  
  const migrationDb = drizzle(migrationConnection, { schema });

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
