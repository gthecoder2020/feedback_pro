import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import {
  insertFormSchema,
  insertQRCodeSchema,
  insertFeedbackSchema,
  insertLocationSchema,
  formFieldSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up auth routes: /api/register, /api/login, /api/logout, /api/business
  setupAuth(app);

  // Require authentication for API routes
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Location routes
  app.get("/api/locations", requireAuth, async (req, res) => {
    try {
      const locations = await storage.getLocationsByBusinessId(req.user.id);
      res.json(locations);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.post("/api/locations", requireAuth, async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse({
        ...req.body,
        businessId: req.user.id
      });
      const location = await storage.createLocation(locationData);
      res.status(201).json(location);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // Forms routes
  app.get("/api/forms", requireAuth, async (req, res) => {
    try {
      const forms = await storage.getFormsByBusinessId(req.user.id);
      res.json(forms);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.get("/api/forms/:id", requireAuth, async (req, res) => {
    try {
      const form = await storage.getForm(parseInt(req.params.id));
      if (!form || form.businessId !== req.user.id) {
        return res.status(404).json({ message: "Form not found" });
      }
      res.json(form);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.post("/api/forms", requireAuth, async (req, res) => {
    try {
      // Validate the fields array separately
      const fields = z.array(formFieldSchema).parse(req.body.fields);
      
      const formData = insertFormSchema.parse({
        ...req.body,
        businessId: req.user.id,
        fields
      });
      const form = await storage.createForm(formData);
      res.status(201).json(form);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.put("/api/forms/:id", requireAuth, async (req, res) => {
    try {
      const formId = parseInt(req.params.id);
      const existingForm = await storage.getForm(formId);
      
      if (!existingForm || existingForm.businessId !== req.user.id) {
        return res.status(404).json({ message: "Form not found" });
      }

      // Validate the fields array separately
      const fields = z.array(formFieldSchema).parse(req.body.fields);
      
      const formData = {
        ...req.body,
        id: formId,
        businessId: req.user.id,
        fields
      };
      
      const updatedForm = await storage.updateForm(formData);
      res.json(updatedForm);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // QR Code routes
  app.get("/api/qr-codes", requireAuth, async (req, res) => {
    try {
      const qrCodes = await storage.getQRCodesByBusinessId(req.user.id);
      res.json(qrCodes);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.post("/api/qr-codes", requireAuth, async (req, res) => {
    try {
      const qrCodeData = insertQRCodeSchema.parse({
        ...req.body,
        businessId: req.user.id
      });
      const qrCode = await storage.createQRCode(qrCodeData);
      res.status(201).json(qrCode);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // Feedback routes
  app.get("/api/feedback", requireAuth, async (req, res) => {
    try {
      const feedback = await storage.getFeedbackByBusinessId(req.user.id);
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // Public route to submit feedback
  app.post("/api/submit-feedback/:qrCodeId", async (req, res) => {
    try {
      const qrCodeId = parseInt(req.params.qrCodeId);
      const qrCode = await storage.getQRCode(qrCodeId);
      
      if (!qrCode) {
        return res.status(404).json({ message: "QR code not found" });
      }

      // Increment scan count regardless of submission
      await storage.incrementQRCodeScanCount(qrCodeId);
      
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        qrCodeId,
        formId: qrCode.formId,
        businessId: qrCode.businessId,
        locationId: qrCode.locationId
      });
      
      // Simple sentiment analysis
      const sentiment = analyzeSentiment(feedbackData.response, feedbackData.rating);
      
      const feedback = await storage.createFeedback({
        ...feedbackData,
        sentiment
      });
      
      res.status(201).json({ success: true, feedbackId: feedback.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // Analytics routes
  app.get("/api/analytics/overview", requireAuth, async (req, res) => {
    try {
      const businessId = req.user.id;
      const feedback = await storage.getFeedbackByBusinessId(businessId);
      const qrCodes = await storage.getQRCodesByBusinessId(businessId);
      
      // Calculate analytics
      const totalFeedback = feedback.length;
      
      // Calculate average rating
      const totalRating = feedback.reduce((sum, item) => {
        return sum + (item.rating || 0);
      }, 0);
      const avgRating = totalFeedback > 0 ? totalRating / totalFeedback : 0;
      
      // Calculate scan to response rate
      const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0);
      const responseRate = totalScans > 0 ? (totalFeedback / totalScans) * 100 : 0;
      
      // Calculate sentiment distribution
      const sentimentCounts = {
        Positive: feedback.filter(f => f.sentiment === 'Positive').length,
        Neutral: feedback.filter(f => f.sentiment === 'Neutral').length,
        Negative: feedback.filter(f => f.sentiment === 'Negative').length
      };
      
      const totalSentiment = sentimentCounts.Positive + sentimentCounts.Neutral + sentimentCounts.Negative;
      const sentimentScore = totalSentiment > 0 ? 
        Math.round((sentimentCounts.Positive * 100 + sentimentCounts.Neutral * 50) / totalSentiment) : 0;
      
      res.json({
        totalFeedback,
        avgRating,
        responseRate,
        sentimentScore,
        sentimentDistribution: {
          positive: totalSentiment > 0 ? (sentimentCounts.Positive / totalSentiment) * 100 : 0,
          neutral: totalSentiment > 0 ? (sentimentCounts.Neutral / totalSentiment) * 100 : 0,
          negative: totalSentiment > 0 ? (sentimentCounts.Negative / totalSentiment) * 100 : 0
        }
      });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simple sentiment analysis function based on rating and text
function analyzeSentiment(response: any, rating?: number): 'Positive' | 'Neutral' | 'Negative' {
  if (!rating) return 'Neutral';
  
  if (rating >= 4) return 'Positive';
  if (rating <= 2) return 'Negative';
  return 'Neutral';
}
