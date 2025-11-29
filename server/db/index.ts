/**
 * Database Connection with Automatic Driver Switching
 * 
 * - Development: Uses SQLite (better-sqlite3)
 * - Production: Uses MySQL/TiDB (mysql2)
 * 
 * Controlled by NODE_ENV environment variable
 */

import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleMySQL } from 'drizzle-orm/mysql2';
import * as schema from './schema.js';

const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = process.env.DATABASE_URL;

let db: ReturnType<typeof drizzleSQLite> | ReturnType<typeof drizzleMySQL>;

if (NODE_ENV === 'production') {
  /**
   * PRODUCTION: MySQL/TiDB Driver
   */
  console.log('🔧 Database: Initializing MySQL connection for production...');

  if (!DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is required in production. Example: mysql://user:password@host:port/database'
    );
  }

  // Dynamic import to avoid bundling mysql2 in development
  const mysql = await import('mysql2/promise');

  const connection = await mysql.createPool({
    uri: DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  db = drizzleMySQL(connection, { schema, mode: 'default' });

  console.log('✅ Database: MySQL connection established');
} else {
  /**
   * DEVELOPMENT: SQLite Driver
   */
  console.log('🔧 Database: Initializing SQLite connection for development...');

  // Dynamic import to avoid bundling better-sqlite3 in production
  const Database = (await import('better-sqlite3')).default;

  const sqlite = new Database(DATABASE_URL || './sqlite.db');

  // Enable WAL mode for better concurrency
  sqlite.pragma('journal_mode = WAL');

  db = drizzleSQLite(sqlite, { schema });

  console.log('✅ Database: SQLite connection established');
}

// Export database instance
export { db };

// Export schema for type inference
export * from './schema.js';
