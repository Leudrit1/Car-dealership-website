import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
});

export const cars = sqliteTable("cars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  description: text("description").notNull(),
  images: text("images").notNull(), // SQLite doesn't support arrays, store as JSON string
  specs: text("specs").notNull(), // Store JSON as text
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

export const sellRequests = sqliteTable("sell_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  carDetails: text("car_details").notNull(), // Store JSON as text
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertCarSchema = createInsertSchema(cars);
export const insertContactSchema = createInsertSchema(contacts);
export const insertSellRequestSchema = createInsertSchema(sellRequests);

export type User = typeof users.$inferSelect;
export type Car = typeof cars.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type SellRequest = typeof sellRequests.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCar = z.infer<typeof insertCarSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertSellRequest = z.infer<typeof insertSellRequestSchema>;
