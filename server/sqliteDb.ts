import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';
import path from 'path';

// SQLite database file path
const dbPath = path.join(process.cwd(), 'sleekwheels.db');

// Create SQLite database connection
const sqlite = new Database(dbPath);

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

// Export for use in other files
export { sqlite };

console.log('🗄️ SQLite database connected:', dbPath);
