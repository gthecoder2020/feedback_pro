import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Business Schema
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  subscriptionPlan: text("subscription_plan").default("Free"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertBusinessSchema = createInsertSchema(businesses)
  .omit({ id: true, createdAt: true });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

// Business Location Schema
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  name: text("name").notNull(),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertLocationSchema = createInsertSchema(locations)
  .omit({ id: true, createdAt: true });

// Feedback Form Schema
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  fields: jsonb("fields").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertFormSchema = createInsertSchema(forms)
  .omit({ id: true, createdAt: true, updatedAt: true });

// QR Code Schema
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  formId: integer("form_id").notNull(),
  locationId: integer("location_id"),
  name: text("name").notNull(),
  scanCount: integer("scan_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertQRCodeSchema = createInsertSchema(qrCodes)
  .omit({ id: true, scanCount: true, createdAt: true });

// Feedback Submission Schema
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").notNull(),
  formId: integer("form_id").notNull(),
  businessId: integer("business_id").notNull(),
  locationId: integer("location_id"),
  response: jsonb("response").notNull(),
  rating: integer("rating"),
  sentiment: text("sentiment"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  mediaUrls: text("media_urls").array(),
  isAnonymous: boolean("is_anonymous").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertFeedbackSchema = createInsertSchema(feedback)
  .omit({ id: true, sentiment: true, createdAt: true });

// Form Field Types
export const formFieldTypes = [
  "shortText",
  "longText",
  "starRating",
  "scaleRating",
  "multipleChoice",
  "imageUpload",
  "videoUpload",
  "contactInfo",
  "submitButton"
] as const;

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(formFieldTypes),
  label: z.string(),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional()
});

// Types
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Form = typeof forms.$inferSelect;
export type InsertForm = z.infer<typeof insertFormSchema>;
export type FormField = z.infer<typeof formFieldSchema>;

export type QRCode = typeof qrCodes.$inferSelect;
export type InsertQRCode = z.infer<typeof insertQRCodeSchema>;

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
