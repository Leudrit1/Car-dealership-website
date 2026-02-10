import type { Express, Request, Response } from "express";
import { createServer } from "http";
import { getStorage } from "./storage";
import { insertCarSchema, insertContactSchema, insertSellRequestSchema } from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);
  const storage = getStorage();

  // Auth routes
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;
    res.json({ user });
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user });
  });

  // Cars routes
  app.get("/api/cars", async (_req, res) => {
    const cars = await storage.getCars();
    res.json(cars);
  });

  app.get("/api/cars/:id", async (req, res) => {
    const car = await storage.getCar(Number(req.params.id));
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  });

  // Protected routes middleware
  const requireAdmin = async (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  };

  app.post("/api/cars", requireAdmin, async (req, res) => {
    try {
      const car = insertCarSchema.parse(req.body);
      const created = await storage.createCar(car);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Të dhënat e makinës janë të pavlefshme", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Gabim i brendshëm i serverit", 
        error: error instanceof Error ? error.message : 'Gabim i panjohur'
      });
    }
  });

  app.patch("/api/cars/:id", requireAdmin, async (req, res) => {
    try {
      const updates = insertCarSchema.partial().parse(req.body);
      const updated = await storage.updateCar(Number(req.params.id), updates);
      if (!updated) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid car data", errors: error.errors });
      }
      throw error;
    }
  });

  app.delete("/api/cars/:id", requireAdmin, async (req, res) => {
    const deleted = await storage.deleteCar(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(204).end();
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const contact = insertContactSchema.parse({
        ...req.body,
        createdAt: new Date().toISOString(),
      });
      const created = await storage.createContact(contact);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      throw error;
    }
  });

  // Sell request form
  app.post("/api/sell", async (req, res) => {
    try {
      const sellRequest = insertSellRequestSchema.parse({
        ...req.body,
        createdAt: new Date().toISOString(),
      });
      const created = await storage.createSellRequest(sellRequest);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sell request data", errors: error.errors });
      }
      throw error;
    }
  });

  // Admin routes for viewing submissions
  app.get("/api/admin/contacts", requireAdmin, async (_req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contact = insertContactSchema.parse({
        ...req.body,
        createdAt: new Date().toISOString(),
      });
      const created = await storage.createContact(contact);
      res.status(201).json(created);
    } catch (error) {
      console.error('❌ Server: Gabim gjatë krijimit të kontaktit:', error);
      
      if (error instanceof z.ZodError) {
        console.error('❌ Server: Gabime validimi:', error.errors);
        return res.status(400).json({ 
          message: "Të dhënat e kontaktit janë të pavlefshme", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Gabim i brendshëm i serverit", 
        error: error instanceof Error ? error.message : 'Gabim i panjohur'
      });
    }
  });

  app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteContact(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(204).end();
    } catch (error) {
      console.error('❌ Server: Gabim gjatë fshirjes së kontaktit:', error);
      res.status(500).json({ 
        message: "Gabim i brendshëm i serverit", 
        error: error instanceof Error ? error.message : 'Gabim i panjohur'
      });
    }
  });

  app.get("/api/admin/sell-requests", requireAdmin, async (_req, res) => {
    const requests = await storage.getSellRequests();
    res.json(requests);
  });

  app.delete("/api/admin/sell-requests/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteSellRequest(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Sell request not found" });
      }
      res.status(204).end();
    } catch (error) {
      console.error('❌ Server: Gabim gjatë fshirjes së kërkesës së shitjes:', error);
      res.status(500).json({ 
        message: "Gabim i brendshëm i serverit", 
        error: error instanceof Error ? error.message : 'Gabim i panjohur'
      });
    }
  });

  return httpServer;
}
