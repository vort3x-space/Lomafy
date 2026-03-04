import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.SESSION_SECRET || "fallback_secret_for_dev_only";

interface JwtPayload {
  userId: number;
  role: string;
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = user as JwtPayload;
    next();
  });
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByEmail(input.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use", field: "email" });
      }
      
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
        role: "USER"
      });
      
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ user, token });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const validPassword = await bcrypt.compare(input.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.status(200).json({ user, token });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.auth.me.path, authenticateToken, async (req, res) => {
    const user = await storage.getUser(req.user!.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.status(200).json({ user });
  });

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post(api.categories.create.path, authenticateToken, requireAdmin, async (req, res) => {
    try {
      const input = api.categories.create.input.parse(req.body);
      const category = await storage.createCategory(input);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.errors[0].message });
      else res.status(500).json({ message: "Internal server error" });
    }
  });

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const { categoryId, search } = req.query;
    const authHeader = req.headers['authorization'];
    let producerId: number | undefined;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = await storage.getUser(payload.userId);
        if (user?.role === 'PRODUCER') {
          producerId = user.id;
        }
      } catch (e) {}
    }
    const products = await storage.getProducts(categoryId as string, search as string, producerId);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, authenticateToken, async (req, res) => {
    try {
      const bodySchema = api.products.create.input.extend({
        price: z.coerce.string(),
        stock: z.coerce.number(),
        categoryId: z.coerce.number().optional(),
      });
      const input = bodySchema.parse(req.body);
      const user = await storage.getUser(req.user!.userId);
      
      const product = await storage.createProduct({
        ...input,
        producerId: user?.role === 'PRODUCER' ? user.id : null
      });
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.errors[0].message });
      else res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.products.update.path, authenticateToken, requireAdmin, async (req, res) => {
    try {
      const bodySchema = api.products.update.input.extend({
        price: z.coerce.string().optional(),
        stock: z.coerce.number().optional(),
        categoryId: z.coerce.number().optional(),
      });
      const input = bodySchema.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.errors[0].message });
      else res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.products.delete.path, authenticateToken, requireAdmin, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      
      let totalAmount = 0;
      for (const item of input.items) {
        const product = await storage.getProduct(item.productId);
        if (!product) return res.status(400).json({ message: `Product ${item.productId} not found` });
        if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
        totalAmount += Number(product.price) * item.quantity;
      }
      
      let userId: number | undefined;
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
          userId = payload.userId;
        } catch (e) {
          // guest mode
        }
      }
      
      if (!userId && !input.guestEmail) {
        return res.status(400).json({ message: "Either login or provide guest email" });
      }

      const order = await storage.createOrder({
        userId: userId || null,
        guestEmail: input.guestEmail || null,
        shippingAddress: input.shippingAddress,
        totalAmount: totalAmount.toString(),
        status: 'PENDING'
      }, input.items);
      
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.errors[0].message });
      else res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.orders.list.path, authenticateToken, async (req, res) => {
    const user = req.user!;
    if (user.role === 'ADMIN') {
      const orders = await storage.getOrders();
      res.json(orders);
    } else {
      const orders = await storage.getOrders(user.userId);
      res.json(orders);
    }
  });

  app.patch(api.orders.updateStatus.path, authenticateToken, requireAdmin, async (req, res) => {
    try {
      const input = api.orders.updateStatus.input.parse(req.body);
      const order = await storage.updateOrderStatus(Number(req.params.id), input.status);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.errors[0].message });
      else res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard
  app.get(api.dashboard.stats.path, authenticateToken, requireAdmin, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });
  
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const admin = await storage.getUserByEmail("admin@lomafy.com");
  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await storage.createUser({
      name: "Admin",
      email: "admin@lomafy.com",
      password: hashedPassword,
      role: "ADMIN"
    });
    
    const cat1 = await storage.createCategory({ name: "Teknoloji", slug: "teknoloji" });
    const cat2 = await storage.createCategory({ name: "Moda", slug: "moda" });
    
    await storage.createProduct({
      name: "Lomafy Akıllı Saat",
      slug: "lomafy-akilli-saat",
      description: "Üreticiden doğrudan sizlere akıllı saat. Aracısız ticaretin gücü.",
      price: "1999.99",
      stock: 50,
      categoryId: cat1.id,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
      isActive: true
    });
    
    await storage.createProduct({
      name: "El İşçiliği Deri Çanta",
      slug: "el-isciligi-deri-canta",
      description: "Hakiki deri, tamamen el işçiliği ile üretilmiştir.",
      price: "3450.00",
      stock: 15,
      categoryId: cat2.id,
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
      isActive: true
    });
  }
}