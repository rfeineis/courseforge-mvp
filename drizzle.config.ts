import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/db/schema.ts',
  out: './drizzle/migrations',
  dbCredentials: {
    url: './sqlite.db',
  },
  verbose: true,
  strict: true,
});
