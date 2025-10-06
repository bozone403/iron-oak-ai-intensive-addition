import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse({
        ...req.body,
        ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
      });

      const lead = await storage.createLead(leadData);
      
      res.json({ 
        success: true, 
        message: "Your inquiry has been received.",
        leadId: lead.id 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ 
          success: false, 
          message: "An error occurred while processing your inquiry." 
        });
      }
    }
  });

  // Get all leads (admin)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json({ success: true, leads });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ 
        success: false, 
        message: "An error occurred while fetching leads." 
      });
    }
  });

  // Download leads as CSV
  app.get("/api/leads/download", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      
      // Create CSV
      const headers = ["ID", "Name", "Email", "Organization", "Objective", "Message", "Created At", "IP"];
      const rows = leads.map(lead => [
        lead.id,
        lead.name,
        lead.email,
        lead.organization,
        lead.objective,
        lead.message.replace(/"/g, '""'), // Escape quotes
        new Date(lead.createdAt).toISOString(),
        lead.ip || ""
      ]);

      const csv = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Error generating CSV:", error);
      res.status(500).json({ 
        success: false, 
        message: "An error occurred while generating the CSV." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
