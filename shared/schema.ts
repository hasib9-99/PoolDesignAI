import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  details: text("details"),
  budget: text("budget"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const costCalculations = pgTable("cost_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  size: text("size").notNull(),
  type: text("type").notNull(),
  material: text("material").notNull(),
  features: text("features"), // JSON string
  location: text("location"),
  timeline: text("timeline"),
  estimatedCost: integer("estimated_cost"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const poolDesigns = pgTable("pool_designs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poolShape: text("pool_shape").notNull(),
  poolSize: text("pool_size").notNull(),
  style: text("style").notNull(),
  features: text("features"), // JSON string array
  imageUrl: text("image_url").notNull(),
  estimatedCost: integer("estimated_cost"),
  timeline: text("timeline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const poolDesignIntakes = pgTable("pool_design_intakes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketNumber: text("ticket_number").notNull().unique(),
  // Contact Information
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  // Property Information
  projectAddress: text("project_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  county: text("county").notNull(),
  // HOA Information
  hasHOA: boolean("has_hoa").notNull(),
  hoaGuidelines: text("hoa_guidelines"), // JSON string for HOA details
  // Pool Design Specifications
  poolLength: integer("pool_length").notNull(),
  poolWidth: integer("pool_width").notNull(),
  shallowDepth: real("shallow_depth").notNull(),
  deepDepth: real("deep_depth").notNull(),
  deckMaterial: text("deck_material").notNull(),
  deckSquareFootage: integer("deck_square_footage").notNull(),
  // Features (stored as JSON)
  waterFeatures: text("water_features"), // JSON array
  fireFeatures: text("fire_features"), // JSON array  
  structures: text("structures"), // JSON array
  // Spa Information
  hasSpa: boolean("has_spa").notNull(),
  spaSize: text("spa_size"),
  spaSpillover: boolean("spa_spillover"),
  // Equipment Preferences
  equipmentBrand: text("equipment_brand"),
  desiredEquipment: text("desired_equipment"), // JSON array
  // Safety Features
  safetyFeatures: text("safety_features"), // JSON array
  // Project Details
  budgetRange: text("budget_range").notNull(),
  targetStartDate: timestamp("target_start_date"),
  specialRequests: text("special_requests"),
  sketchNotes: text("sketch_notes"),
  // Consent and Legal
  consentGiven: boolean("consent_given").notNull(),
  // Metadata
  sourceIP: text("source_ip"),
  userAgent: text("user_agent"),
  submissionData: json("submission_data"), // Full form data backup
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const poolIntakeFiles = pgTable("pool_intake_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  intakeId: varchar("intake_id").notNull().references(() => poolDesignIntakes.id, { onDelete: "cascade" }),
  fileType: text("file_type").notNull(), // 'survey', 'photo', 'hoa_doc', 'sketch', 'other'
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  bucketKey: text("bucket_key"), // For cloud storage
  publicUrl: text("public_url"),
  description: text("description"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});


export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
});

export const insertCostCalculationSchema = createInsertSchema(costCalculations).omit({
  id: true,
  createdAt: true,
});

export const insertPoolDesignSchema = createInsertSchema(poolDesigns).omit({
  id: true,
  createdAt: true,
});

export const insertPoolDesignIntakeSchema = createInsertSchema(poolDesignIntakes).omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPoolIntakeFileSchema = createInsertSchema(poolIntakeFiles).omit({
  id: true,
  uploadedAt: true,
});


export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertCostCalculation = z.infer<typeof insertCostCalculationSchema>;
export type CostCalculation = typeof costCalculations.$inferSelect;
export type InsertPoolDesign = z.infer<typeof insertPoolDesignSchema>;
export type PoolDesign = typeof poolDesigns.$inferSelect;
export type InsertPoolDesignIntake = z.infer<typeof insertPoolDesignIntakeSchema>;
export type PoolDesignIntake = typeof poolDesignIntakes.$inferSelect;
export type InsertPoolIntakeFile = z.infer<typeof insertPoolIntakeFileSchema>;
export type PoolIntakeFile = typeof poolIntakeFiles.$inferSelect;

// AI Pool Design Types with Zod Validation
export const poolSpecsSchema = z.object({
  style: z.string(),
  features: z.array(z.string()),
  approxLengthFt: z.number().positive(),
  childFriendly: z.boolean(),
  raw: z.string(),
});

export const costEstimateLineItemsSchema = z.object({
  base: z.number(),
  featuresCost: z.number(),
  sizeFactor: z.number(),
  design: z.number(),
  permits: z.number(),
  contingency: z.number(),
});

export const costEstimateSchema = z.object({
  lineItems: costEstimateLineItemsSchema,
  totalLow: z.number(),
  totalHigh: z.number(),
  timelineWeeks: z.number(),
});

export const constructionPhaseSchema = z.object({
  phase: z.string(),
  duration: z.string(),
  tasks: z.array(z.string()),
  requirements: z.array(z.string()),
});

export const materialCategorySchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
  estimated_cost: z.string(),
});

export const constructionPlanSchema = z.object({
  phases: z.array(constructionPhaseSchema),
  materials: z.array(materialCategorySchema),
  permits: z.array(z.string()),
  timeline: z.string(),
});

// AI Design Process Request and Response schemas
export const aiDesignProcessRequestSchema = z.object({
  transcript: z.string().min(1, "Transcript cannot be empty"),
});

export const aiDesignProcessResponseSchema = z.object({
  specs: poolSpecsSchema,
  estimate: costEstimateSchema,
  plan: constructionPlanSchema,
  imageUrl: z.string().url(),
});

// Export types for TypeScript
export type PoolSpecs = z.infer<typeof poolSpecsSchema>;
export type CostEstimate = z.infer<typeof costEstimateSchema>;
export type CostEstimateLineItems = z.infer<typeof costEstimateLineItemsSchema>;
export type ConstructionPlan = z.infer<typeof constructionPlanSchema>;
export type ConstructionPhase = z.infer<typeof constructionPhaseSchema>;
export type MaterialCategory = z.infer<typeof materialCategorySchema>;
export type AIDesignProcessRequest = z.infer<typeof aiDesignProcessRequestSchema>;
export type AIDesignProcessResponse = z.infer<typeof aiDesignProcessResponseSchema>;

// Email request schema for SendGrid integration
export const sendEmailRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  details: z.string().optional(),
  budget: z.string().optional(),
  // AI design data
  isFromAI: z.boolean().optional(),
  poolStyle: z.string().optional(),
  poolLength: z.string().optional(),
  features: z.string().optional(),
});

export type SendEmailRequest = z.infer<typeof sendEmailRequestSchema>;
