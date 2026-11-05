export type LayoutType =
  | 'timeline'
  | 'grid'
  | 'cards'
  | 'gallery'
  | 'statistics'
  | 'editorial'
  | 'profile'
  | 'project-showcase'
  | 'achievement-showcase'
  | 'experience-timeline'
  | 'custom-combination';

export type SectionPlacement =
  | 'homepage'
  | 'main-navigation'
  | 'before-section'
  | 'after-section'
  | 'inside-section'
  | 'footer'
  | 'standalone-page';

export type PublicationStatus = 'published' | 'draft' | 'hidden';

export type AccentColor = 'violet' | 'blue' | 'emerald' | 'amber' | 'rose';
export type FontFamilyChoice = 'Poppins' | 'Montserrat' | 'Lato';

export interface ExternalLinkItem {
  id: string;
  label: string;
  url: string;
}

export interface SubsectionItem {
  id: string;
  title: string;
  body: string;
}

export interface SectionContentItem {
  id: string;
  title: string;
  subtitle?: string;
  organization?: string;
  location?: string;
  period?: string;
  category?: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  badgeText?: string;
  metricValue?: string;
  metricUnit?: string;
}

export interface SectionContentPayload {
  leadParagraph?: string;
  paragraphs: string[];
  items: SectionContentItem[];
  categories?: {
    id: string;
    name: string;
    skills: string[];
  }[];
  subsections: SubsectionItem[];
  externalLinks: ExternalLinkItem[];
  calloutNote?: string;
}

export interface SectionDraftSnapshot {
  title: string;
  subtitle?: string;
  summary?: string;
  layout: LayoutType;
  content: SectionContentPayload;
  navigationLabel: string;
  navigationVisible: boolean;
  homepageVisible: boolean;
  placement: SectionPlacement;
  targetSectionId?: string;
  updatedAt: string;
}

export interface SectionData {
  id: string;
  title: string;
  slug: string;
  sectionType:
    | 'home'
    | 'about'
    | 'education'
    | 'experience'
    | 'skills'
    | 'projects'
    | 'academic'
    | 'awards'
    | 'leadership'
    | 'creative'
    | 'languages'
    | 'contact'
    | 'custom';
  subtitle?: string;
  summary?: string;
  content: SectionContentPayload;
  layout: LayoutType;
  navigationLabel: string;
  navigationVisible: boolean;
  navigationOrder: number;
  homepageVisible: boolean;
  placement: SectionPlacement;
  targetSectionId?: string;
  status: PublicationStatus;
  isCore?: boolean;
  hasUnpublishedDraft?: boolean;
  draftData?: SectionDraftSnapshot;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  ownerName: string;
  identities: string[];
  professionalSummary: string;
  heroGreeting: string;
  profileImageUrl: string;
  accentColor: AccentColor;
  fontFamily: FontFamilyChoice;
  email: string;
  whatsapp: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'portrait' | 'project' | 'artwork' | 'gallery' | 'academic';
  url: string;
  caption: string;
  aspectRatio: '1:1' | '16:9' | '4:3' | '3:4';
  createdAt: string;
}

export interface PublishAuditEntry {
  id: string;
  action: 'published' | 'updated' | 'created' | 'unpublished' | 'theme-updated' | 'reordered' | 'deleted';
  sectionId?: string;
  sectionTitle: string;
  summary: string;
  timestamp: string;
  previousSectionsSnapshot?: SectionData[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SecuritySessionInfo {
  tokenPreview: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent: string;
}

export interface DatabaseState {
  settings: SiteSettings;
  sections: SectionData[];
  media: MediaItem[];
  auditLog: PublishAuditEntry[];
  messages: ContactSubmission[];
  security: {
    ownerEmail: string;
    passwordHash: string;
    lastLoginAt?: string;
    loginHistory: { timestamp: string; ip: string; status: 'success' | 'failed' }[];
  };
}
