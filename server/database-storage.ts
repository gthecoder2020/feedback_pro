import { 
  Business, InsertBusiness, 
  Location, InsertLocation,
  Form, InsertForm,
  QRCode, InsertQRCode,
  Feedback, InsertFeedback,
  businesses, locations, forms, qrCodes, feedback
} from "@shared/schema";
import session from "express-session";
import { eq } from "drizzle-orm";
import { db } from "./db";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  
  async getBusiness(id: number): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business;
  }
  
  async getBusinessByEmail(email: string): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.email, email));
    return business;
  }
  
  async createBusiness(businessData: InsertBusiness): Promise<Business> {
    const [business] = await db.insert(businesses).values(businessData).returning();
    return business;
  }
  
  async getLocation(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }
  
  async getLocationsByBusinessId(businessId: number): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.businessId, businessId));
  }
  
  async createLocation(locationData: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(locationData).returning();
    return location;
  }
  
  async getForm(id: number): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.id, id));
    return form;
  }
  
  async getFormsByBusinessId(businessId: number): Promise<Form[]> {
    return await db.select().from(forms).where(eq(forms.businessId, businessId));
  }
  
  async createForm(formData: InsertForm): Promise<Form> {
    const [form] = await db.insert(forms).values(formData).returning();
    return form;
  }
  
  async updateForm(formData: Partial<Form> & { id: number }): Promise<Form> {
    const [form] = await db
      .update(forms)
      .set({ ...formData, updatedAt: new Date() })
      .where(eq(forms.id, formData.id))
      .returning();
    
    if (!form) {
      throw new Error(`Form with id ${formData.id} not found`);
    }
    
    return form;
  }
  
  async getQRCode(id: number): Promise<QRCode | undefined> {
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, id));
    return qrCode;
  }
  
  async getQRCodesByBusinessId(businessId: number): Promise<QRCode[]> {
    return await db.select().from(qrCodes).where(eq(qrCodes.businessId, businessId));
  }
  
  async createQRCode(qrCodeData: InsertQRCode): Promise<QRCode> {
    const [qrCode] = await db.insert(qrCodes).values(qrCodeData).returning();
    return qrCode;
  }
  
  async incrementQRCodeScanCount(id: number): Promise<void> {
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, id));
    
    if (qrCode) {
      await db
        .update(qrCodes)
        .set({ 
          scanCount: (qrCode.scanCount === null ? 1 : qrCode.scanCount + 1) 
        })
        .where(eq(qrCodes.id, id));
    }
  }
  
  async getFeedback(id: number): Promise<Feedback | undefined> {
    const [feedbackItem] = await db.select().from(feedback).where(eq(feedback.id, id));
    return feedbackItem;
  }
  
  async getFeedbackByBusinessId(businessId: number): Promise<Feedback[]> {
    return await db.select().from(feedback).where(eq(feedback.businessId, businessId));
  }
  
  async getFeedbackByQRCodeId(qrCodeId: number): Promise<Feedback[]> {
    return await db.select().from(feedback).where(eq(feedback.qrCodeId, qrCodeId));
  }
  
  async createFeedback(feedbackData: InsertFeedback & { sentiment?: string }): Promise<Feedback> {
    const [feedbackItem] = await db.insert(feedback).values({
      ...feedbackData,
      mediaUrls: feedbackData.mediaUrls || [],
      sentiment: feedbackData.sentiment || null
    }).returning();
    
    return feedbackItem;
  }
}