import { 
  Business, InsertBusiness, 
  Location, InsertLocation,
  Form, InsertForm,
  QRCode, InsertQRCode,
  Feedback, InsertFeedback
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // Business operations
  getBusiness(id: number): Promise<Business | undefined>;
  getBusinessByEmail(email: string): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  
  // Location operations
  getLocation(id: number): Promise<Location | undefined>;
  getLocationsByBusinessId(businessId: number): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Form operations
  getForm(id: number): Promise<Form | undefined>;
  getFormsByBusinessId(businessId: number): Promise<Form[]>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(form: Partial<Form> & { id: number }): Promise<Form>;
  
  // QR Code operations
  getQRCode(id: number): Promise<QRCode | undefined>;
  getQRCodesByBusinessId(businessId: number): Promise<QRCode[]>;
  createQRCode(qrCode: InsertQRCode): Promise<QRCode>;
  incrementQRCodeScanCount(id: number): Promise<void>;
  
  // Feedback operations
  getFeedback(id: number): Promise<Feedback | undefined>;
  getFeedbackByBusinessId(businessId: number): Promise<Feedback[]>;
  getFeedbackByQRCodeId(qrCodeId: number): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback & { sentiment?: string }): Promise<Feedback>;
}

export class MemStorage implements IStorage {
  private businesses: Map<number, Business>;
  private locations: Map<number, Location>;
  private forms: Map<number, Form>;
  private qrCodes: Map<number, QRCode>;
  private feedbacks: Map<number, Feedback>;
  sessionStore: session.Store;
  
  // Counter for auto-incrementing IDs
  private businessIdCounter: number;
  private locationIdCounter: number;
  private formIdCounter: number;
  private qrCodeIdCounter: number;
  private feedbackIdCounter: number;

  constructor() {
    this.businesses = new Map();
    this.locations = new Map();
    this.forms = new Map();
    this.qrCodes = new Map();
    this.feedbacks = new Map();
    
    this.businessIdCounter = 1;
    this.locationIdCounter = 1;
    this.formIdCounter = 1;
    this.qrCodeIdCounter = 1;
    this.feedbackIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
  }

  // Business operations
  async getBusiness(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async getBusinessByEmail(email: string): Promise<Business | undefined> {
    return Array.from(this.businesses.values()).find(
      (business) => business.email === email
    );
  }

  async createBusiness(businessData: InsertBusiness): Promise<Business> {
    const id = this.businessIdCounter++;
    const createdAt = new Date();
    const business: Business = { ...businessData, id, createdAt };
    this.businesses.set(id, business);
    return business;
  }

  // Location operations
  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getLocationsByBusinessId(businessId: number): Promise<Location[]> {
    return Array.from(this.locations.values()).filter(
      (location) => location.businessId === businessId
    );
  }

  async createLocation(locationData: InsertLocation): Promise<Location> {
    const id = this.locationIdCounter++;
    const createdAt = new Date();
    const location: Location = { ...locationData, id, createdAt };
    this.locations.set(id, location);
    return location;
  }

  // Form operations
  async getForm(id: number): Promise<Form | undefined> {
    return this.forms.get(id);
  }

  async getFormsByBusinessId(businessId: number): Promise<Form[]> {
    return Array.from(this.forms.values()).filter(
      (form) => form.businessId === businessId
    );
  }

  async createForm(formData: InsertForm): Promise<Form> {
    const id = this.formIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const form: Form = { ...formData, id, createdAt, updatedAt };
    this.forms.set(id, form);
    return form;
  }

  async updateForm(formData: Partial<Form> & { id: number }): Promise<Form> {
    const existingForm = this.forms.get(formData.id);
    if (!existingForm) {
      throw new Error(`Form with ID ${formData.id} not found`);
    }
    
    const updatedForm: Form = {
      ...existingForm,
      ...formData,
      updatedAt: new Date()
    };
    
    this.forms.set(formData.id, updatedForm);
    return updatedForm;
  }

  // QR Code operations
  async getQRCode(id: number): Promise<QRCode | undefined> {
    return this.qrCodes.get(id);
  }

  async getQRCodesByBusinessId(businessId: number): Promise<QRCode[]> {
    return Array.from(this.qrCodes.values()).filter(
      (qrCode) => qrCode.businessId === businessId
    );
  }

  async createQRCode(qrCodeData: InsertQRCode): Promise<QRCode> {
    const id = this.qrCodeIdCounter++;
    const createdAt = new Date();
    const qrCode: QRCode = { ...qrCodeData, id, scanCount: 0, createdAt };
    this.qrCodes.set(id, qrCode);
    return qrCode;
  }

  async incrementQRCodeScanCount(id: number): Promise<void> {
    const qrCode = this.qrCodes.get(id);
    if (qrCode) {
      qrCode.scanCount += 1;
      this.qrCodes.set(id, qrCode);
    }
  }

  // Feedback operations
  async getFeedback(id: number): Promise<Feedback | undefined> {
    return this.feedbacks.get(id);
  }

  async getFeedbackByBusinessId(businessId: number): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(
      (feedback) => feedback.businessId === businessId
    );
  }

  async getFeedbackByQRCodeId(qrCodeId: number): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(
      (feedback) => feedback.qrCodeId === qrCodeId
    );
  }

  async createFeedback(feedbackData: InsertFeedback & { sentiment?: string }): Promise<Feedback> {
    const id = this.feedbackIdCounter++;
    const createdAt = new Date();
    const sentiment = feedbackData.sentiment || 'Neutral';
    const feedback: Feedback = { 
      ...feedbackData, 
      id, 
      sentiment, 
      createdAt,
      mediaUrls: feedbackData.mediaUrls || []
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }
}

export const storage = new MemStorage();
