import React, { useEffect, useState } from 'react';
import {
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  FolderGit2,
  Globe,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Monitor,
  Navigation,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Wand2,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  AccentColor,
  ContactSubmission,
  FontFamilyChoice,
  LayoutType,
  MediaItem,
  PublishAuditEntry,
  SectionContentItem,
  SectionData,
  SectionPlacement,
  SiteSettings,
} from '../types/portfolio';
import { DynamicSectionRenderer } from './DynamicSectionRenderer';
import { PublicPortfolioView } from './PublicPortfolioView';
import { resolveSectionForView } from '../utils/portfolioEngine';

type StudioTab =
  | 'dashboard'
  | 'ai-creator'
  | 'ai-editor'
  | 'manage-sections'
  | 'navigation-manager'
  | 'projects-manager'
  | 'achievements-manager'
  | 'media-library'
  | 'drafts'
  | 'published-changes'
  | 'website-settings'
  | 'security-settings';

interface PrivateStudioViewProps {
  onPublicDataChanged: () => void;
}

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: 'timeline', label: 'Timeline' },
  { value: 'grid', label: 'Grid' },
  { value: 'cards', label: 'Cards' },
  { value: 'gallery', label: 'Image Gallery' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'editorial', label: 'Editorial Layout' },
  { value: 'profile', label: 'Profile Layout' },
  { value: 'project-showcase', label: 'Project Showcase' },
  { value: 'achievement-showcase', label: 'Achievement Showcase' },
  { value: 'experience-timeline', label: 'Experience Timeline' },
  { value: 'custom-combination', label: 'Custom Combination (Timeline + Gallery)' },
];

const PLACEMENT_OPTIONS: { value: SectionPlacement; label: string }[] = [
  { value: 'homepage', label: 'Homepage (Standard Sequence)' },
  { value: 'main-navigation', label: 'Homepage + Main Navigation' },
  { value: 'before-section', label: 'Before Another Section' },
  { value: 'after-section', label: 'After Another Section' },
  { value: 'inside-section', label: 'Inside Another Section (Subsection)' },
  { value: 'footer', label: 'Footer Area' },
  { value: 'standalone-page', label: 'Standalone Page' },
];

