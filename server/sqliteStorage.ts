import { eq } from 'drizzle-orm';
import { db } from './sqliteDb';
import {
  users,
  cars,
  contacts,
  sellRequests,
  type User,
  type InsertUser,
  type Car,
  type InsertCar,
  type Contact,
  type InsertContact,
  type SellRequest,
  type InsertSellRequest,
} from '@shared/schema';

export class SQLiteStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user from database');
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw new Error('Failed to get user by username from database');
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(user).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user in database');
    }
  }

  // Cars
  async getCars(): Promise<Car[]> {
    try {
      return await db.select().from(cars).orderBy(cars.id);
    } catch (error) {
      console.error('Error getting cars:', error);
      throw new Error('Failed to get cars from database');
    }
  }

  async getCar(id: number): Promise<Car | undefined> {
    try {
      const result = await db.select().from(cars).where(eq(cars.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting car:', error);
      throw new Error('Failed to get car from database');
    }
  }

  async createCar(car: InsertCar): Promise<Car> {
    try {
      console.log('🗄️ SQLite: Duke krijuar makinën me të dhëna:', car);
      
      const result = await db.insert(cars).values(car).returning();
      console.log('✅ SQLite: Makina u krijua me sukses:', result[0]);
      
      return result[0];
    } catch (error) {
      console.error('❌ SQLite: Gabim gjatë krijimit të makinës:', error);
      throw new Error(`Gabim gjatë krijimit të makinës në databazë: ${error instanceof Error ? error.message : 'Gabim i panjohur'}`);
    }
  }

  async updateCar(id: number, updates: Partial<InsertCar>): Promise<Car | undefined> {
    try {
      const result = await db.update(cars).set(updates).where(eq(cars.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating car:', error);
      throw new Error('Failed to update car in database');
    }
  }

  async deleteCar(id: number): Promise<boolean> {
    try {
      const result = await db.delete(cars).where(eq(cars.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting car:', error);
      throw new Error('Failed to delete car from database');
    }
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    try {
      console.log('👤 SQLite: Duke krijuar kontaktin me të dhëna:', contact);
      const result = await db.insert(contacts).values(contact).returning();
      console.log('✅ SQLite: Kontakti u krijua me sukses:', result[0]);
      return result[0];
    } catch (error) {
      console.error('❌ SQLite: Gabim gjatë krijimit të kontaktit:', error);
      throw new Error('Failed to create contact in database');
    }
  }

  async getContacts(): Promise<Contact[]> {
    try {
      return await db.select().from(contacts).orderBy(contacts.id);
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw new Error('Failed to get contacts from database');
    }
  }

  async deleteContact(id: number): Promise<boolean> {
    try {
      const result = await db.delete(contacts).where(eq(contacts.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw new Error('Failed to delete contact from database');
    }
  }

  // Sell Requests
  async createSellRequest(request: InsertSellRequest): Promise<SellRequest> {
    try {
      const result = await db.insert(sellRequests).values(request).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating sell request:', error);
      throw new Error('Failed to create sell request in database');
    }
  }

  async getSellRequests(): Promise<SellRequest[]> {
    try {
      return await db.select().from(sellRequests).orderBy(sellRequests.id);
    } catch (error) {
      console.error('Error getting sell requests:', error);
      throw new Error('Failed to get sell requests from database');
    }
  }

  async deleteSellRequest(id: number): Promise<boolean> {
    try {
      const result = await db.delete(sellRequests).where(eq(sellRequests.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting sell request:', error);
      throw new Error('Failed to delete sell request from database');
    }
  }
}
