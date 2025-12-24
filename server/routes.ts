import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupChatbotRoutes } from "./chatbot";
import { insertContactInquirySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Contact inquiry endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Contact inquiry submitted successfully",
        id: inquiry.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid request data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating contact inquiry:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get all contact inquiries (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const inquiries = await storage.getAllContactInquiries();
      res.json({ success: true, data: inquiries });
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Setup chatbot routes
  setupChatbotRoutes(app);
  
  return httpServer;
}
