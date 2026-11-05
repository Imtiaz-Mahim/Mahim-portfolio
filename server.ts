import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  createInitialDatabaseState,
  generateSectionFromNaturalLanguageFallback,
  applyNaturalLanguageEditFallback,
  slugify,
   resolveSectionForView,
} from './src/utils/portfolioEngine';
import {
  DatabaseState,
  LayoutType,
  SectionData,
  SectionPlacement,
} from './src/types/portfolio';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio-db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDatabase(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as DatabaseState;
      if (parsed && Array.isArray(parsed.sections) && parsed.settings) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read database file, initializing fresh state:', err);
  }
  const initial = createInitialDatabaseState();
  if (process.env.STUDIO_OWNER_EMAIL) {
    initial.security.ownerEmail = process.env.STUDIO_OWNER_EMAIL;
  }
  if (process.env.STUDIO_OWNER_PASSWORD) {
    initial.security.passwordHash = process.env.STUDIO_OWNER_PASSWORD;
  }
  saveDatabase(initial);
  return initial;
}

function saveDatabase(state: DatabaseState): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database state:', err);
  }
}

let db: DatabaseState = loadDatabase();

interface ActiveSession {
  token: string;
  email: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent: string;
}

const activeSessions = new Map<string, ActiveSession>();

function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

