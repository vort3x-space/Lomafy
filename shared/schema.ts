import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default('USER'), // 'ADMIN', 'USER', 'PRODUCER'
  brandName: text("brand_name"),
  isApproved: boolean("is_approved").default(true), // Users are approved by default, producers need approval
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id),
  producerId: integer("producer_id").references(() => users.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // null for guest
  guestEmail: text("guest_email"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default('PENDING'), // PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
  shippingAddress: text("shipping_address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});

// Relations
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  producer: one(users, {
    fields: [products.producerId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Auth types
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
