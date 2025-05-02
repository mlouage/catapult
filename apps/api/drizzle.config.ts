import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const dbUser = process.env.DB_USER || process.env.CATAPULTUSER;
const dbPassword = process.env.DB_PASSWORD || process.env.CATAPULTPASSWORD;
const dbHost = process.env.DB_HOST || process.env.SERVER;
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || process.env.CATAPULTDATABASENAME;
const dbSchema = process.env.DB_SCHEMA || 'catapult';

if (!dbUser || !dbPassword || !dbHost || !dbName) {
    throw new Error('Missing required database environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME)');
}

const encodedDbPassword = encodeURIComponent(dbPassword);

const databaseUrl = `postgresql://${dbUser}:${encodedDbPassword}@${dbHost}:${dbPort}/${dbName}?search_path=${dbSchema}`;

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
