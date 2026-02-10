import {
  type User,
  type InsertUser,
  type Car,
  type InsertCar,
  type Contact,
  type InsertContact,
  type SellRequest,
  type InsertSellRequest,
} from "@shared/schema";
import { SQLiteStorage } from "./sqliteStorage";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Cars
  getCars(): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  deleteContact(id: number): Promise<boolean>;
  
  // Sell Requests
  createSellRequest(request: InsertSellRequest): Promise<SellRequest>;
  getSellRequests(): Promise<SellRequest[]>;
  deleteSellRequest(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cars: Map<number, Car>;
  private contacts: Map<number, Contact>;
  private sellRequests: Map<number, SellRequest>;
  private currentIds: {
    users: number;
    cars: number;
    contacts: number;
    sellRequests: number;
  };

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.contacts = new Map();
    this.sellRequests = new Map();
    this.currentIds = {
      users: 1,
      cars: 1,
      contacts: 1,
      sellRequests: 1,
    };
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id, isAdmin: insertUser.isAdmin ?? false };
    this.users.set(id, user);
    return user;
  }

  // Cars
  async getCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = this.currentIds.cars++;
    const car: Car = { ...insertCar, id };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: number, updates: Partial<InsertCar>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;
    
    const updatedCar = { ...car, ...updates };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: number): Promise<boolean> {
    return this.cars.delete(id);
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentIds.contacts++;
    const contact: Contact = { ...insertContact, id };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Sell Requests
  async createSellRequest(insertRequest: InsertSellRequest): Promise<SellRequest> {
    const id = this.currentIds.sellRequests++;
    const request: SellRequest = { ...insertRequest, id };
    this.sellRequests.set(id, request);
    return request;
  }

  async getSellRequests(): Promise<SellRequest[]> {
    return Array.from(this.sellRequests.values());
  }

  async deleteSellRequest(id: number): Promise<boolean> {
    return this.sellRequests.delete(id);
  }
}

export const storage = new MemStorage();

// Function to get the appropriate storage based on environment
export function getStorage() {
  // Use SQLite by default for testing, fallback to in-memory if needed
  console.log('🗄️ Using SQLite database (perfect for testing!)');
  try {
    return new SQLiteStorage();
  } catch (error) {
    console.error('❌ Failed to create SQLite storage, falling back to in-memory:', error);
    return storage;
  }
}
