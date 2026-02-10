import { db, sqlite } from './sqliteDb';
import { users, cars, contacts, sellRequests } from '@shared/schema';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export async function initializeSQLiteDatabase() {
  try {
    console.log('🔄 Initializing SQLite database...');

    // Run migrations if they exist
    try {
      await migrate(db, { migrationsFolder: './migrations' });
      console.log('✅ Database migrations applied');
    } catch (error) {
      console.log('ℹ️ No migrations found or migration failed, creating tables manually');
      // Create tables manually if migrations don't exist
      await createTablesManually();
    }

    // Check if we need to seed data
    const existingUsers = await db.select().from(users).limit(1);
    
    if (existingUsers.length === 0) {
      console.log('🌱 Seeding database with initial data...');
      
      // Create admin user
      await db.insert(users).values({
        username: 'admin',
        password: 'admin123', // In production, use hashed passwords!
        isAdmin: true,
      });

      // Create sample cars
      await db.insert(cars).values([
        {
          title: '2023 Mercedes-Benz S-Class',
          price: 125000,
          year: 2023,
          mileage: 15000,
          description: 'Luxury sedan with premium features and excellent condition.',
          images: JSON.stringify(['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800']),
          specs: JSON.stringify({
            engine: '3.0L V6 Twin-Turbo',
            transmission: 'Automatic',
            fuelType: 'Petrol',
            bodyType: 'Sedan',
            color: 'Metallic Silver',
          }),
        },
        {
          title: '2022 BMW X5 M',
          price: 95000,
          year: 2022,
          mileage: 22000,
          description: 'High-performance SUV with M package and sport handling.',
          images: JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800']),
          specs: JSON.stringify({
            engine: '4.4L V8 Twin-Turbo',
            transmission: 'Automatic',
            fuelType: 'Petrol',
            bodyType: 'SUV',
            color: 'Alpine White',
          }),
        },
        {
          title: '2021 Audi RS e-tron GT',
          price: 145000,
          year: 2021,
          mileage: 8000,
          description: 'Electric performance sedan with stunning design and incredible acceleration.',
          images: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800']),
          specs: JSON.stringify({
            engine: 'Dual Electric Motors',
            transmission: 'Automatic',
            fuelType: 'Electric',
            bodyType: 'Sedan',
            color: 'Daytona Gray',
          }),
        },
      ]);

      console.log('✅ Sample data inserted');
    } else {
      console.log('ℹ️ Database already has data, skipping seed');
    }

    console.log('🎉 SQLite database initialization complete!');
  } catch (error) {
    console.error('❌ SQLite database initialization failed:', error);
    throw error;
  }
}

async function createTablesManually() {
  try {
    // Create tables using raw SQL with better-sqlite3
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin INTEGER NOT NULL DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price INTEGER NOT NULL,
        year INTEGER NOT NULL,
        mileage INTEGER NOT NULL,
        description TEXT NOT NULL,
        images TEXT NOT NULL,
        specs TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS sell_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        car_details TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    console.log('✅ Tables created manually');
  } catch (error) {
    console.error('❌ Failed to create tables manually:', error);
    throw error;
  }
}
