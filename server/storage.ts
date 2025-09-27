import { users, contactInquiries, costCalculations, poolDesigns, poolDesignIntakes, poolIntakeFiles, type User, type InsertUser, type ContactInquiry, type InsertContactInquiry, type CostCalculation, type InsertCostCalculation, type PoolDesign, type InsertPoolDesign, type PoolDesignIntake, type InsertPoolDesignIntake, type PoolIntakeFile, type InsertPoolIntakeFile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  createCostCalculation(calculation: InsertCostCalculation): Promise<CostCalculation>;
  getCostCalculations(): Promise<CostCalculation[]>;
  createPoolDesign(design: InsertPoolDesign): Promise<PoolDesign>;
  getPoolDesigns(): Promise<PoolDesign[]>;
  // Pool Design Intake operations
  createPoolDesignIntake(intake: InsertPoolDesignIntake & { ticketNumber: string }): Promise<PoolDesignIntake>;
  getPoolDesignIntake(id: string): Promise<PoolDesignIntake | undefined>;
  getPoolDesignIntakes(): Promise<PoolDesignIntake[]>;
  // Pool Intake File operations
  createPoolIntakeFile(file: InsertPoolIntakeFile): Promise<PoolIntakeFile>;
  getPoolIntakeFiles(intakeId: string): Promise<PoolIntakeFile[]>;
  deletePoolIntakeFile(id: string): Promise<void>;
}

// Database storage implementation using Drizzle ORM - blueprint: javascript_database
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [inquiry] = await db
      .insert(contactInquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries);
  }

  async createCostCalculation(insertCalculation: InsertCostCalculation): Promise<CostCalculation> {
    const [calculation] = await db
      .insert(costCalculations)
      .values(insertCalculation)
      .returning();
    return calculation;
  }

  async getCostCalculations(): Promise<CostCalculation[]> {
    return await db.select().from(costCalculations);
  }

  async createPoolDesign(insertDesign: InsertPoolDesign): Promise<PoolDesign> {
    const [design] = await db
      .insert(poolDesigns)
      .values(insertDesign)
      .returning();
    return design;
  }

  async getPoolDesigns(): Promise<PoolDesign[]> {
    return await db.select().from(poolDesigns);
  }

  async createPoolDesignIntake(intake: InsertPoolDesignIntake & { ticketNumber: string }): Promise<PoolDesignIntake> {
    const [intakeRecord] = await db
      .insert(poolDesignIntakes)
      .values(intake)
      .returning();
    return intakeRecord;
  }

  async getPoolDesignIntake(id: string): Promise<PoolDesignIntake | undefined> {
    const [intake] = await db.select().from(poolDesignIntakes).where(eq(poolDesignIntakes.id, id));
    return intake || undefined;
  }

  async getPoolDesignIntakes(): Promise<PoolDesignIntake[]> {
    return await db.select().from(poolDesignIntakes);
  }

  async createPoolIntakeFile(file: InsertPoolIntakeFile): Promise<PoolIntakeFile> {
    const [fileRecord] = await db
      .insert(poolIntakeFiles)
      .values(file)
      .returning();
    return fileRecord;
  }

  async getPoolIntakeFiles(intakeId: string): Promise<PoolIntakeFile[]> {
    return await db.select().from(poolIntakeFiles).where(eq(poolIntakeFiles.intakeId, intakeId));
  }

  async deletePoolIntakeFile(id: string): Promise<void> {
    await db.delete(poolIntakeFiles).where(eq(poolIntakeFiles.id, id));
  }
}

export const storage = new DatabaseStorage();