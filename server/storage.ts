import { type User, type InsertUser, type Lead, type InsertLead } from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  getLeadById(id: string): Promise<Lead | undefined>;
  
  // AI Intensive methods
  saveAILead(lead: AILead): Promise<void>;
  getAILeadById(id: string): Promise<AILead | undefined>;
  getAILeadByPhone(phone: string): Promise<AILead | undefined>;
  getAILeadByCallSid(callSid: string): Promise<AILead | undefined>;
  updateAILead(id: string, updates: Partial<AILead>): Promise<void>;
  trySetSmsSending(id: string, outcome: 'completed_offer' | 'missed_offer'): Promise<boolean>;
  getAllAILeads(): Promise<AILead[]>;
  deleteAILead(id: string): Promise<boolean>;
}

export interface AILead {
  id: string;
  firstName: string;
  phone: string; // E.164 format
  email: string | null;
  consentGiven: boolean;
  consentTimestamp: string;
  ipAddress: string | null;
  userAgent: string | null;
  callStatus: string;
  callSid: string | null;
  callDuration: number | null;
  smsStatus: 'pending' | 'sending' | 'sent' | 'failed';
  smsOutcome: null | 'completed_offer' | 'missed_offer';
  smsSid: string | null;
  smsSentAt: string | null;
  paymentStatus: string;
  amountPaid: number | null;
  paidAt: string | null;
  optedOut: boolean;
  optedOutAt: string | null;
  scheduledDate: string | null;
  scheduledNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH ?? process.env.RENDER_DISK_PATH ?? path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const AI_LEADS_FILE = path.join(DATA_DIR, "ai-intensive-leads.json");

// ===================================================================
// FILE LOCK FOR ATOMIC OPERATIONS
// ===================================================================

class FileLock {
  private locks: Map<string, Promise<void>> = new Map();

  async acquire<T>(key: string, fn: () => Promise<T>): Promise<T> {
    while (this.locks.has(key)) {
      await this.locks.get(key);
    }

    let release: () => void;
    const lock = new Promise<void>((resolve) => {
      release = resolve;
    });

    this.locks.set(key, lock);

    try {
      return await fn();
    } finally {
      this.locks.delete(key);
      release!();
    }
  }
}

const fileLock = new FileLock();

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function readLeadsFile(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeLeadsFile(leads: Lead[]): Promise<void> {
  await ensureDataDir();
  
  // Atomic write: write to temp file, then rename
  const tempFile = `${LEADS_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(leads, null, 2), "utf-8");
  await fs.rename(tempFile, LEADS_FILE);
}

async function readAILeadsFile(): Promise<AILead[]> {
  try {
    const data = await fs.readFile(AI_LEADS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeAILeadsFile(leads: AILead[]): Promise<void> {
  await ensureDataDir();
  
  // Atomic write: write to temp file, then rename
  const tempFile = `${AI_LEADS_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(leads, null, 2), "utf-8");
  await fs.rename(tempFile, AI_LEADS_FILE);
}

// ===================================================================
// STORAGE IMPLEMENTATION
// ===================================================================

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    return fileLock.acquire('leads', async () => {
      const leads = await readLeadsFile();
      const lead: Lead = {
        id: randomUUID(),
        ...insertLead,
        ip: insertLead.ip || null,
        createdAt: new Date(),
      };
      leads.push(lead);
      await writeLeadsFile(leads);
      return lead;
    });
  }

  async getAllLeads(): Promise<Lead[]> {
    return readLeadsFile();
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    const leads = await readLeadsFile();
    return leads.find((lead) => lead.id === id);
  }

  // ===================================================================
  // AI INTENSIVE METHODS
  // ===================================================================

  async saveAILead(lead: AILead): Promise<void> {
    return fileLock.acquire('ai-leads', async () => {
      const leads = await readAILeadsFile();
      leads.push(lead);
      await writeAILeadsFile(leads);
    });
  }

  async getAILeadById(id: string): Promise<AILead | undefined> {
    const leads = await readAILeadsFile();
    return leads.find((lead) => lead.id === id);
  }

  async getAILeadByPhone(phone: string): Promise<AILead | undefined> {
    const leads = await readAILeadsFile();
    return leads.find((lead) => lead.phone === phone);
  }

  async getAILeadByCallSid(callSid: string): Promise<AILead | undefined> {
    const leads = await readAILeadsFile();
    return leads.find((lead) => lead.callSid === callSid);
  }

  async updateAILead(id: string, updates: Partial<AILead>): Promise<void> {
    return fileLock.acquire('ai-leads', async () => {
      const leads = await readAILeadsFile();
      const index = leads.findIndex((lead) => lead.id === id);
      
      if (index === -1) {
        throw new Error(`AI Lead not found: ${id}`);
      }
      
      leads[index] = {
        ...leads[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await writeAILeadsFile(leads);
    });
  }

  /**
   * Atomically transition smsStatus from 'pending' to 'sending' with outcome.
   * Returns true only if the transition succeeded (current state was 'pending').
   * This prevents double SMS sends from concurrent webhook callbacks.
   */
  async trySetSmsSending(
    id: string,
    outcome: 'completed_offer' | 'missed_offer'
  ): Promise<boolean> {
    return fileLock.acquire('ai-leads', async () => {
      const leads = await readAILeadsFile();
      const index = leads.findIndex((lead) => lead.id === id);
      
      if (index === -1) {
        return false;
      }
      
      // Compare-and-swap: only transition if current state is 'pending'
      if (leads[index].smsStatus !== 'pending') {
        return false;
      }
      
      leads[index] = {
        ...leads[index],
        smsStatus: 'sending',
        smsOutcome: outcome,
        updatedAt: new Date().toISOString(),
      };
      
      await writeAILeadsFile(leads);
      return true;
    });
  }

  async getAllAILeads(): Promise<AILead[]> {
    return readAILeadsFile();
  }

  async deleteAILead(id: string): Promise<boolean> {
    return fileLock.acquire('ai-leads', async () => {
      const leads = await readAILeadsFile();
      const index = leads.findIndex(l => l.id === id);
      if (index === -1) {
        return false;
      }
      leads.splice(index, 1);
      await writeAILeadsFile(leads);
      return true;
    });
  }
}

export const storage = new MemStorage();
