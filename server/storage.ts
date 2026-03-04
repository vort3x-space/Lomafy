import { db } from "./db";
import {
  users, categories, products, orders, orderItems,
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  getApprovedProducers(): Promise<User[]>;
  updateUserStatus(id: number, isApproved: boolean): Promise<User | undefined>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getProducts(categoryId?: string, search?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  
  // Orders
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder, items: {productId: number, quantity: number}[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Dashboard
  getDashboardStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const isApproved = insertUser.role !== 'PRODUCER';
    const [user] = await db.insert(users).values({ ...insertUser, isApproved }).returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getApprovedProducers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'PRODUCER')).where(eq(users.isApproved, true));
  }

  async updateUserStatus(id: number, isApproved: boolean): Promise<User | undefined> {
    const [user] = await db.update(users).set({ isApproved }).where(eq(users.id, id)).returning();
    return user;
  }
  
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [cat] = await db.insert(categories).values(category).returning();
    return cat;
  }
  
  // Products
  async getProducts(categoryId?: string, search?: string, producerId?: number): Promise<Product[]> {
    const allProducts = await db.select().from(products);
    let filtered = allProducts;
    
    if (producerId) {
      filtered = filtered.filter(p => p.producerId === producerId);
    }
    
    if (categoryId) {
      filtered = filtered.filter(p => p.categoryId === parseInt(categoryId));
    }
    
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    
    return filtered;
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [prod] = await db.insert(products).values(product).returning();
    return prod;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }
  
  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
  
  // Orders
  async getOrders(userId?: number): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async createOrder(order: InsertOrder, items: {productId: number, quantity: number}[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        await db.insert(orderItems).values({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
        
        await this.updateProduct(item.productId, { stock: product.stock - item.quantity });
      }
    }
    
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }
  
  // Dashboard
  async getDashboardStats(): Promise<any> {
    const allOrders = await db.select().from(orders);
    const allProducts = await db.select().from(products);
    
    const totalRevenue = allOrders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);
      
    const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);
    
    return {
      totalRevenue,
      totalOrders: allOrders.length,
      totalProducts: allProducts.length,
      recentOrders
    };
  }
}

export const storage = new DatabaseStorage();