import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  Code2,
  ExternalLink,
  FolderGit2,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  MessageSquare,
  Palette,
  Phone,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import {
  SectionContentItem,
  SectionData,
  SiteSettings,
} from '../types/portfolio';

interface DynamicSectionRendererProps {
  section: SectionData;
  settings: SiteSettings;
  embeddedChildren?: SectionData[];
  onSelectItemModal?: (item: SectionContentItem, sectionTitle: string) => void;
  isPreview?: boolean;
}

export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({
  section,
  settings,
  embeddedChildren = [],
  onSelectItemModal,
  isPreview = false,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [contactFeedback, setContactFeedback] = useState('');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (key: string) => {
    setImgErrors((prev) => ({ ...prev, [key]: true }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactStatus('error');
      setContactFeedback('Please fill in your name, email address, and message.');
      return;
    }
    if (!contactEmail.includes('@')) {
      setContactStatus('error');
      setContactFeedback('Please enter a valid email address.');
      return;
    }

    setContactStatus('sending');
    setContactFeedback('');
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject || 'Portfolio Inquiry',
          message: contactMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      setContactStatus('success');
      setContactFeedback(data.message || 'Thank you! Your message has been sent.');
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch (err) {
      setContactStatus('error');
      setContactFeedback(err instanceof Error ? err.message : 'Unable to send message right now.');
    }
  };

  const getSectionIcon = () => {
    switch (section.sectionType) {
      case 'education':
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'experience':
        return <Briefcase className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'skills':
        return <Code2 className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'projects':
        return <FolderGit2 className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'awards':
        return <Award className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'leadership':
        return <Users className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'creative':
        return <Palette className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'languages':
        return <Globe className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'contact':
        return <Mail className="w-4 h-4 text-[var(--accent-secondary)]" />;
      case 'about':
        return <BookOpen className="w-4 h-4 text-[var(--accent-secondary)]" />;
      default:
        return <Layers className="w-4 h-4 text-[var(--accent-secondary)]" />;
    }
  };

  // ==========================================================================
  // 1. HOME / PROFILE HERO LAYOUT
  // ==========================================================================
  if (section.sectionType === 'home' || section.layout === 'profile') {
    return (
      <section
        id={section.slug}
        aria-label={section.title}
        className="py-12 lg:py-20 border-b border-zinc-800/80"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-medium tracking-wider text-[var(--accent-secondary)]">
                {settings.heroGreeting}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-zinc-50 leading-[1.12]">
                {settings.ownerName}
              </h1>
              <p className="text-base sm:text-lg font-medium text-zinc-300">
                {settings.identities.join(' · ')}
              </p>
              <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
                {section.content.leadParagraph || settings.professionalSummary}
              </p>
              {section.content.paragraphs.map((p, idx) => (
                <p key={idx} className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                  {p}
                </p>
              ))}
            </div>

            {/* Primary Actions & Social Links */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-[var(--accent-primary)] hover:opacity-95 transition-opacity inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>View Projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-lg text-sm font-medium text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  Contact Me
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 pt-2 border-t border-zinc-800/70">
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-zinc-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                  <span>{settings.email}</span>
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                  <span>{settings.location}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Portrait Container */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 h-full min-h-[340px] flex flex-col justify-end">
              {!imgErrors['hero-portrait'] && settings.profileImageUrl ? (
                <img
                  src={settings.profileImageUrl}
                  alt={`${settings.ownerName} — Mathematics Postgraduate and Web Developer`}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError('hero-portrait')}
                  className="w-full h-full object-cover aspect-square lg:aspect-auto"
                />
              ) : (
                <div className="w-full h-full min-h-[340px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-[var(--accent-muted)] border border-[var(--accent-border)] flex items-center justify-center text-2xl font-bold text-[var(--accent-secondary)] mb-4">
                    AIM
                  </div>
                  <p className="text-base font-semibold text-zinc-100">{settings.ownerName}</p>
                  <p className="text-xs text-zinc-400 mt-1">M.Sc. in Mathematics · React.js Developer</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                <p className="text-xs text-zinc-300 font-medium">
                  {settings.ownerName}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  M.Sc. &amp; B.Sc. (Honours) in Mathematics, University of Chittagong · Developer at Nerobytes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Core Pillars Strip Below Hero Split */}
        {section.content.items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-10 border-t border-zinc-800/70">
            {section.content.items.map((pillar, idx) => (
              <div
                key={pillar.id || idx}
                className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
              >
                <div className="text-xs text-zinc-400 flex items-center gap-2 mb-2">
                  <span className="font-mono text-[var(--accent-secondary)] tabular-nums">
                    0{idx + 1}.
                  </span>
                  <span>{pillar.organization}</span>
                </div>
                <h2 className="text-base font-semibold text-zinc-100">{pillar.title}</h2>
                {pillar.subtitle && (
                  <p className="text-xs text-zinc-300 mt-1">{pillar.subtitle}</p>
                )}
                <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  // Standard Header for non-Home sections
  const renderSectionHeader = () => (
    <div className="mb-10 space-y-2.5">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        {getSectionIcon()}
        <span>{section.navigationLabel || section.title}</span>
        {section.layout && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-500 capitalize">{section.layout.replace('-', ' ')}</span>
          </>
        )}
        {isPreview && section.status === 'draft' && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-medium">Draft Preview</span>
          </>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50">
        {section.title}
      </h2>
      {section.subtitle && (
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
          {section.subtitle}
        </p>
      )}
    </div>
  );

  // ==========================================================================
  // 2. CONTACT SECTION LAYOUT
  // ==========================================================================
  if (section.sectionType === 'contact') {
    return (
      <section
        id={section.slug}
        aria-label={section.title}
        className="py-14 border-b border-zinc-800/80"
      >
        {renderSectionHeader()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Channels */}
          <div className="lg:col-span-5 space-y-6">
            {section.content.leadParagraph && (
              <p className="text-zinc-300 text-base leading-relaxed">
                {section.content.leadParagraph}
              </p>
            )}
            {section.content.paragraphs.map((p, i) => (
              <p key={i} className="text-zinc-400 text-sm leading-relaxed">
                {p}
              </p>
            ))}

            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-4">
                <Mail className="w-5 h-5 text-[var(--accent-secondary)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Email</h3>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-sm text-[var(--accent-secondary)] hover:underline break-all"
                  >
                    {settings.email}
                  </a>
                  <p className="text-xs text-zinc-400 mt-1">
                    Direct inbox for engineering roles, projects, and academic collaboration.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-4">
                <Phone className="w-5 h-5 text-[var(--accent-secondary)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">WhatsApp &amp; Direct</h3>
                  <p className="text-sm text-zinc-200 tabular-nums">{settings.whatsapp}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Configurable in Mahim Private Studio Website Settings.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[var(--accent-secondary)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Location</h3>
                  <p className="text-sm text-zinc-200">{settings.location}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Developer at Nerobytes · University of Chittagong Alumnus
                  </p>
                </div>
              </div>
            </div>

            {/* External Profiles */}
            <div className="pt-2">
              <h3 className="text-xs font-medium text-zinc-400 mb-3">Social &amp; Code Profiles</h3>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 inline-flex items-center gap-2 transition-colors"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 inline-flex items-center gap-2 transition-colors"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleContactSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Delivered directly to Ahmed Imtiaz Mahim’s Private Studio inbox.
                  </p>
                </div>
                <MessageSquare className="w-5 h-5 text-[var(--accent-secondary)]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`contact-name-${section.id}`}
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id={`contact-name-${section.id}`}
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Dr. Rahman / Recruiter"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`contact-email-${section.id}`}
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id={`contact-email-${section.id}`}
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`contact-subject-${section.id}`}
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Subject
                </label>
                <input
                  id={`contact-subject-${section.id}`}
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="Web Development Opportunity / Research Collaboration"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor={`contact-message-${section.id}`}
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id={`contact-message-${section.id}`}
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Write your message for Ahmed Imtiaz Mahim..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              {contactFeedback && (
                <div
                  role="status"
                  className={`p-3.5 rounded-lg text-xs flex items-center gap-2 ${
                    contactStatus === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-800/70 text-emerald-200'
                      : 'bg-rose-950/60 border border-rose-800/70 text-rose-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{contactFeedback}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={contactStatus === 'sending'}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--accent-primary)] hover:opacity-95 disabled:opacity-50 transition-opacity inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{contactStatus === 'sending' ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================================
  // 3. UNIFIED RENDERING FOR ALL 11 SUPPORTED LAYOUTS
  // ==========================================================================
  return (
    <section
      id={section.slug}
      aria-label={section.title}
      className="py-14 border-b border-zinc-800/80"
    >
      {renderSectionHeader()}

      {/* Lead & Editorial Paragraphs */}
      {(section.content.leadParagraph || section.content.paragraphs.length > 0) && (
        <div className="max-w-3xl space-y-4 mb-10">
          {section.content.leadParagraph && (
            <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-normal">
              {section.content.leadParagraph}
            </p>
          )}
          {section.content.paragraphs.map((p, idx) => (
            <p key={idx} className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Skill Categories Grid (when section has structured categories, e.g. Technical Skills) */}
      {section.content.categories && section.content.categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {section.content.categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/80"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/70">
                <h3 className="text-base font-semibold text-zinc-100">{cat.name}</h3>
                <span className="text-xs font-mono text-zinc-400 tabular-nums">
                  {cat.skills.length} {cat.skills.length === 1 ? 'skill' : 'skills'}
                </span>
              </div>
              <ul className="space-y-2.5">
                {cat.skills.map((skill, sIdx) => (
                  <li
                    key={sIdx}
                    className="text-sm text-zinc-300 flex items-center justify-between py-1"
                  >
                    <span>{skill}</span>
                    <span className="text-xs text-zinc-500 font-mono">Verified CV</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* LAYOUT A: TIMELINE & EXPERIENCE-TIMELINE */}
      {(section.layout === 'timeline' || section.layout === 'experience-timeline') &&
        section.content.items.length > 0 && (
          <div className="relative pl-6 sm:pl-8 border-l border-zinc-800 space-y-10">
            {section.content.items.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                <div
                  className="absolute -left-[29px] sm:-left-[37px] top-1.5 w-3 h-3 rounded-full bg-zinc-950 border-2 border-[var(--accent-primary)]"
                  aria-hidden="true"
                />
                <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-2">
                    {item.period && (
                      <span className="font-mono text-[var(--accent-secondary)] tabular-nums">
                        {item.period}
                      </span>
                    )}
                    {item.period && (item.organization || item.category) && (
                      <span aria-hidden="true">·</span>
                    )}
                    {item.organization && <span className="text-zinc-300">{item.organization}</span>}
                    {item.location && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{item.location}</span>
                      </>
                    )}
                    {item.category && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{item.category}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-100">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-sm text-zinc-300 mt-0.5">{item.subtitle}</p>
                  )}
                  <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                    {item.description}
                  </p>

                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="mt-4 space-y-1.5 border-t border-zinc-800/70 pt-3">
                      {item.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2">
                          <span className="text-[var(--accent-secondary)] select-none">—</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <span className="text-zinc-500">Technologies:</span>
                      {item.technologies.map((tech, tIdx) => (
                        <React.Fragment key={tIdx}>
                          {tIdx > 0 && <span aria-hidden="true">·</span>}
                          <span className="text-zinc-300">{tech}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* LAYOUT B: PROJECT SHOWCASE */}
      {section.layout === 'project-showcase' && section.content.items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {section.content.items.map((item, idx) => {
            const imgKey = `proj-${item.id || idx}`;
            return (
              <article
                key={item.id || idx}
                className="rounded-2xl bg-zinc-900/40 border border-zinc-800/90 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="relative aspect-video bg-zinc-950 border-b border-zinc-800/80 overflow-hidden">
                    {item.imageUrl && !imgErrors[imgKey] ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(imgKey)}
                        className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-900 to-zinc-950">
                        <FolderGit2 className="w-8 h-8 text-[var(--accent-secondary)] mb-2" />
                        <span className="text-xs text-zinc-400">{item.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-2">
                      <span>{item.category || 'Project'}</span>
                      {item.period && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{item.period}</span>
                        </>
                      )}
                      {item.organization && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.organization}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-zinc-100">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-xs text-zinc-300 mt-1">{item.subtitle}</p>
                    )}
                    <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                      {item.description}
                    </p>

                    {item.technologies && item.technologies.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-800/70 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                        {item.technologies.map((tech, tIdx) => (
                          <React.Fragment key={tIdx}>
                            {tIdx > 0 && <span aria-hidden="true" className="text-zinc-600">·</span>}
                            <span>{tech}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-zinc-950/50 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-300 hover:text-white inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>GitHub Repository</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        className="text-[var(--accent-secondary)] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>Live Demo / Reference</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {onSelectItemModal && (
                    <button
                      type="button"
                      onClick={() => onSelectItemModal(item, section.title)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                      <span>Inspect Details</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* LAYOUT C: ACHIEVEMENT SHOWCASE */}
      {section.layout === 'achievement-showcase' && section.content.items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.content.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-6 sm:p-7 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[var(--accent-border)] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--accent-secondary)] font-medium">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>{item.category || 'Distinction'}</span>
                    {item.period && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{item.period}</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 tabular-nums">
                    #0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-100">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-xs text-zinc-300 mt-1">{item.subtitle}</p>
                )}
                <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.organization && (
                <div className="mt-5 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-xs text-zinc-400">
                  <span>{item.organization}</span>
                  {onSelectItemModal && (
                    <button
                      type="button"
                      onClick={() => onSelectItemModal(item, section.title)}
                      className="text-[var(--accent-secondary)] hover:underline cursor-pointer"
                    >
                      View Citation
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LAYOUT D: IMAGE GALLERY / CREATIVE INTERESTS */}
      {section.layout === 'gallery' && section.content.items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {section.content.items.map((item, idx) => {
            const imgKey = `gal-${item.id || idx}`;
            return (
              <div
                key={item.id || idx}
                className="rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/90 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                  {item.imageUrl && !imgErrors[imgKey] ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(imgKey)}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                      <Palette className="w-8 h-8 text-[var(--accent-secondary)] mb-2" />
                      <span className="text-xs text-zinc-400">{item.title}</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-zinc-400 mb-1.5">
                      <span>{item.category || 'Creative Work'}</span>
                      {item.subtitle && (
                        <>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span>{item.subtitle}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-100">{item.title}</h3>
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {onSelectItemModal && (
                    <div className="mt-4 pt-3 border-t border-zinc-800/70">
                      <button
                        type="button"
                        onClick={() => onSelectItemModal(item, section.title)}
                        className="text-xs font-medium text-[var(--accent-secondary)] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open Artwork Lightbox</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LAYOUT E: CARDS, GRID, EDITORIAL, STATISTICS, CUSTOM-COMBINATION */}
      {(section.layout === 'cards' ||
        section.layout === 'grid' ||
        section.layout === 'editorial' ||
        section.layout === 'statistics' ||
        section.layout === 'custom-combination') &&
        section.content.items.length > 0 && (
          <div
            className={`grid grid-cols-1 ${
              section.content.items.length === 3
                ? 'md:grid-cols-3'
                : 'md:grid-cols-2'
            } gap-6`}
          >
            {section.content.items.map((item, idx) => {
              const imgKey = `card-${item.id || idx}`;
              return (
                <div
                  key={item.id || idx}
                  className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {item.imageUrl && section.layout === 'custom-combination' && !imgErrors[imgKey] && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 border border-zinc-800">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(imgKey)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-2">
                      <span>{item.category || item.organization || `0${idx + 1}`}</span>
                      {item.period && (
                        <span className="font-mono text-[var(--accent-secondary)] tabular-nums">
                          {item.period}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-base font-semibold text-zinc-100">{item.title}</h3>
                      {item.metricValue && (
                        <span className="text-xs font-mono text-[var(--accent-secondary)] tabular-nums shrink-0">
                          {item.metricValue}
                        </span>
                      )}
                    </div>

                    {item.subtitle && item.subtitle !== item.metricValue && (
                      <p className="text-xs text-zinc-300 mt-1">{item.subtitle}</p>
                    )}

                    <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Subsections (if any) */}
      {section.content.subsections && section.content.subsections.length > 0 && (
        <div className="mt-8 space-y-4">
          {section.content.subsections.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/70"
            >
              <h4 className="text-sm font-semibold text-zinc-200">{sub.title}</h4>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
                {sub.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* External Links (if any) */}
      {section.content.externalLinks && section.content.externalLinks.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {section.content.externalLinks.map((ext) => (
            <a
              key={ext.id}
              href={ext.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[var(--accent-secondary)] hover:underline inline-flex items-center gap-1.5"
            >
              <span>{ext.label}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      )}

      {/* Embedded Child Sections (placed 'inside-section') */}
      {embeddedChildren.length > 0 && (
        <div className="mt-10 pt-8 border-t border-zinc-800/70 space-y-8">
          {embeddedChildren.map((child) => (
            <div key={child.id} className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
              <div className="text-xs text-[var(--accent-secondary)] mb-1">
                Subsection · {child.title}
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">{child.title}</h3>
              {child.content.leadParagraph && (
                <p className="text-sm text-zinc-300 mt-2">{child.content.leadParagraph}</p>
              )}
              {child.content.items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {child.content.items.map((cItem) => (
                    <div key={cItem.id} className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/70">
                      <h4 className="text-sm font-medium text-zinc-100">{cItem.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{cItem.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Subtle Callout Note */}
      {section.content.calloutNote && (
        <p className="mt-6 text-xs text-zinc-500 italic">
          {section.content.calloutNote}
        </p>
      )}
    </section>
  );
};
