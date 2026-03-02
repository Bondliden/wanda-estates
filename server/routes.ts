import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from 'nodemailer';
import { storage } from "./storage";
import { setupChatbotRoutes } from "./chatbot";
import { insertContactInquirySchema } from "@shared/schema";
import { z } from "zod";

import { fetchProperties, fetchPropertyDetails } from "./resales";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Properties search endpoint
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = req.query; // Allow passing overriding filters
      const properties = await fetchProperties(filters);
      res.json({ success: true, data: properties });
    } catch (error) {
      console.error("Error exposing properties:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching properties"
      });
    }
  });

  // Individual property details endpoint
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const details = await fetchPropertyDetails(id);
      res.json({ success: true, data: details });
    } catch (error) {
      console.error(`Error fetching property details for ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Error fetching property details"
      });
    }
  });

  // Geo Location endpoint for IP segmentation strategy
  app.get("/api/geo", async (req, res) => {
    try {
      // Get optimal user IP considering proxy setups like Railway
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
      if (typeof ip === 'string') {
        ip = ip.split(',')[0].trim();
      }

      // For local development, this will be ::1 or 127.0.0.1, preventing geo lookup
      // So if missing or local, we can use empty string which will make ip-api use our server's IP (Spain) or mock a country.
      if (ip === '::1' || ip === '127.0.0.1') {
        ip = ''; // Fallback for local testing (can mock here if needed)
      }

      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      res.json({ success: true, countryCode: data.countryCode || 'ES' });
    } catch (error) {
      console.error("Error fetching geo location:", error);
      res.status(500).json({ success: false, countryCode: 'ES' }); // Fallback to Spain
    }
  });

  // Configure Nodemailer Transport
  // This uses standard SMTP setup, relying on env variables in Railway
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // fallback example
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Contact inquiry endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);

      // Store in database
      const inquiry = await storage.createContactInquiry(validatedData);

      // Send Email Notification
      const mailOptions = {
        from: process.env.SMTP_FROM || '"Wanda Estates" <no-reply@wandaestates.com>',
        to: 'info@wandaestates.com',
        subject: `Nuevo mensaje de contacto: ${validatedData.name}`,
        text: `Has recibido un nuevo mensaje de contacto:\n\nNombre: ${validatedData.name}\nEmail: ${validatedData.email}\nTeléfono: ${validatedData.phone || 'No proporcionado'}\nMensaje:\n${validatedData.message}\n\nIdioma preferido: ${req.body.language || 'es'}`,
        html: `
          <h3>Nuevo mensaje de contacto - Wanda Estates</h3>
          <p><strong>Nombre:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
          <p><strong>Teléfono:</strong> ${validatedData.phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Mensaje:</strong></p>
          <p>${validatedData.message?.replace(/\n/g, '<br/>') || 'No se adjuntó mensaje adjunto.'}</p>
          <br/>
          <p><small>Este correo fue generado automáticamente desde la web.</small></p>
        `
      };

      // We wrap the sendMail process in a try-catch to not crash if SMTP is not properly configured locally
      try {
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
          await transporter.sendMail(mailOptions);
          console.log("Email Notification Sent to info@wandaestates.com");
        } else {
          console.log("SMTP not configured. Skipping email sending. Mail options:", mailOptions);
        }
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
        // Let the flow continue even if email fails, UI will show success based on DB save.
      }

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

  // Guide Download Endpoint
  app.post("/api/guide", async (req, res) => {
    try {
      const { name, email, phone } = req.body;

      if (!name || !email) {
        return res.status(400).json({ success: false, message: "Name and email are required" });
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || '"Wanda Estates" <no-reply@wandaestates.com>',
        to: 'info@wandaestates.com',
        subject: `¡Nuevo Lead para Guía de Inversión! - ${name}`,
        text: `Alguien ha solicitado la Guía de Inversión Marbella 2025:\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || 'No proporcionado'}`,
        html: `
              <h3>Nuevo Lead - Guía de Inversión 2025</h3>
              <p>Un usuario acaba de descargarse la guía:</p>
              <ul>
                <li><strong>Nombre:</strong> ${name}</li>
                <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
                <li><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</li>
              </ul>
              <br/>
              <p><small>Formulario Lead Magnet - wandaestates.com</small></p>
            `
      };

      try {
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
          await transporter.sendMail(mailOptions);
        } else {
          console.log("SMTP not configured. Skipping email sending. Action: Guide Download. Payload:", mailOptions);
        }
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
      }

      res.json({
        success: true,
        message: "Lead processed. Initiating download.",
        downloadUrl: "/guide/wanda-estates-guia-inversion-2025.pdf" // Placeholder URL for actual file
      });

    } catch (error) {
      console.error("Error processing guide download:", error);
      res.status(500).json({ success: false, message: "Error processing the request." });
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