function requireOwnerAuth(req: Request, res: Response, next: NextFunction): void {
  const token = getTokenFromRequest(req);
  if (!token || !activeSessions.has(token)) {
    res.status(401).json({ error: 'Unauthorized. Please sign in to Mahim Private Studio.' });
    return;
  }
  const session = activeSessions.get(token)!;
  session.lastActiveAt = new Date().toISOString();
  next();
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const VALID_LAYOUTS: LayoutType[] = [
  'timeline',
  'grid',
  'cards',
  'gallery',
  'statistics',
  'editorial',
  'profile',
  'project-showcase',
  'achievement-showcase',
  'experience-timeline',
  'custom-combination',
];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  // ============================================================================
  // PUBLIC PORTFOLIO ENDPOINTS (Only serves published content to visitors)
  // ============================================================================
  app.get('/api/public/portfolio', (_req: Request, res: Response) => {
    const publishedSections = db.sections
      .filter((sec) => sec.status === 'published')
      .map((sec) => {
        // Strip private draftData so public visitors only ever see published content
        const { draftData, hasUnpublishedDraft, ...publicSec } = sec;
        return publicSec;
      });

    res.json({
      settings: db.settings,
      sections: publishedSections,
      media: db.media,
    });
  });

  app.post('/api/public/contact', (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message || typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      res.status(400).json({ error: 'Please provide your name, email, and message.' });
      return;
    }
    if (!email.includes('@')) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      name: name.trim().slice(0, 120),
      email: email.trim().slice(0, 120),
      subject: (subject ? String(subject).trim() : 'Portfolio Inquiry').slice(0, 160),
      message: message.trim().slice(0, 3000),
      createdAt: new Date().toISOString(),
      read: false,
    };

    db.messages.unshift(newMsg);
    saveDatabase(db);
    res.json({ ok: true, message: 'Thank you. Your message has been delivered to Ahmed Imtiaz Mahim.' });
  });

  // ============================================================================
  // AUTHENTICATION ENDPOINTS FOR MAHIM PRIVATE STUDIO
  // ============================================================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    const now = new Date().toISOString();
    const ip = req.ip || '127.0.0.1';

    const cleanEmail = String(email || '').trim().toLowerCase();
    const expectedEmail = db.security.ownerEmail.trim().toLowerCase();

    if (cleanEmail === expectedEmail && String(password || '') === db.security.passwordHash) {
      const token = crypto.randomBytes(32).toString('hex');
      activeSessions.set(token, {
        token,
        email: db.security.ownerEmail,
        createdAt: now,
        lastActiveAt: now,
        userAgent: String(req.headers['user-agent'] || 'Browser Session').slice(0, 120),
      });
      db.security.lastLoginAt = now;
      db.security.loginHistory.unshift({ timestamp: now, ip, status: 'success' });
      db.security.loginHistory = db.security.loginHistory.slice(0, 25);
      saveDatabase(db);

      res.json({
        authenticated: true,
        token,
        ownerEmail: db.security.ownerEmail,
      });
      return;
    }

    db.security.loginHistory.unshift({ timestamp: now, ip, status: 'failed' });
    db.security.loginHistory = db.security.loginHistory.slice(0, 25);
    saveDatabase(db);
    res.status(401).json({ error: 'Invalid owner credentials. Access restricted to Ahmed Imtiaz Mahim.' });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const token = getTokenFromRequest(req);
    if (token) {
      activeSessions.delete(token);
    }
    res.json({ ok: true });
  });

  app.get('/api/auth/session', (req: Request, res: Response) => {
    const token = getTokenFromRequest(req);
    if (!token || !activeSessions.has(token)) {
      res.json({ authenticated: false, ownerEmail: db.security.ownerEmail });
      return;
    }
    const session = activeSessions.get(token)!;
    session.lastActiveAt = new Date().toISOString();

    const sessionsList = Array.from(activeSessions.values()).map((s) => ({
      tokenPreview: `${s.token.slice(0, 8)}...`,
      createdAt: s.createdAt,
      lastActiveAt: s.lastActiveAt,
      userAgent: s.userAgent,
      isCurrent: s.token === token,
    }));

    res.json({
      authenticated: true,
      ownerEmail: session.email,
      sessions: sessionsList,
      loginHistory: db.security.loginHistory,
    });
  });

  app.post('/api/auth/change-password', requireOwnerAuth, (req: Request, res: Response) => {
    const { currentPassword, newPassword, newEmail } = req.body || {};
    if (String(currentPassword || '') !== db.security.passwordHash) {
      res.status(400).json({ error: 'Current password did not match.' });
      return;
    }
    if (!newPassword || String(newPassword).length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters.' });
      return;
    }
    db.security.passwordHash = String(newPassword);
    if (newEmail && String(newEmail).includes('@')) {
      db.security.ownerEmail = String(newEmail).trim();
    }
    saveDatabase(db);
    res.json({ ok: true, message: 'Owner security credentials updated.' });
  });

  app.post('/api/auth/revoke-other-sessions', requireOwnerAuth, (req: Request, res: Response) => {
    const currentToken = getTokenFromRequest(req);
    for (const key of activeSessions.keys()) {
      if (key !== currentToken) {
        activeSessions.delete(key);
      }
    }
    res.json({ ok: true, message: 'All other studio sessions have been revoked.' });
  });

  // ============================================================================
  // PROTECTED PRIVATE STUDIO MANAGEMENT ENDPOINTS
  // ============================================================================
  app.get('/api/studio/state', requireOwnerAuth, (_req: Request, res: Response) => {
    res.json({
      settings: db.settings,
      sections: db.sections,
      media: db.media,
      auditLog: db.auditLog,
      messages: db.messages,
      security: {
        ownerEmail: db.security.ownerEmail,
        lastLoginAt: db.security.lastLoginAt,
        loginHistory: db.security.loginHistory,
      },
    });
  });

  app.put('/api/studio/settings', requireOwnerAuth, (req: Request, res: Response) => {
    const updates = req.body || {};
    const now = new Date().toISOString();
    db.settings = {
      ...db.settings,
      ...updates,
      updatedAt: now,
    };
    db.auditLog.unshift({
      id: `audit-${Date.now()}`,
      action: 'theme-updated',
      sectionTitle: 'Website Settings & Theme',
      summary: `Updated website settings (Accent: ${db.settings.accentColor}, Typography: ${db.settings.fontFamily}).`,
      timestamp: now,
    });
    saveDatabase(db);
    res.json({ settings: db.settings, auditLog: db.auditLog });
  });

  // Create a new section (defaults to draft & navigationVisible: false unless explicitly published)
  app.post('/api/studio/sections', requireOwnerAuth, (req: Request, res: Response) => {
    const body = req.body || {};
    const now = new Date().toISOString();
    const title = String(body.title || 'Untitled Section').trim();
    const slug = slugify(body.slug || title) || `section-${Date.now()}`;
    const maxOrder = db.sections.reduce((m, s) => Math.max(m, s.navigationOrder), 0);

    const newSection: SectionData = {
      id: `sec-${Date.now()}`,
      title,
      slug,
      sectionType: body.sectionType || 'custom',
      subtitle: body.subtitle || '',
      summary: body.summary || '',
      layout: VALID_LAYOUTS.includes(body.layout) ? body.layout : 'cards',
      navigationLabel: body.navigationLabel || title,
      navigationVisible: Boolean(body.navigationVisible ?? false),
      navigationOrder: typeof body.navigationOrder === 'number' ? body.navigationOrder : maxOrder + 1,
      homepageVisible: Boolean(body.homepageVisible ?? true),
      placement: (body.placement as SectionPlacement) || 'homepage',
      targetSectionId: body.targetSectionId,
      status: body.status === 'published' ? 'published' : 'draft',
      isCore: false,
      createdAt: now,
      updatedAt: now,
      content: {
        leadParagraph: body.content?.leadParagraph || '',
        paragraphs: Array.isArray(body.content?.paragraphs) ? body.content.paragraphs : [],
        items: Array.isArray(body.content?.items) ? body.content.items : [],
        categories: Array.isArray(body.content?.categories) ? body.content.categories : undefined,
        subsections: Array.isArray(body.content?.subsections) ? body.content.subsections : [],
        externalLinks: Array.isArray(body.content?.externalLinks) ? body.content.externalLinks : [],
        calloutNote: body.content?.calloutNote,
      },
    };

    const previousSnapshot = JSON.parse(JSON.stringify(db.sections));
    db.sections.push(newSection);
    db.auditLog.unshift({
      id: `audit-${Date.now()}`,
      action: newSection.status === 'published' ? 'published' : 'created',
      sectionId: newSection.id,
      sectionTitle: newSection.title,
      summary: `Created section "${newSection.title}" (${newSection.status}, layout: ${newSection.layout}).`,
      timestamp: now,
      previousSectionsSnapshot: previousSnapshot,
    });
    saveDatabase(db);
    res.json({ section: newSection, sections: db.sections, auditLog: db.auditLog });
  });

  // Update a section (supports saving as draft on a published section or updating directly)
  app.put('/api/studio/sections/:id', requireOwnerAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.sections.findIndex((s) => s.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Section not found.' });
      return;
    }

    const body = req.body || {};
    const now = new Date().toISOString();
    const existing = db.sections[idx];
    const previousSnapshot = JSON.parse(JSON.stringify(db.sections));

    // If saveAsDraft is requested on an already published section, store in draftData so public site stays untouched
    if (body.saveAsDraft && existing.status === 'published') {
      existing.hasUnpublishedDraft = true;
      existing.draftData = {
        title: body.title ?? existing.title,
        subtitle: body.subtitle ?? existing.subtitle,
        summary: body.summary ?? existing.summary,
        layout: body.layout ?? existing.layout,
        content: body.content ?? existing.content,
        navigationLabel: body.navigationLabel ?? existing.navigationLabel,
        navigationVisible: body.navigationVisible ?? existing.navigationVisible,
        homepageVisible: body.homepageVisible ?? existing.homepageVisible,
        placement: body.placement ?? existing.placement,
        targetSectionId: body.targetSectionId ?? existing.targetSectionId,
        updatedAt: now,
      };
      saveDatabase(db);
      res.json({ section: existing, sections: db.sections, auditLog: db.auditLog });
      return;
    }

    const updated: SectionData = {
      ...existing,
      title: body.title ?? existing.title,
      slug: body.slug ? slugify(body.slug) : existing.slug,
      subtitle: body.subtitle !== undefined ? body.subtitle : existing.subtitle,
      summary: body.summary !== undefined ? body.summary : existing.summary,
      layout: VALID_LAYOUTS.includes(body.layout) ? body.layout : existing.layout,
      content: body.content ? { ...existing.content, ...body.content } : existing.content,
      navigationLabel: body.navigationLabel ?? existing.navigationLabel,
      navigationVisible: body.navigationVisible !== undefined ? Boolean(body.navigationVisible) : existing.navigationVisible,
      navigationOrder: typeof body.navigationOrder === 'number' ? body.navigationOrder : existing.navigationOrder,
      homepageVisible: body.homepageVisible !== undefined ? Boolean(body.homepageVisible) : existing.homepageVisible,
      placement: body.placement ?? existing.placement,
      targetSectionId: body.targetSectionId !== undefined ? body.targetSectionId : existing.targetSectionId,
      status: body.status ?? existing.status,
      hasUnpublishedDraft: false,
      draftData: undefined,
      updatedAt: now,
    };

    db.sections[idx] = updated;
    db.auditLog.unshift({
      id: `audit-${Date.now()}`,
      action: 'updated',
      sectionId: updated.id,
      sectionTitle: updated.title,
      summary: `Updated "${updated.title}" (${updated.status}).`,
      timestamp: now,
      previousSectionsSnapshot: previousSnapshot,
    });
    saveDatabase(db);
    res.json({ section: updated, sections: db.sections, auditLog: db.auditLog });
  });

  // Publish a draft section or promote draftData to published
  app.post('/api/studio/sections/:id/publish', requireOwnerAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { approveNavigation } = req.body || {};
    const idx = db.sections.findIndex((s) => s.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Section not found.' });
      return;
    }

    const now = new Date().toISOString();
    const previousSnapshot = JSON.parse(JSON.stringify(db.sections));
    const sec = db.sections[idx];
    const resolved = resolveSectionForView(sec, true);

    const publishedSec: SectionData = {
      ...resolved,
      status: 'published',
      navigationVisible: approveNavigation !== undefined ? Boolean(approveNavigation) : resolved.navigationVisible,
      hasUnpublishedDraft: false,
      draftData: undefined,
      updatedAt: now,
    };

    db.sections[idx] = publishedSec;
    db.auditLog.unshift({
      id: `audit-${Date.now()}`,
      action: 'published',
      sectionId: publishedSec.id,
      sectionTitle: publishedSec.title,
      summary: `Published "${publishedSec.title}" to live website${publishedSec.navigationVisible ? ' (included in navigation)' : ' (hidden from navigation menu)'}.`,
      timestamp: now,
      previousSectionsSnapshot: previousSnapshot,
    });
    saveDatabase(db);
    res.json({ section: publishedSec, sections: db.sections, auditLog: db.auditLog });
  });

  // Discard unpublished draft changes on a section
  app.post('/api/studio/sections/:id/discard-draft', requireOwnerAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.sections.findIndex((s) => s.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Section not found.' });
      return;
    }
    const sec = db.sections[idx];
    sec.hasUnpublishedDraft = false;
    sec.draftData = undefined;
    saveDatabase(db);
    res.json({ section: sec, sections: db.sections });
  });

  // Duplicate section as a draft
  app.post('/api/studio/sections/:id/duplicate', requireOwnerAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const existing = db.sections.find((s) => s.id === id);
    if (!existing) {
      res.status(404).json({ error: 'Section not found.' });
      return;
    }
    const now = new Date().toISOString();
    const maxOrder = db.sections.reduce((m, s) => Math.max(m, s.navigationOrder), 0);
    const copy: SectionData = {
      ...JSON.parse(JSON.stringify(existing)),
      id: `sec-copy-${Date.now()}`,
      title: `${existing.title} (Copy)`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      navigationLabel: `${existing.navigationLabel} Copy`,
      navigationVisible: false,
      navigationOrder: maxOrder + 1,
      status: 'draft',
      isCore: false,
      hasUnpublishedDraft: false,
      draftData: undefined,
      createdAt: now,
      updatedAt: now,
    };
    db.sections.push(copy);
    saveDatabase(db);
    res.json({ section: copy, sections: db.sections });
  });

  // Delete section
  app.delete('/api/studio/sections/:id', requireOwnerAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.sections.findIndex((s) => s.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Section not found.' });
      return;
    }
    const previousSnapshot = JSON.parse(JSON.stringify(db.sections));
    const removed = db.sections.splice(idx, 1)[0];
    db.auditLog.unshift({
      id: `audit-${Date.now()}`,
      action: 'deleted',
      sectionId: removed.id,
      sectionTitle: removed.title,
      summary: `Deleted section "${removed.title}".`,
      timestamp: new Date().toISOString(),
      previousSectionsSnapshot: previousSnapshot,
    });
    saveDatabase(db);
    res.json({ sections: db.sections, auditLog: db.auditLog });
  });

  // Reorder and update navigation settings in batch
  app.put('/api/studio/sections-reorder', requireOwnerAuth, (req: Request, res: Response) => {
    const { items } = req.body || {};
    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'Invalid reorder payload.' });
      return;
    }
    const previousSnapshot = JSON.parse(JSON.stringify(db.sections));
    for (const update of items) {
      const target = db.sections.find((s) => s.id === update.id);
      if (target) {
        if (typeof update.navigationOrder === 'number') target.navigationOrder = update.navigationOrder;
        if (typeof update.navigationVisible === 'boolean') target.navigationVisible = update.navigationVisible;
        if (typeof update.homepageVisible === 'boolean') target.homepageVisible = update.homepageVisible;
        if (typeof update.navigationLabel === 'string') target.navigationLabel = update.navigationLabel;
        if (update.placement) target.placement = update.placement;
        if (update.targetSectionId !== undefined) target.targetSectionId = update.targetSectionId;
      }
    }
    db.sections.sort((a, b) => a.navigationOrder - b.navigationOrder);
    db.auditLog.unshift({
      id: `audit-${Date.now()}`,
      action: 'reordered',
      sectionTitle: 'Navigation & Section Order',
      summary: 'Updated section navigation order, placement, and menu visibility.',
      timestamp: new Date().toISOString(),
      previousSectionsSnapshot: previousSnapshot,
    });
    saveDatabase(db);
    res.json({ sections: db.sections, auditLog: db.auditLog });
  });

  // Media Library management
  app.post('/api/studio/media', requireOwnerAuth, (req: Request, res: Response) => {
    const { title, category, url, caption, aspectRatio, addToCreativeSection } = req.body || {};
    if (!title || !url) {
      res.status(400).json({ error: 'Media title and image URL are required.' });
      return;
    }
    const now = new Date().toISOString();
    const newMedia = {
      id: `media-${Date.now()}`,
      title: String(title).trim(),
      category: category || 'artwork',
      url: String(url).trim(),
      caption: String(caption || '').trim(),
      aspectRatio: aspectRatio || '4:3',
      createdAt: now,
    };
    db.media.unshift(newMedia);

    if (addToCreativeSection) {
      const creativeSec = db.sections.find((s) => s.sectionType === 'creative');
      if (creativeSec) {
        creativeSec.content.items.push({
          id: `creative-media-${Date.now()}`,
          title: newMedia.title,
          subtitle: newMedia.category === 'artwork' ? 'Artwork & Sketch Study' : 'Visual Gallery Item',
          category: 'Creative Gallery',
          description: newMedia.caption || 'Added from Mahim Private Studio Media Library.',
          imageUrl: newMedia.url,
        });
        creativeSec.updatedAt = now;
      }
    }

    saveDatabase(db);
    res.json({ media: db.media, sections: db.sections });
  });

  app.delete('/api/studio/media/:id', requireOwnerAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    db.media = db.media.filter((m) => m.id !== id);
    saveDatabase(db);
    res.json({ media: db.media });
  });

  // Mark contact message read/delete
  app.put('/api/studio/messages/:id/read', requireOwnerAuth, (req: Request, res: Response) => {
    const msg = db.messages.find((m) => m.id === req.params.id);
    if (msg) {
      msg.read = true;
      saveDatabase(db);
    }
    res.json({ messages: db.messages });
  });

  // Rollback from audit snapshot
  app.post('/api/studio/audit/:id/rollback', requireOwnerAuth, (req: Request, res: Response) => {
    const entry = db.auditLog.find((a) => a.id === req.params.id);
    if (!entry || !entry.previousSectionsSnapshot) {
      res.status(400).json({ error: 'No section snapshot available for this audit entry.' });
      return;
    }
    db.sections = JSON.parse(JSON.stringify(entry.previousSectionsSnapshot));
    db.auditLog.unshift({
      id: `audit-${Date.now()}`,
      action: 'updated',
      sectionTitle: 'Snapshot Rollback',
      summary: `Restored sections state prior to "${entry.sectionTitle}".`,
      timestamp: new Date().toISOString(),
    });
    saveDatabase(db);
    res.json({ sections: db.sections, auditLog: db.auditLog });
  });

  // ============================================================================
  // AI-POWERED DYNAMIC SECTION GENERATOR (/api/studio/ai/generate-section)
  // ============================================================================
  app.post('/api/studio/ai/generate-section', requireOwnerAuth, async (req: Request, res: Response) => {
    const { prompt, preferredLayout, placement, targetSectionId } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Please describe the section you would like to generate.' });
      return;
    }

    const fallbackDraft = generateSectionFromNaturalLanguageFallback(prompt, db.sections);
    if (preferredLayout && VALID_LAYOUTS.includes(preferredLayout)) {
      fallbackDraft.layout = preferredLayout;
    }
    if (placement) {
      fallbackDraft.placement = placement;
    }
    if (targetSectionId) {
      fallbackDraft.targetSectionId = targetSectionId;
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Owner Name: Ahmed Imtiaz Mahim (Mathematics Postgraduate from University of Chittagong, Web Developer at Nerobytes in Chattogram using JavaScript and React.js, General Secretary of Jalalabad Student's Association, Champion at Srijonshil Medha Onneshon Protijogita 2017, First Place at Upazila-level School Art Contest, skilled in Sketching by Reference).\n\nUser Request to create a new portfolio section:\n"${prompt.trim()}"\n\nGenerate a structured section matching the user's description. Do not invent fake degrees or unrequested jobs; use only information provided in the user prompt and factual context.`,
          config: {
            systemInstruction:
              'You are the private portfolio architect for Ahmed Imtiaz Mahim. Output structured JSON for a responsive React section. Choose the most appropriate layout from: timeline, grid, cards, gallery, statistics, editorial, profile, project-showcase, achievement-showcase, experience-timeline, custom-combination.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                summary: { type: Type.STRING },
                layout: { type: Type.STRING },
                leadParagraph: { type: Type.STRING },
                paragraphs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      subtitle: { type: Type.STRING },
                      organization: { type: Type.STRING },
                      period: { type: Type.STRING },
                      category: { type: Type.STRING },
                      description: { type: Type.STRING },
                      highlights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      technologies: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const parsed = JSON.parse((response.text ?? '{}').trim());
        if (parsed && parsed.title) {
          const chosenLayout: LayoutType =
            preferredLayout && VALID_LAYOUTS.includes(preferredLayout)
              ? preferredLayout
              : VALID_LAYOUTS.includes(parsed.layout)
              ? parsed.layout
              : fallbackDraft.layout;

          const aiDraft: Omit<SectionData, 'id' | 'createdAt' | 'updatedAt'> = {
            ...fallbackDraft,
            title: String(parsed.title).trim(),
            slug: slugify(String(parsed.title)),
            subtitle: parsed.subtitle ? String(parsed.subtitle) : fallbackDraft.subtitle,
            summary: parsed.summary ? String(parsed.summary) : fallbackDraft.summary,
            layout: chosenLayout,
            navigationLabel: String(parsed.title).trim(),
            navigationVisible: false, // Never auto-add to nav without approval
            status: 'draft', // Always starts as draft for preview
            content: {
              leadParagraph: parsed.leadParagraph || fallbackDraft.content.leadParagraph,
              paragraphs: Array.isArray(parsed.paragraphs) && parsed.paragraphs.length > 0
                ? parsed.paragraphs
                : fallbackDraft.content.paragraphs,
              items: Array.isArray(parsed.items) && parsed.items.length > 0
                ? parsed.items.map((item: Record<string, unknown>, idx: number) => ({
                    id: `ai-item-${Date.now()}-${idx}`,
                    title: String(item.title || 'Entry'),
                    subtitle: item.subtitle ? String(item.subtitle) : undefined,
                    organization: item.organization ? String(item.organization) : undefined,
                    period: item.period ? String(item.period) : undefined,
                    category: item.category ? String(item.category) : undefined,
                    description: String(item.description || ''),
                    highlights: Array.isArray(item.highlights) ? item.highlights.map(String) : undefined,
                    technologies: Array.isArray(item.technologies) ? item.technologies.map(String) : undefined,
                    imageUrl: fallbackDraft.content.items[idx % fallbackDraft.content.items.length]?.imageUrl,
                  }))
                : fallbackDraft.content.items,
              subsections: [],
              externalLinks: [],
            },
          };

          res.json({
            generatedDraft: aiDraft,
            engine: 'gemini-3.8-flash',
          });
          return;
        }
      } catch (err) {
        console.warn('Gemini generation fallback activated:', err);
      }
    }

    res.json({
      generatedDraft: fallbackDraft,
      engine: 'structured-studio-architect',
    });
  });

  // ============================================================================
  // AI WEBSITE EDITOR (/api/studio/ai/edit-website)
  // ============================================================================
  app.post('/api/studio/ai/edit-website', requireOwnerAuth, async (req: Request, res: Response) => {
    const { instruction, applyMode } = req.body || {};
    if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
      res.status(400).json({ error: 'Please enter a natural language editing instruction.' });
      return;
    }

    const previousSnapshot = JSON.parse(JSON.stringify(db.sections));
    const result = applyNaturalLanguageEditFallback(instruction, {
      settings: db.settings,
      sections: db.sections,
    });

    // Optional Gemini refinement when editing a specific section's prose or adding items
    const ai = getGeminiClient();
    if (ai && result.targetSectionId && result.updatedSections) {
      try {
        const targetSec = result.updatedSections.find((s) => s.id === result.targetSectionId);
        if (targetSec && !instruction.toLowerCase().includes('move')) {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Current section JSON:\n${JSON.stringify({
              title: targetSec.title,
              subtitle: targetSec.subtitle,
              layout: targetSec.layout,
              leadParagraph: targetSec.content.leadParagraph,
              paragraphs: targetSec.content.paragraphs,
              items: targetSec.content.items,
            })}\n\nOwner instruction: "${instruction.trim()}"\n\nReturn the updated fields for ONLY this section while preserving factual accuracy for Ahmed Imtiaz Mahim.`,
            config: {
              systemInstruction:
                'Modify only the requested aspects of this section. Valid layouts: timeline, grid, cards, gallery, statistics, editorial, profile, project-showcase, achievement-showcase, experience-timeline, custom-combination.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  subtitle: { type: Type.STRING },
                  layout: { type: Type.STRING },
                  leadParagraph: { type: Type.STRING },
                  paragraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  summaryExplanation: { type: Type.STRING },
                },
              },
            },
          });
          const aiPatch = JSON.parse((response.text ?? '{}').trim());
          if (aiPatch.subtitle) targetSec.subtitle = aiPatch.subtitle;
          if (aiPatch.layout && VALID_LAYOUTS.includes(aiPatch.layout)) {
            targetSec.layout = aiPatch.layout;
          }
          if (aiPatch.leadParagraph) targetSec.content.leadParagraph = aiPatch.leadParagraph;
          if (Array.isArray(aiPatch.paragraphs) && aiPatch.paragraphs.length > 0) {
            targetSec.content.paragraphs = aiPatch.paragraphs;
          }
          if (aiPatch.summaryExplanation) {
            result.summary = aiPatch.summaryExplanation;
          }
        }
      } catch (err) {
        console.warn('Gemini editor refinement fallback used:', err);
      }
    }

    // If applyMode === 'draft', save changes as draftData on the targeted section rather than overwriting live
    if (applyMode === 'draft' && result.targetSectionId && result.updatedSections) {
      const modifiedSec = result.updatedSections.find((s) => s.id === result.targetSectionId);
      const originalSec = db.sections.find((s) => s.id === result.targetSectionId);
      if (modifiedSec && originalSec && originalSec.status === 'published') {
        originalSec.hasUnpublishedDraft = true;
        originalSec.draftData = {
          title: modifiedSec.title,
          subtitle: modifiedSec.subtitle,
          summary: modifiedSec.summary,
          layout: modifiedSec.layout,
          content: modifiedSec.content,
          navigationLabel: modifiedSec.navigationLabel,
          navigationVisible: modifiedSec.navigationVisible,
          homepageVisible: modifiedSec.homepageVisible,
          placement: modifiedSec.placement,
          targetSectionId: modifiedSec.targetSectionId,
          updatedAt: new Date().toISOString(),
        };
        saveDatabase(db);
        res.json({
          summary: `${result.summary} (Saved as Draft for Preview before Publishing)`,
          targetSectionId: result.targetSectionId,
          settings: db.settings,
          sections: db.sections,
          auditLog: db.auditLog,
        });
        return;
      }
    }

    // Apply immediately if applyMode !== 'draft' or if global theme/order changed
    if (result.updatedSettings) {
      db.settings = result.updatedSettings;
    }
    if (result.updatedSections) {
      db.sections = result.updatedSections;
    }

    db.auditLog.unshift({
      id: `audit-${Date.now()}`,
      action: 'updated',
      sectionId: result.targetSectionId,
      sectionTitle: result.targetSectionId
        ? db.sections.find((s) => s.id === result.targetSectionId)?.title || 'Section Edit'
        : 'AI Website Edit',
      summary: result.summary,
      timestamp: new Date().toISOString(),
      previousSectionsSnapshot: previousSnapshot,
    });

    saveDatabase(db);
    res.json({
      summary: result.summary,
      targetSectionId: result.targetSectionId,
      settings: db.settings,
      sections: db.sections,
      auditLog: db.auditLog,
    });
  });

  // ============================================================================
  // VITE MIDDLEWARE (DEV) OR STATIC ASSETS (PROD)
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ahmed Imtiaz Mahim Portfolio & Private Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