export const PrivateStudioView: React.FC<PrivateStudioViewProps> = ({
  onPublicDataChanged,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem('mahim_studio_token')
  );
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('aimtiazm2017@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Studio navigation & mobile menu
  const [activeTab, setActiveTab] = useState<StudioTab>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Studio database state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [auditLog, setAuditLog] = useState<PublishAuditEntry[]>([]);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [securityInfo, setSecurityInfo] = useState<{
    ownerEmail: string;
    lastLoginAt?: string;
    loginHistory: { timestamp: string; ip: string; status: string }[];
  } | null>(null);

  // Feedback banner
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Viewport preview mode ('desktop' | 'tablet' | 'mobile')
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  );

  // AI Section Creator state
  const [aiCreatorPrompt, setAiCreatorPrompt] = useState('');
  const [aiCreatorLayout, setAiCreatorLayout] = useState<LayoutType | ''>('');
  const [aiCreatorPlacement, setAiCreatorPlacement] = useState<SectionPlacement>('homepage');
  const [aiCreatorTargetSec, setAiCreatorTargetSec] = useState<string>('');
  const [aiCreatorLoading, setAiCreatorLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<Omit<
    SectionData,
    'id' | 'createdAt' | 'updatedAt'
  > | null>(null);
  const [approveNavOnPublish, setApproveNavOnPublish] = useState(false);

  // AI Website Editor state
  const [aiEditorInstruction, setAiEditorInstruction] = useState('');
  const [aiEditorMode, setAiEditorMode] = useState<'draft' | 'immediate'>('immediate');
  const [aiEditorLoading, setAiEditorLoading] = useState(false);
  const [aiEditorResultSummary, setAiEditorResultSummary] = useState('');

  // Manage Sections modal / editor state
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Projects Manager new project state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjSubtitle, setNewProjSubtitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('JavaScript, React.js');
  const [newProjImage, setNewProjImage] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('https://github.com/ahmed-imtiaz-mahim');
  const [newProjLive, setNewProjLive] = useState('#projects');

  // Achievements Manager new achievement state
  const [newAwardTitle, setNewAwardTitle] = useState('');
  const [newAwardSubtitle, setNewAwardSubtitle] = useState('');
  const [newAwardPeriod, setNewAwardPeriod] = useState('');
  const [newAwardOrg, setNewAwardOrg] = useState('');
  const [newAwardDesc, setNewAwardDesc] = useState('');

  // Media Library new item state
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<'artwork' | 'project' | 'gallery' | 'portrait'>('artwork');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [addMediaToCreative, setAddMediaToCreative] = useState(true);

  // Security password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const authHeaders = (overrideToken?: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${overrideToken || token || ''}`,
  });

  const fetchStudioState = async (activeToken?: string) => {
    try {
      const res = await fetch('/api/studio/state', {
        headers: authHeaders(activeToken),
      });
      if (!res.ok) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setSettings(data.settings);
      setSections(data.sections);
      setMedia(data.media);
      setAuditLog(data.auditLog);
      setMessages(data.messages);
      setSecurityInfo(data.security);
      setAuthenticated(true);
    } catch (err) {
      console.error('Failed to load Studio state:', err);
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStudioState(token);
    } else {
      setAuthChecking(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter your owner email and password.');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        setLoginError(data.error || 'Authentication failed.');
        return;
      }
      sessionStorage.setItem('mahim_studio_token', data.token);
      setToken(data.token);
      await fetchStudioState(data.token);
      showNotice('Authenticated into Mahim Private Studio.');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Unable to connect to authentication server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: authHeaders(),
      });
    } catch {
      // ignore
    }
    sessionStorage.removeItem('mahim_studio_token');
    setToken(null);
    setAuthenticated(false);
  };

  // ==========================================================================
  // AI SECTION CREATOR HANDLERS
  // ==========================================================================
  const handleGenerateAiSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCreatorPrompt.trim()) {
      showNotice('Please describe the section you want to create.', 'error');
      return;
    }
    setAiCreatorLoading(true);
    try {
      const res = await fetch('/api/studio/ai/generate-section', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          prompt: aiCreatorPrompt,
          preferredLayout: aiCreatorLayout || undefined,
          placement: aiCreatorPlacement,
          targetSectionId: aiCreatorTargetSec || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setGeneratedDraft(data.generatedDraft);
      setApproveNavOnPublish(false);
      showNotice(`Generated "${data.generatedDraft.title}" preview using ${data.generatedDraft.layout} layout.`);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Error generating section', 'error');
    } finally {
      setAiCreatorLoading(false);
    }
  };

  const handleSaveGeneratedSection = async (publishNow: boolean) => {
    if (!generatedDraft) return;
    try {
      const payload = {
        ...generatedDraft,
        status: publishNow ? 'published' : 'draft',
        navigationVisible: publishNow ? approveNavOnPublish : false,
      };
      const res = await fetch('/api/studio/sections', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save section');
      setSections(data.sections);
      setAuditLog(data.auditLog);
      setGeneratedDraft(null);
      setAiCreatorPrompt('');
      onPublicDataChanged();
      showNotice(
        publishNow
          ? `Published "${data.section.title}" to the live portfolio.`
          : `Saved "${data.section.title}" as a draft.`
      );
      if (!publishNow) {
        setActiveTab('drafts');
      }
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Failed to save section', 'error');
    }
  };

  // ==========================================================================
  // AI WEBSITE EDITOR HANDLERS
  // ==========================================================================
  const handleRunAiWebsiteEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiEditorInstruction.trim()) {
      showNotice('Please enter an instruction for the AI Website Editor.', 'error');
      return;
    }
    setAiEditorLoading(true);
    try {
      const res = await fetch('/api/studio/ai/edit-website', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          instruction: aiEditorInstruction,
          applyMode: aiEditorMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply instruction');
      if (data.settings) setSettings(data.settings);
      if (data.sections) setSections(data.sections);
      if (data.auditLog) setAuditLog(data.auditLog);
      setAiEditorResultSummary(data.summary);
      onPublicDataChanged();
      showNotice(data.summary);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Failed to edit website', 'error');
    } finally {
      setAiEditorLoading(false);
    }
  };

  // ==========================================================================
  // SECTION CRUD & PUBLISHING HANDLERS
  // ==========================================================================
  const handlePublishSection = async (secId: string, approveNav?: boolean) => {
    try {
      const res = await fetch(`/api/studio/sections/${secId}/publish`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ approveNavigation: approveNav }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish');
      setSections(data.sections);
      setAuditLog(data.auditLog);
      onPublicDataChanged();
      showNotice(`Published "${data.section.title}" to live website.`);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Publish failed', 'error');
    }
  };

  const handleUpdateSectionStatus = async (sec: SectionData, status: 'published' | 'draft' | 'hidden') => {
    try {
      const res = await fetch(`/api/studio/sections/${sec.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setSections(data.sections);
      setAuditLog(data.auditLog);
      onPublicDataChanged();
      showNotice(`Changed "${sec.title}" status to ${status}.`);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Status update failed', 'error');
    }
  };

  const handleDuplicateSection = async (secId: string) => {
    try {
      const res = await fetch(`/api/studio/sections/${secId}/duplicate`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Duplicate failed');
      setSections(data.sections);
      showNotice(`Duplicated section as draft "${data.section.title}".`);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Duplicate failed', 'error');
    }
  };

  const handleDeleteSection = async (secId: string) => {
    try {
      const res = await fetch(`/api/studio/sections/${secId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setSections(data.sections);
      setAuditLog(data.auditLog);
      setConfirmDeleteId(null);
      onPublicDataChanged();
      showNotice('Section deleted.');
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  const handleSaveEditedSection = async (saveAsDraft: boolean) => {
    if (!editingSection) return;
    try {
      const res = await fetch(`/api/studio/sections/${editingSection.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          ...editingSection,
          saveAsDraft,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSections(data.sections);
      if (data.auditLog) setAuditLog(data.auditLog);
      setEditingSection(null);
      onPublicDataChanged();
      showNotice(
        saveAsDraft
          ? `Saved draft changes for "${editingSection.title}".`
          : `Updated "${editingSection.title}".`
      );
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  const handleDiscardDraft = async (secId: string) => {
    try {
      const res = await fetch(`/api/studio/sections/${secId}/discard-draft`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Discard failed');
      setSections(data.sections);
      showNotice('Discarded unpublished draft changes.');
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Discard failed', 'error');
    }
  };

  const handleMoveSectionOrder = async (index: number, direction: 'up' | 'down') => {
    const ordered = [...sections].sort((a, b) => a.navigationOrder - b.navigationOrder);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= ordered.length) return;
    const temp = ordered[index];
    ordered[index] = ordered[targetIdx];
    ordered[targetIdx] = temp;
    const payload = ordered.map((s, idx) => ({
      id: s.id,
      navigationOrder: idx + 1,
      navigationVisible: s.navigationVisible,
      homepageVisible: s.homepageVisible,
      navigationLabel: s.navigationLabel,
      placement: s.placement,
      targetSectionId: s.targetSectionId,
    }));

    try {
      const res = await fetch('/api/studio/sections-reorder', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ items: payload }),
      });
      const data = await res.json();
      if (res.ok) {
        setSections(data.sections);
        setAuditLog(data.auditLog);
        onPublicDataChanged();
        showNotice('Updated section order.');
      }
    } catch (err) {
      showNotice('Failed to reorder sections', 'error');
    }
  };

  // ==========================================================================
  // LOGIN SCREEN (WHEN NOT AUTHENTICATED)
  // ==========================================================================
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-200 flex items-center justify-center p-6">
        <p className="text-sm text-zinc-400">Verifying Mahim Private Studio session...</p>
      </div>
    );
  }

  if (!authenticated || !settings) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <p className="text-xs font-medium text-violet-400">Owner Access Only</p>
              <h1 className="text-xl font-bold tracking-tight text-zinc-50 mt-0.5">
                MAHIM PRIVATE STUDIO
              </h1>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Private AI-powered portfolio administration system for Ahmed Imtiaz Mahim. Public registration is disabled.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="studio-login-email"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Owner Email
              </label>
              <input
                id="studio-login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label
                htmlFor="studio-login-password"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Studio Passphrase
              </label>
              <input
                id="studio-login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter owner passphrase"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            {loginError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-xs text-rose-200 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Private Studio'}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs text-zinc-400">
            <button
              type="button"
              onClick={() => {
                setLoginEmail('aimtiazm2017@gmail.com');
                setLoginPassword('MahimStudio2026!');
              }}
              className="text-violet-400 hover:underline cursor-pointer"
            >
              Fill Default Owner Credentials
            </button>
            <a href="/" className="text-zinc-400 hover:text-zinc-200">
              Return to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Computed Studio stats
  const publishedCount = sections.filter((s) => s.status === 'published').length;
  const draftSectionsList = sections.filter(
    (s) => s.status === 'draft' || s.hasUnpublishedDraft
  );
  const projectsSection = sections.find((s) => s.sectionType === 'projects');
  const awardsSection = sections.find((s) => s.sectionType === 'awards');

  const NAV_ITEMS: { id: StudioTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'ai-creator', label: 'AI Section Creator', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ai-editor', label: 'AI Website Editor', icon: <Wand2 className="w-4 h-4" /> },
    {
      id: 'manage-sections',
      label: 'Manage Sections',
      icon: <FileText className="w-4 h-4" />,
      count: sections.length,
    },
    {
      id: 'navigation-manager',
      label: 'Navigation Manager',
      icon: <Navigation className="w-4 h-4" />,
    },
    {
      id: 'projects-manager',
      label: 'Projects Manager',
      icon: <FolderGit2 className="w-4 h-4" />,
      count: projectsSection?.content.items.length || 0,
    },
    {
      id: 'achievements-manager',
      label: 'Achievements Manager',
      icon: <Award className="w-4 h-4" />,
      count: awardsSection?.content.items.length || 0,
    },
    {
      id: 'media-library',
      label: 'Media Library',
      icon: <ImageIcon className="w-4 h-4" />,
      count: media.length,
    },
    {
      id: 'drafts',
      label: 'Drafts',
      icon: <Edit3 className="w-4 h-4" />,
      count: draftSectionsList.length,
    },
    {
      id: 'published-changes',
      label: 'Published Changes',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'website-settings',
      label: 'Website Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'security-settings',
      label: 'Security Settings',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  // Viewport Preview Toolbar helper
  const renderViewportControls = () => (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-950 border border-zinc-800">
      <button
        type="button"
        onClick={() => setPreviewViewport('desktop')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer ${
          previewViewport === 'desktop'
            ? 'bg-violet-600 text-white'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        <span>Desktop</span>
      </button>
      <button
        type="button"
        onClick={() => setPreviewViewport('tablet')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer ${
          previewViewport === 'tablet'
            ? 'bg-violet-600 text-white'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Tablet className="w-3.5 h-3.5" />
        <span>Tablet</span>
      </button>
      <button
        type="button"
        onClick={() => setPreviewViewport('mobile')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer ${
          previewViewport === 'mobile'
            ? 'bg-violet-600 text-white'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Mobile</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="flex lg:hidden sticky top-0 z-30 h-14 px-4 bg-[#0c0c0f] border-b border-zinc-800 items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold tracking-tight">MAHIM PRIVATE STUDIO</span>
        </div>
        <button
          type="button"
          aria-label="Toggle Studio Menu"
          onClick={() => setMobileNavOpen((v) => !v)}
          className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 cursor-pointer"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Studio Sidebar (Desktop Fixed + Mobile Drawer) */}
      <aside
        aria-label="Mahim Private Studio Navigation"
        className={`${
          mobileNavOpen ? 'fixed inset-x-0 top-14 bottom-0 z-40 block' : 'hidden'
        } lg:block lg:w-64 lg:shrink-0 bg-[#0c0c0f] border-r border-zinc-800/90 p-5 overflow-y-auto`}
      >
        <div className="hidden lg:block pb-5 mb-5 border-b border-zinc-800">
          <p className="text-[11px] font-medium text-violet-400">Private AI Builder</p>
          <h1 className="text-base font-bold tracking-tight text-zinc-50 mt-0.5">
            MAHIM PRIVATE STUDIO
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{securityInfo?.ownerEmail}</p>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === item.id
                  ? 'bg-violet-600/20 text-violet-200 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                {item.icon}
                <span className="truncate">{item.label}</span>
              </span>
              {item.count !== undefined && (
                <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                  {item.count}
                </span>
              )}
            </button>
          ))}

          {/* 13. Logout */}
          <div className="pt-4 mt-4 border-t border-zinc-800 space-y-1">
            <a
              href="/"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-900/60"
            >
              <span className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-violet-400" />
                <span>View Public Portfolio</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-950/40 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Studio Main Content Workspace */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full space-y-8">
        {/* Top Toast Notice */}
        {toast && (
          <div
            role="status"
            className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/70 border-rose-800 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toast.text}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setToast(null)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==================================================================
            1. DASHBOARD OVERVIEW
            ================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-50">Studio Dashboard</h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Manage Ahmed Imtiaz Mahim’s portfolio sections, AI generation, drafts, and live publications.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-creator')}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Section Creator</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-editor')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Wand2 className="w-4 h-4 text-violet-400" />
                  <span>AI Website Editor</span>
                </button>
              </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <p className="text-xs text-zinc-400">Total Sections</p>
                <p className="text-2xl font-bold text-zinc-50 mt-1 font-mono tabular-nums">
                  {sections.length}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Database-driven sections</p>
              </div>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <p className="text-xs text-zinc-400">Published Sections</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono tabular-nums">
                  {publishedCount}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Live to public visitors</p>
              </div>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <p className="text-xs text-zinc-400">Drafts &amp; Pending Edits</p>
                <p className="text-2xl font-bold text-amber-400 mt-1 font-mono tabular-nums">
                  {draftSectionsList.length}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Awaiting your approval</p>
              </div>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <p className="text-xs text-zinc-400">Contact Inquiries</p>
                <p className="text-2xl font-bold text-violet-400 mt-1 font-mono tabular-nums">
                  {messages.length}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Direct form messages</p>
              </div>
            </div>

            {/* Quick Actions & Recent Modifications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-100">Quick Studio Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ai-creator')}
                    className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 text-left cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-zinc-100">Generate Section</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Describe in plain language</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('projects-manager')}
                    className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 text-left cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-zinc-100">Add Project</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Update portfolio cards</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('achievements-manager')}
                    className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 text-left cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-zinc-100">Awards Manager</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Manage honors &amp; layout</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('website-settings')}
                    className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 text-left cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-zinc-100">Theme &amp; Colors</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Accent: {settings.accentColor}
                    </p>
                  </button>
                </div>

                {/* Contact Messages Inbox */}
                <div className="pt-4 border-t border-zinc-800">
                  <h4 className="text-xs font-semibold text-zinc-300 mb-3">
                    Recent Contact Form Submissions
                  </h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs"
                      >
                        <div className="flex items-center justify-between text-zinc-300 font-medium">
                          <span>{msg.name}</span>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-violet-400">{msg.email}</p>
                        <p className="text-zinc-400 mt-1">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-100">Recent Modifications</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('published-changes')}
                    className="text-xs text-violet-400 hover:underline cursor-pointer"
                  >
                    Full Audit History
                  </button>
                </div>
                <div className="space-y-3">
                  {auditLog.slice(0, 6).map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs font-semibold text-zinc-100">
                          {entry.sectionTitle}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">{entry.summary}</p>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500 tabular-nums shrink-0">
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Live Website Preview inside Dashboard */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    Interactive Website Preview (Including Drafts)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Switch between Desktop, Tablet, and Mobile viewports before publishing.
                  </p>
                </div>
                {renderViewportControls()}
              </div>

              <div
                className={`mx-auto border border-zinc-800 rounded-xl overflow-hidden bg-[#09090b] transition-all ${
                  previewViewport === 'mobile'
                    ? 'max-w-[390px]'
                    : previewViewport === 'tablet'
                    ? 'max-w-[768px]'
                    : 'w-full'
                } max-h-[540px] overflow-y-auto`}
              >
                <PublicPortfolioView
                  settings={settings}
                  sections={sections}
                  includeDrafts={true}
                  forcedViewport={previewViewport}
                  isEmbeddedPreview={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            2. AI SECTION CREATOR
            ================================================================== */}
        {activeTab === 'ai-creator' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-800 pb-5">
              <h2 className="text-2xl font-bold text-zinc-50">
                AI-Powered Dynamic Section Generator
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Describe a new portfolio section in plain language. Gemini designs a structured, responsive React section, lets you preview it across Desktop/Tablet/Mobile, saves it as a draft, and publishes only after your approval.
              </p>
            </div>

            <form
              onSubmit={handleGenerateAiSection}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5"
            >
              <div>
                <label
                  htmlFor="ai-section-prompt"
                  className="block text-xs font-medium text-zinc-200 mb-2"
                >
                  Describe Your New Section
                </label>
                <textarea
                  id="ai-section-prompt"
                  rows={4}
                  value={aiCreatorPrompt}
                  onChange={(e) => setAiCreatorPrompt(e.target.value)}
                  placeholder="Example: Create a new section called My University Life. I want to share my university memories, extracurricular activities, event photographs, and experiences. Make it visually attractive using a timeline and image gallery."
                  className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Example Prompt Presets */}
              <div className="space-y-2">
                <p className="text-xs text-zinc-400">Try an example prompt:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Create a new section called My University Life. I want to share my university memories, extracurricular activities, event photographs, and experiences. Make it visually attractive using a timeline and image gallery.',
                    'Create a new section called Mathematical Publications & Notes to share my Optimal Control Theory research notes and analytical models using cards.',
                    'Create a new section called Certifications & Workshops to highlight my continuous learning in React.js and JavaScript using a timeline.',
                  ].map((sample, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setAiCreatorPrompt(sample)}
                      className="text-left text-xs px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 text-zinc-300 cursor-pointer"
                    >
                      “{sample.slice(0, 78)}...”
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label
                    htmlFor="ai-creator-layout"
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Preferred Layout (Optional)
                  </label>
                  <select
                    id="ai-creator-layout"
                    value={aiCreatorLayout}
                    onChange={(e) => setAiCreatorLayout(e.target.value as LayoutType | '')}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                  >
                    <option value="">Let AI Select Appropriate Layout</option>
                    {LAYOUT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ai-creator-placement"
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Where Section Appears
                  </label>
                  <select
                    id="ai-creator-placement"
                    value={aiCreatorPlacement}
                    onChange={(e) => setAiCreatorPlacement(e.target.value as SectionPlacement)}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                  >
                    {PLACEMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {(aiCreatorPlacement === 'before-section' ||
                  aiCreatorPlacement === 'after-section' ||
                  aiCreatorPlacement === 'inside-section') && (
                  <div>
                    <label
                      htmlFor="ai-creator-target"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Reference Section
                    </label>
                    <select
                      id="ai-creator-target"
                      value={aiCreatorTargetSec}
                      onChange={(e) => setAiCreatorTargetSec(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                    >
                      <option value="">Select section...</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={aiCreatorLoading}
                className="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-xs sm:text-sm font-medium text-white inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {aiCreatorLoading
                    ? 'Designing Responsive Section...'
                    : 'Generate Section Preview'}
                </span>
              </button>
            </form>

            {/* Generated Draft Editor & Multi-Device Preview */}
            {generatedDraft && (
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-violet-500/40 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <p className="text-xs text-violet-400 font-medium">
                      AI Draft Ready for Review &amp; Customization
                    </p>
                    <h3 className="text-lg font-bold text-zinc-50 mt-0.5">
                      {generatedDraft.title}
                    </h3>
                  </div>
                  {renderViewportControls()}
                </div>

                {/* Quick Customization Before Saving/Publishing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={generatedDraft.title}
                      onChange={(e) =>
                        setGeneratedDraft({
                          ...generatedDraft,
                          title: e.target.value,
                          navigationLabel: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={generatedDraft.subtitle || ''}
                      onChange={(e) =>
                        setGeneratedDraft({ ...generatedDraft, subtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Layout Style</label>
                    <select
                      value={generatedDraft.layout}
                      onChange={(e) =>
                        setGeneratedDraft({
                          ...generatedDraft,
                          layout: e.target.value as LayoutType,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                    >
                      {LAYOUT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Component Preview Frame */}
                <div
                  className={`mx-auto rounded-xl border border-zinc-800 bg-[#09090b] px-6 transition-all ${
                    previewViewport === 'mobile'
                      ? 'max-w-[390px]'
                      : previewViewport === 'tablet'
                      ? 'max-w-[768px]'
                      : 'w-full'
                  }`}
                >
                  <DynamicSectionRenderer
                    section={{
                      ...generatedDraft,
                      id: 'preview-draft',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }}
                    settings={settings}
                    isPreview={true}
                  />
                </div>

                {/* Navigation Approval & Action Bar */}
                <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <label className="inline-flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={approveNavOnPublish}
                      onChange={(e) => setApproveNavOnPublish(e.target.checked)}
                      className="rounded border-zinc-700"
                    />
                    <span>
                      Approve this section to appear in the public sidebar navigation menu when published
                    </span>
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGeneratedDraft(null)}
                      className="px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveGeneratedSection(false)}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-100 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save as Draft</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveGeneratedSection(true)}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve &amp; Publish Now</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            3. AI WEBSITE EDITOR
            ================================================================== */}
        {activeTab === 'ai-editor' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-800 pb-5">
              <h2 className="text-2xl font-bold text-zinc-50">
                Natural Language AI Website Editor
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Modify existing sections, add entries, reorder sections, or update theme colors through plain English. The AI identifies the relevant section and modifies only the requested content without overwriting unrelated sections.
              </p>
            </div>

            <form
              onSubmit={handleRunAiWebsiteEditor}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5"
            >
              <div>
                <label
                  htmlFor="ai-editor-input"
                  className="block text-xs font-medium text-zinc-200 mb-2"
                >
                  What would you like to change on your website?
                </label>
                <textarea
                  id="ai-editor-input"
                  rows={3}
                  value={aiEditorInstruction}
                  onChange={(e) => setAiEditorInstruction(e.target.value)}
                  placeholder="e.g., Redesign my awards section with a beautiful timeline."
                  className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* All 8 Prompt Examples from User Request */}
              <div className="space-y-2">
                <p className="text-xs text-zinc-400">
                  Click any command below to populate and run:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Make my About Me section more professional.',
                    'Add my new professional experience.',
                    'Create a new section for my university extracurricular activities.',
                    'Redesign my awards section with a beautiful timeline.',
                    'Move my Education section above Professional Experience.',
                    'Add a new project to my portfolio.',
                    'Change the accent color from purple to blue.',
                    'Add my new artwork to the creative gallery.',
                  ].map((cmd, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiEditorInstruction(cmd)}
                      className="text-left px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 text-xs text-zinc-300 cursor-pointer"
                    >
                      “{cmd}”
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-4 text-xs text-zinc-300">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="applyMode"
                      checked={aiEditorMode === 'immediate'}
                      onChange={() => setAiEditorMode('immediate')}
                    />
                    <span>Apply &amp; Publish Immediately</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="applyMode"
                      checked={aiEditorMode === 'draft'}
                      onChange={() => setAiEditorMode('draft')}
                    />
                    <span>Save Section Edit as Draft First</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={aiEditorLoading}
                  className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-xs sm:text-sm font-medium text-white inline-flex items-center gap-2 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{aiEditorLoading ? 'Applying Changes...' : 'Run AI Website Editor'}</span>
                </button>
              </div>
            </form>

            {aiEditorResultSummary && (
              <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-800/70 text-xs text-emerald-200 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">AI Website Editor Completed</p>
                  <p className="mt-1 text-zinc-200">{aiEditorResultSummary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('published-changes')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 shrink-0 cursor-pointer"
                >
                  Preview Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            4. MANAGE SECTIONS (COMPLETE SECTION MANAGEMENT)
            ================================================================== */}
        {activeTab === 'manage-sections' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-zinc-50">Manage All Sections</h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Create, edit, duplicate, hide, publish/unpublish, rearrange, change layouts, or delete sections.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('ai-creator')}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Section</span>
              </button>
            </div>

            <div className="space-y-3">
              {[...sections]
                .sort((a, b) => a.navigationOrder - b.navigationOrder)
                .map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-zinc-500 tabular-nums">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-base font-semibold text-zinc-100">{sec.title}</h3>
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                        <span
                          className={`font-medium ${
                            sec.status === 'published'
                              ? 'text-emerald-400'
                              : sec.status === 'draft'
                              ? 'text-amber-400'
                              : 'text-zinc-500'
                          }`}
                        >
                          {sec.status.toUpperCase()}
                        </span>
                        {sec.hasUnpublishedDraft && (
                          <>
                            <span aria-hidden="true" className="text-zinc-600">·</span>
                            <span className="text-amber-300">Has Pending Draft</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">
                        Layout: <span className="text-zinc-200">{sec.layout}</span> · Placement:{' '}
                        <span className="text-zinc-200">{sec.placement}</span> · Menu Visible:{' '}
                        <span className="text-zinc-200">{sec.navigationVisible ? 'Yes' : 'No'}</span> · Items:{' '}
                        <span className="text-zinc-200 font-mono tabular-nums">
                          {sec.content.items.length}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Move ${sec.title} up`}
                        onClick={() => handleMoveSectionOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${sec.title} down`}
                        onClick={() => handleMoveSectionOrder(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSection(JSON.parse(JSON.stringify(resolveSectionForView(sec, true))))
                        }
                        className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateSection(sec.id)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate</span>
                      </button>
                      {sec.status !== 'published' ? (
                        <button
                          type="button"
                          onClick={() => handlePublishSection(sec.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white cursor-pointer"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateSectionStatus(sec, 'hidden')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide</span>
                        </button>
                      )}
                      {confirmDeleteId === sec.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeleteSection(sec.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-xs font-medium text-white cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          aria-label={`Delete ${sec.title}`}
                          onClick={() => setConfirmDeleteId(sec.id)}
                          className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-rose-400 hover:bg-rose-950/50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            5. NAVIGATION MANAGER
            ================================================================== */}
        {activeTab === 'navigation-manager' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-5">
              <h2 className="text-2xl font-bold text-zinc-50">Navigation &amp; Placement Manager</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Customize sidebar menu labels, control navigation visibility, and choose where each section appears (Homepage, Before/After another section, Inside another section, Footer, or Standalone Page).
              </p>
            </div>

            <div className="space-y-3">
              {[...sections]
                .sort((a, b) => a.navigationOrder - b.navigationOrder)
                .map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    <div className="md:col-span-3">
                      <p className="text-xs font-semibold text-zinc-100">{sec.title}</p>
                      <p className="text-[11px] text-zinc-500">Status: {sec.status}</p>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] text-zinc-400 mb-1">Menu Label</label>
                      <input
                        type="text"
                        value={sec.navigationLabel}
                        onChange={(e) => {
                          const updated = sections.map((s) =>
                            s.id === sec.id ? { ...s, navigationLabel: e.target.value } : s
                          );
                          setSections(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] text-zinc-400 mb-1">Placement</label>
                      <select
                        value={sec.placement}
                        onChange={(e) => {
                          const updated = sections.map((s) =>
                            s.id === sec.id
                              ? { ...s, placement: e.target.value as SectionPlacement }
                              : s
                          );
                          setSections(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                      >
                        {PLACEMENT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3 flex items-center justify-end gap-4">
                      <label className="inline-flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sec.navigationVisible}
                          onChange={(e) => {
                            const updated = sections.map((s) =>
                              s.id === sec.id ? { ...s, navigationVisible: e.target.checked } : s
                            );
                            setSections(updated);
                          }}
                        />
                        <span>In Menu</span>
                      </label>
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await fetch('/api/studio/sections-reorder', {
                            method: 'PUT',
                            headers: authHeaders(),
                            body: JSON.stringify({
                              items: sections.map((s, i) => ({
                                id: s.id,
                                navigationOrder: i + 1,
                                navigationVisible: s.navigationVisible,
                                homepageVisible: s.homepageVisible,
                                navigationLabel: s.navigationLabel,
                                placement: s.placement,
                                targetSectionId: s.targetSectionId,
                              })),
                            }),
                          });
                          if (res.ok) {
                            onPublicDataChanged();
                            showNotice(`Saved navigation settings for "${sec.title}".`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            6. PROJECTS MANAGER
            ================================================================== */}
        {activeTab === 'projects-manager' && projectsSection && (
          <div className="space-y-8">
            <div className="border-b border-zinc-800 pb-5">
              <h2 className="text-2xl font-bold text-zinc-50">Projects Manager</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Manage academic and web development projects displayed in your portfolio.
              </p>
            </div>

            {/* Add New Project Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newProjTitle.trim() || !newProjDesc.trim()) {
                  showNotice('Project title and description are required.', 'error');
                  return;
                }
                const newItem: SectionContentItem = {
                  id: `proj-${Date.now()}`,
                  title: newProjTitle.trim(),
                  subtitle: newProjSubtitle.trim() || 'Web Development Project',
                  category: 'Web Development',
                  period: '2026',
                  description: newProjDesc.trim(),
                  technologies: newProjTech
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                  imageUrl: newProjImage.trim() || media[2]?.url || '',
                  githubUrl: newProjGithub.trim(),
                  liveUrl: newProjLive.trim(),
                };
                const updatedContent = {
                  ...projectsSection.content,
                  items: [...projectsSection.content.items, newItem],
                };
                const res = await fetch(`/api/studio/sections/${projectsSection.id}`, {
                  method: 'PUT',
                  headers: authHeaders(),
                  body: JSON.stringify({ content: updatedContent }),
                });
                const data = await res.json();
                if (res.ok) {
                  setSections(data.sections);
                  setNewProjTitle('');
                  setNewProjSubtitle('');
                  setNewProjDesc('');
                  onPublicDataChanged();
                  showNotice(`Added project "${newItem.title}".`);
                }
              }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4"
            >
              <h3 className="text-base font-semibold text-zinc-100">Add New Portfolio Project</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="e.g. E-Commerce Dashboard in React.js"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Subtitle / Role</label>
                  <input
                    type="text"
                    value={newProjSubtitle}
                    onChange={(e) => setNewProjSubtitle(e.target.value)}
                    placeholder="e.g. Frontend Architecture · Nerobytes"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Describe the analytical problem, web solution, and impact..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProjTech}
                    onChange={(e) => setNewProjTech(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={newProjGithub}
                    onChange={(e) => setNewProjGithub(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Live Demo Link</label>
                  <input
                    type="text"
                    value={newProjLive}
                    onChange={(e) => setNewProjLive(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project to Portfolio</span>
              </button>
            </form>

            {/* Existing Projects List */}
            <div className="space-y-4">
              {projectsSection.content.items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-base font-semibold text-zinc-100">{item.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                    <p className="text-xs text-violet-400 mt-2">
                      {(item.technologies || []).join(' · ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const updatedItems = projectsSection.content.items.filter(
                        (i) => i.id !== item.id
                      );
                      const res = await fetch(`/api/studio/sections/${projectsSection.id}`, {
                        method: 'PUT',
                        headers: authHeaders(),
                        body: JSON.stringify({
                          content: { ...projectsSection.content, items: updatedItems },
                        }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setSections(data.sections);
                        onPublicDataChanged();
                        showNotice('Removed project entry.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-rose-400 text-xs hover:bg-rose-950/40 shrink-0 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            7. ACHIEVEMENTS MANAGER
            ================================================================== */}
        {activeTab === 'achievements-manager' && awardsSection && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-zinc-50">
                  Awards &amp; Achievements Manager
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Manage your verified honors and switch between Premium Award Cards and Timeline presentation.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const nextLayout: LayoutType =
                      awardsSection.layout === 'timeline' ? 'achievement-showcase' : 'timeline';
                    const res = await fetch(`/api/studio/sections/${awardsSection.id}`, {
                      method: 'PUT',
                      headers: authHeaders(),
                      body: JSON.stringify({ layout: nextLayout }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setSections(data.sections);
                      onPublicDataChanged();
                      showNotice(`Switched Awards layout to ${nextLayout}.`);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-violet-500 text-xs font-medium text-zinc-200 cursor-pointer"
                >
                  Current Layout: {awardsSection.layout} (Click to Toggle Timeline / Cards)
                </button>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newAwardTitle.trim() || !newAwardDesc.trim()) {
                  showNotice('Award title and description are required.', 'error');
                  return;
                }
                const newItem: SectionContentItem = {
                  id: `award-${Date.now()}`,
                  title: newAwardTitle.trim(),
                  subtitle: newAwardSubtitle.trim(),
                  period: newAwardPeriod.trim() || '2026',
                  organization: newAwardOrg.trim(),
                  category: 'Honor & Distinction',
                  description: newAwardDesc.trim(),
                };
                const res = await fetch(`/api/studio/sections/${awardsSection.id}`, {
                  method: 'PUT',
                  headers: authHeaders(),
                  body: JSON.stringify({
                    content: {
                      ...awardsSection.content,
                      items: [...awardsSection.content.items, newItem],
                    },
                  }),
                });
                const data = await res.json();
                if (res.ok) {
                  setSections(data.sections);
                  setNewAwardTitle('');
                  setNewAwardSubtitle('');
                  setNewAwardPeriod('');
                  setNewAwardOrg('');
                  setNewAwardDesc('');
                  onPublicDataChanged();
                  showNotice(`Added achievement "${newItem.title}".`);
                }
              }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4"
            >
              <h3 className="text-base font-semibold text-zinc-100">Add New Award or Achievement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Award Title</label>
                  <input
                    type="text"
                    value={newAwardTitle}
                    onChange={(e) => setNewAwardTitle(e.target.value)}
                    placeholder="e.g. Champion — Competition Name"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Organization / Event</label>
                  <input
                    type="text"
                    value={newAwardOrg}
                    onChange={(e) => setNewAwardOrg(e.target.value)}
                    placeholder="Issuing body"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Year / Period</label>
                  <input
                    type="text"
                    value={newAwardPeriod}
                    onChange={(e) => setNewAwardPeriod(e.target.value)}
                    placeholder="e.g. 2017"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newAwardDesc}
                  onChange={(e) => setNewAwardDesc(e.target.value)}
                  placeholder="Describe the significance of this award..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Award</span>
              </button>
            </form>

            <div className="space-y-3">
              {awardsSection.content.items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-violet-400 font-mono">{item.period}</p>
                    <h4 className="text-base font-semibold text-zinc-100 mt-0.5">{item.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            8. MEDIA LIBRARY
            ================================================================== */}
        {activeTab === 'media-library' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-800 pb-5">
              <h2 className="text-2xl font-bold text-zinc-50">Media &amp; Artwork Library</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Manage profile portraits, project visuals, and reference sketches. Add new artwork directly to your Creative Interests gallery.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newMediaTitle.trim() || !newMediaUrl.trim()) {
                  showNotice('Please enter an artwork/media title and image URL.', 'error');
                  return;
                }
                const res = await fetch('/api/studio/media', {
                  method: 'POST',
                  headers: authHeaders(),
                  body: JSON.stringify({
                    title: newMediaTitle,
                    url: newMediaUrl,
                    category: newMediaCategory,
                    caption: newMediaCaption,
                    addToCreativeSection: addMediaToCreative,
                  }),
                });
                const data = await res.json();
                if (res.ok) {
                  setMedia(data.media);
                  setSections(data.sections);
                  setNewMediaTitle('');
                  setNewMediaUrl('');
                  setNewMediaCaption('');
                  onPublicDataChanged();
                  showNotice('Added media asset to library.');
                }
              }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4"
            >
              <h3 className="text-base font-semibold text-zinc-100">Add Artwork, Photo or Visual Asset</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newMediaTitle}
                    onChange={(e) => setNewMediaTitle(e.target.value)}
                    placeholder="e.g. Graphite Architectural Sketch"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Image URL / Asset Path</label>
                  <input
                    type="text"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="/src/assets/images/..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Category</label>
                  <select
                    value={newMediaCategory}
                    onChange={(e) =>
                      setNewMediaCategory(
                        e.target.value as 'artwork' | 'project' | 'gallery' | 'portrait'
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  >
                    <option value="artwork">Artwork / Sketch by Reference</option>
                    <option value="project">Project Visual</option>
                    <option value="gallery">Event / University Photograph</option>
                    <option value="portrait">Profile Portrait</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Caption / Story</label>
                <input
                  type="text"
                  value={newMediaCaption}
                  onChange={(e) => setNewMediaCaption(e.target.value)}
                  placeholder="Optional caption describing medium or event"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addMediaToCreative}
                    onChange={(e) => setAddMediaToCreative(e.target.checked)}
                  />
                  <span>Also showcase in “Creative Interests” gallery section</span>
                </label>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white cursor-pointer"
                >
                  Save to Media Library
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {media.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between"
                >
                  <div className="aspect-video bg-zinc-950 overflow-hidden">
                    <img
                      src={m.url}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-[11px] text-violet-400 uppercase">{m.category}</p>
                    <h4 className="text-xs font-semibold text-zinc-100">{m.title}</h4>
                    <p className="text-[11px] text-zinc-400">{m.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            9. DRAFTS & APPROVAL WORKSPACE
            ================================================================== */}
        {activeTab === 'drafts' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-zinc-50">
                  Drafts &amp; Pre-Publish Preview
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Public visitors never see draft sections or unpublished section edits until you approve and publish them here.
                </p>
              </div>
              {renderViewportControls()}
            </div>

            {draftSectionsList.length === 0 ? (
              <div className="p-10 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center space-y-3">
                <p className="text-sm font-medium text-zinc-200">
                  No pending drafts at the moment.
                </p>
                <p className="text-xs text-zinc-400">
                  All portfolio sections are currently published and up to date.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-creator')}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-xs font-medium text-white cursor-pointer"
                >
                  Create a Draft with AI Section Creator
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {draftSectionsList.map((sec) => {
                  const previewSec = resolveSectionForView(sec, true);
                  return (
                    <div
                      key={sec.id}
                      className="p-6 rounded-2xl bg-zinc-900/50 border border-amber-500/40 space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                        <div>
                          <span className="text-xs font-medium text-amber-400">
                            {sec.status === 'draft'
                              ? 'New Draft Section (Unpublished)'
                              : 'Pending Draft Edit on Published Section'}
                          </span>
                          <h3 className="text-lg font-bold text-zinc-50 mt-0.5">
                            {previewSec.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingSection(JSON.parse(JSON.stringify(previewSec)))
                            }
                            className="px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Before Publishing</span>
                          </button>

                          {sec.hasUnpublishedDraft ? (
                            <button
                              type="button"
                              onClick={() => handleDiscardDraft(sec.id)}
                              className="px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-rose-300 cursor-pointer"
                            >
                              Discard Draft Changes
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDeleteSection(sec.id)}
                              className="px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-rose-300 cursor-pointer"
                            >
                              Discard Draft
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handlePublishSection(sec.id, true)}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Publish &amp; Add to Menu</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePublishSection(sec.id, false)}
                            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Publish (Homepage Only)</span>
                          </button>
                        </div>
                      </div>

                      <div
                        className={`mx-auto rounded-xl border border-zinc-800 bg-[#09090b] px-6 transition-all ${
                          previewViewport === 'mobile'
                            ? 'max-w-[390px]'
                            : previewViewport === 'tablet'
                            ? 'max-w-[768px]'
                            : 'w-full'
                        }`}
                      >
                        <DynamicSectionRenderer
                          section={previewSec}
                          settings={settings}
                          isPreview={true}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            10. PUBLISHED CHANGES & AUDIT LOG
            ================================================================== */}
        {activeTab === 'published-changes' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-zinc-50">
                  Published Changes &amp; Live Website Preview
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Inspect live public state across Desktop, Tablet, and Mobile, or roll back to an earlier snapshot.
                </p>
              </div>
              {renderViewportControls()}
            </div>

            <div
              className={`mx-auto border border-zinc-800 rounded-xl overflow-hidden bg-[#09090b] transition-all ${
                previewViewport === 'mobile'
                  ? 'max-w-[390px]'
                  : previewViewport === 'tablet'
                  ? 'max-w-[768px]'
                  : 'w-full'
              } max-h-[500px] overflow-y-auto`}
            >
              <PublicPortfolioView
                settings={settings}
                sections={sections}
                includeDrafts={false}
                forcedViewport={previewViewport}
                isEmbeddedPreview={true}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-100">Publication Audit Log</h3>
              {auditLog.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-zinc-100">{entry.sectionTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-violet-400 uppercase text-[11px]">{entry.action}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-zinc-500 tabular-nums">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{entry.summary}</p>
                  </div>

                  {entry.previousSectionsSnapshot && (
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await fetch(`/api/studio/audit/${entry.id}/rollback`, {
                          method: 'POST',
                          headers: authHeaders(),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setSections(data.sections);
                          setAuditLog(data.auditLog);
                          onPublicDataChanged();
                          showNotice('Restored portfolio snapshot.');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Snapshot</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            11. WEBSITE SETTINGS (DESIGN SYSTEM & CONTACT CONFIG)
            ================================================================== */}
        {activeTab === 'website-settings' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-800 pb-5">
              <h2 className="text-2xl font-bold text-zinc-50">
                Website Settings &amp; Design System
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Customize your accent color, typography (Poppins, Montserrat, Lato), professional summary, and contact details.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await fetch('/api/studio/settings', {
                  method: 'PUT',
                  headers: authHeaders(),
                  body: JSON.stringify(settings),
                });
                const data = await res.json();
                if (res.ok) {
                  setSettings(data.settings);
                  setAuditLog(data.auditLog);
                  onPublicDataChanged();
                  showNotice('Saved website settings and design system preferences.');
                }
              }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">
                    Primary Accent Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['violet', 'blue', 'emerald', 'amber', 'rose'] as AccentColor[]).map(
                      (col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setSettings({ ...settings, accentColor: col })}
                          className={`px-3.5 py-2 rounded-lg text-xs font-medium capitalize border cursor-pointer ${
                            settings.accentColor === col
                              ? 'bg-zinc-100 text-zinc-950 border-white'
                              : 'bg-zinc-950 text-zinc-300 border-zinc-800'
                          }`}
                        >
                          {col}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">
                    Typography Family
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['Poppins', 'Montserrat', 'Lato'] as FontFamilyChoice[]).map((font) => (
                      <button
                        key={font}
                        type="button"
                        onClick={() => setSettings({ ...settings, fontFamily: font })}
                        className={`px-3.5 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
                          settings.fontFamily === font
                            ? 'bg-zinc-100 text-zinc-950 border-white'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-800'
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={settings.ownerName}
                    onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Professional Summary</label>
                <textarea
                  rows={3}
                  value={settings.professionalSummary}
                  onChange={(e) =>
                    setSettings({ ...settings, professionalSummary: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={settings.githubUrl}
                    onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={settings.linkedinUrl}
                    onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white inline-flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Website Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================
            12. SECURITY SETTINGS
            ================================================================== */}
        {activeTab === 'security-settings' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-800 pb-5">
              <h2 className="text-2xl font-bold text-zinc-50">
                Security &amp; Owner Access Settings
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Server-side session authentication, password management, and access audit logs.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await fetch('/api/auth/change-password', {
                  method: 'POST',
                  headers: authHeaders(),
                  body: JSON.stringify({ currentPassword, newPassword }),
                });
                const data = await res.json();
                if (!res.ok) {
                  showNotice(data.error || 'Password update failed', 'error');
                  return;
                }
                setCurrentPassword('');
                setNewPassword('');
                showNotice('Updated owner passphrase.');
              }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4 max-w-xl"
            >
              <h3 className="text-base font-semibold text-zinc-100">Change Studio Passphrase</h3>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Current Passphrase</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  New Passphrase (minimum 8 characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white cursor-pointer"
              >
                Update Security Passphrase
              </button>
            </form>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-100">Recent Authentication Log</h3>
                <button
                  type="button"
                  onClick={async () => {
                    await fetch('/api/auth/revoke-other-sessions', {
                      method: 'POST',
                      headers: authHeaders(),
                    });
                    showNotice('Revoked all other active sessions.');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-white cursor-pointer"
                >
                  Revoke Other Sessions
                </button>
              </div>
              <div className="space-y-2">
                {(securityInfo?.loginHistory || []).slice(0, 6).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <span
                      className={
                        item.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {item.status.toUpperCase()} LOGIN
                    </span>
                    <span className="font-mono text-zinc-500 tabular-nums">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          SECTION EDITOR MODAL (COMPLETE SECTION EDITING & SUBSECTIONS)
          ==================================================================== */}
      {editingSection && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-sec-modal-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 id="edit-sec-modal-title" className="text-lg font-bold text-zinc-50">
                Edit Section: {editingSection.title}
              </h3>
              <button
                type="button"
                aria-label="Close section editor"
                onClick={() => setEditingSection(null)}
                className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Section Title</label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Menu Label</label>
                <input
                  type="text"
                  value={editingSection.navigationLabel}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, navigationLabel: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Layout</label>
                <select
                  value={editingSection.layout}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      layout: e.target.value as LayoutType,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                >
                  {LAYOUT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Placement</label>
                <select
                  value={editingSection.placement}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      placement: e.target.value as SectionPlacement,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                >
                  {PLACEMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1">Subtitle</label>
              <input
                type="text"
                value={editingSection.subtitle || ''}
                onChange={(e) =>
                  setEditingSection({ ...editingSection, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1">Lead Paragraph</label>
              <textarea
                rows={3}
                value={editingSection.content.leadParagraph || ''}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      leadParagraph: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
              />
            </div>

            {/* Add Subsection inside Editor */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200">
                  Subsections ({editingSection.content.subsections.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingSection({
                      ...editingSection,
                      content: {
                        ...editingSection.content,
                        subsections: [
                          ...editingSection.content.subsections,
                          {
                            id: `sub-${Date.now()}`,
                            title: 'New Subsection',
                            body: 'Subsection details...',
                          },
                        ],
                      },
                    })
                  }
                  className="text-xs text-violet-400 hover:underline cursor-pointer"
                >
                  + Add Subsection
                </button>
              </div>
              {editingSection.content.subsections.map((sub, sIdx) => (
                <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={sub.title}
                    onChange={(e) => {
                      const nextSubs = [...editingSection.content.subsections];
                      nextSubs[sIdx] = { ...sub, title: e.target.value };
                      setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, subsections: nextSubs },
                      });
                    }}
                    className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                  <input
                    type="text"
                    value={sub.body}
                    onChange={(e) => {
                      const nextSubs = [...editingSection.content.subsections];
                      nextSubs[sIdx] = { ...sub, body: e.target.value };
                      setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, subsections: nextSubs },
                      });
                    }}
                    className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveEditedSection(true)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-100 cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveEditedSection(false)}
                className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white cursor-pointer"
              >
                Save &amp; Publish Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
