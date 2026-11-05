import React, { useEffect, useState } from 'react';
import {
  ExternalLink,
  Mail,
  Menu,
  X,
  ArrowLeft,
  MapPin,
} from 'lucide-react';
import {
  SectionContentItem,
  SectionData,
  SiteSettings,
} from '../types/portfolio';
import {
  getChildSectionsForParent,
  getFooterPlacedSections,
  getVisibleHomepageSections,
  getVisibleNavigationSections,
} from '../utils/portfolioEngine';
import { DynamicSectionRenderer } from './DynamicSectionRenderer';

interface PublicPortfolioViewProps {
  settings: SiteSettings;
  sections: SectionData[];
  includeDrafts?: boolean;
  forcedViewport?: 'desktop' | 'tablet' | 'mobile';
  isEmbeddedPreview?: boolean;
}

export const PublicPortfolioView: React.FC<PublicPortfolioViewProps> = ({
  settings,
  sections,
  includeDrafts = false,
  forcedViewport,
  isEmbeddedPreview = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string>('home');
  const [standaloneSlug, setStandaloneSlug] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<{
    item: SectionContentItem;
    sectionTitle: string;
  } | null>(null);

  const navSections = getVisibleNavigationSections(sections, includeDrafts);
  const homepageSections = getVisibleHomepageSections(sections, includeDrafts);
  const footerSections = getFooterPlacedSections(sections, includeDrafts);
  const standaloneSections = sections.filter(
    (s) =>
      (includeDrafts ? s.status !== 'hidden' : s.status === 'published') &&
      s.placement === 'standalone-page'
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      setStandaloneSlug(pageParam);
    }
  }, []);

  useEffect(() => {
    if (forcedViewport) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (let i = homepageSections.length - 1; i >= 0; i--) {
        const sec = homepageSections[i];
        const el = document.getElementById(sec.slug);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSlug(sec.slug);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [homepageSections, forcedViewport]);

  const handleNavClick = (sec: SectionData, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (sec.placement === 'standalone-page') {
      e.preventDefault();
      setStandaloneSlug(sec.slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (standaloneSlug) {
      setStandaloneSlug(null);
    }
    setActiveSlug(sec.slug);
  };

  const activeStandaloneSection = standaloneSlug
    ? sections.find((s) => s.slug === standaloneSlug)
    : null;

  const isSimulatedMobile = forcedViewport === 'mobile' || forcedViewport === 'tablet';

  return (
    <div
      data-accent={settings.accentColor}
      data-font={settings.fontFamily}
      className="min-h-screen bg-[#09090b] text-[#f4f4f6] flex flex-col lg:flex-row relative"
    >
      {/* ====================================================================
          MOBILE / TABLET RESPONSIVE HEADER (<= 15% viewport height)
          ==================================================================== */}
      <header
        className={`${
          isSimulatedMobile ? 'flex' : 'flex lg:hidden'
        } sticky top-0 z-30 h-14 px-5 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/90 items-center justify-between gap-4`}
      >
        <a
          href="#home"
          onClick={() => setStandaloneSlug(null)}
          className="text-sm font-bold tracking-tight text-zinc-100 whitespace-nowrap shrink-0"
        >
          {settings.ownerName}
        </a>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={() => setStandaloneSlug(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[var(--accent-primary)] whitespace-nowrap shrink-0"
          >
            Contact
          </a>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Collapsible Drawer */}
      {mobileMenuOpen && (
        <div
          className={`${
            isSimulatedMobile ? 'block' : 'block lg:hidden'
          } fixed inset-x-0 top-14 bottom-0 z-40 bg-[#09090b]/98 border-b border-zinc-800 overflow-y-auto p-6`}
        >
          <div className="mb-6 pb-4 border-b border-zinc-800">
            <p className="text-sm font-semibold text-zinc-100">{settings.ownerName}</p>
            <p className="text-xs text-zinc-400 mt-1">
              Mathematics Postgraduate · Web Developer
            </p>
          </div>
          <nav aria-label="Mobile Navigation" className="space-y-1">
            {navSections.map((sec, idx) => (
              <a
                key={sec.id}
                href={`#${sec.slug}`}
                onClick={(e) => handleNavClick(sec, e)}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm transition-colors ${
                  activeSlug === sec.slug
                    ? 'bg-[var(--accent-muted)] text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                }`}
              >
                <span>{sec.navigationLabel || sec.title}</span>
                <span className="text-xs font-mono text-zinc-500 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* ====================================================================
          DESKTOP FIXED LEFT SIDEBAR (20% WIDTH)
          ==================================================================== */}
      {!isSimulatedMobile && (
        <aside
          aria-label={isEmbeddedPreview ? 'Preview Sidebar Navigation' : 'Portfolio Sidebar Navigation'}
          className={`hidden lg:flex lg:flex-col lg:justify-between ${
            isEmbeddedPreview
              ? 'lg:w-[24%] lg:shrink-0 border-r border-zinc-800/90'
              : 'lg:w-[20%] lg:min-w-[250px] lg:max-w-[310px] lg:fixed lg:inset-y-0 lg:left-0 z-20'
          } bg-[#0c0c0f] border-r border-zinc-800/90 px-6 py-8 overflow-y-auto`}
        >
          <div className="space-y-8">
            {/* Identity Lockup */}
            <div className="space-y-2 pb-6 border-b border-zinc-800/80">
              <a
                href="#home"
                onClick={() => setStandaloneSlug(null)}
                className="block text-lg font-bold tracking-tight text-zinc-50 hover:text-[var(--accent-secondary)] transition-colors"
              >
                {settings.ownerName}
              </a>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Mathematics Postgraduate · Web &amp; React.js Developer
              </p>
              <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3 h-3 text-[var(--accent-secondary)] shrink-0" />
                <span>{settings.location}</span>
              </p>
            </div>

            {/* Section Navigation Links */}
            <nav aria-label={isEmbeddedPreview ? 'Preview Sections' : 'Primary Portfolio Sections'} className="space-y-1">
              {navSections.map((sec, idx) => {
                const isActive =
                  standaloneSlug === sec.slug || (!standaloneSlug && activeSlug === sec.slug);
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.slug}`}
                    onClick={(e) => handleNavClick(sec, e)}
                    className={`group flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[var(--accent-muted)] text-zinc-50'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                    }`}
                  >
                    <span className="truncate">{sec.navigationLabel || sec.title}</span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isActive ? 'text-[var(--accent-secondary)]' : 'text-zinc-600 group-hover:text-zinc-400'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </a>
                );
              })}

              {/* Standalone Page Links (if any approved) */}
              {standaloneSections.length > 0 && (
                <div className="pt-4 mt-4 border-t border-zinc-800/70 space-y-1">
                  <p className="px-3 text-[11px] text-zinc-500 mb-1">Standalone Pages</p>
                  {standaloneSections.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={(e) => handleNavClick(sec, e)}
                      className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        standaloneSlug === sec.slug
                          ? 'bg-[var(--accent-muted)] text-zinc-50'
                          : 'text-zinc-400 hover:text-zinc-100'
                      }`}
                    >
                      {sec.navigationLabel || sec.title}
                    </button>
                  ))}
                </div>
              )}
            </nav>
          </div>

          {/* Sidebar Footer Contact & Socials */}
          <div className="pt-6 mt-8 border-t border-zinc-800/80 space-y-3 text-xs text-zinc-400">
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors truncate"
              title={settings.email}
            >
              <Mail className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
              <span className="truncate">{settings.email}</span>
            </a>
            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-100 inline-flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-100 inline-flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </aside>
      )}

      {/* ====================================================================
          MAIN EDITORIAL CONTENT CANVAS (80% WIDTH ON DESKTOP)
          ==================================================================== */}
      <main
        className={`flex-1 ${
          isSimulatedMobile || isEmbeddedPreview
            ? 'w-full'
            : 'w-full lg:ml-[20%] lg:w-[80%]'
        } min-w-0`}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-14 py-6 lg:py-10">
          {activeStandaloneSection ? (
            <div className="py-8">
              <button
                type="button"
                onClick={() => setStandaloneSlug(null)}
                className="mb-6 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 inline-flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Main Portfolio</span>
              </button>
              <DynamicSectionRenderer
                section={activeStandaloneSection}
                settings={settings}
                embeddedChildren={getChildSectionsForParent(
                  sections,
                  activeStandaloneSection.id,
                  includeDrafts
                )}
                onSelectItemModal={(item, sectionTitle) =>
                  setModalItem({ item, sectionTitle })
                }
                isPreview={includeDrafts}
              />
            </div>
          ) : (
            homepageSections.map((sec) => (
              <DynamicSectionRenderer
                key={sec.id}
                section={sec}
                settings={settings}
                embeddedChildren={getChildSectionsForParent(sections, sec.id, includeDrafts)}
                onSelectItemModal={(item, sectionTitle) =>
                  setModalItem({ item, sectionTitle })
                }
                isPreview={includeDrafts}
              />
            ))
          )}

          {/* Footer-Placed Custom Sections (if any) */}
          {footerSections.length > 0 && (
            <div className="pt-8 space-y-8">
              {footerSections.map((fSec) => (
                <DynamicSectionRenderer
                  key={fSec.id}
                  section={fSec}
                  settings={settings}
                  onSelectItemModal={(item, sectionTitle) =>
                    setModalItem({ item, sectionTitle })
                  }
                  isPreview={includeDrafts}
                />
              ))}
            </div>
          )}

          {/* Quiet Editorial Footer */}
          <footer className="py-12 text-xs text-zinc-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-zinc-300 font-medium">{settings.ownerName}</p>
              <p className="mt-1">
                M.Sc. &amp; B.Sc. (Honours) in Mathematics, University of Chittagong · Developer at Nerobytes
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#home" className="hover:text-zinc-300 transition-colors">
                Top of Page
              </a>
              <span aria-hidden="true">·</span>
              <a href="#projects" className="hover:text-zinc-300 transition-colors">
                Projects
              </a>
              <span aria-hidden="true">·</span>
              <a href="#contact" className="hover:text-zinc-300 transition-colors">
                Contact
              </a>
            </div>
          </footer>
        </div>
      </main>

      {/* ====================================================================
          LIGHTBOX / PROJECT & ARTWORK DETAIL MODAL
          ==================================================================== */}
      {modalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-item-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <p className="text-xs text-[var(--accent-secondary)] font-medium">
                  {modalItem.sectionTitle}
                  {modalItem.item.period ? ` · ${modalItem.item.period}` : ''}
                </p>
                <h3 id="modal-item-title" className="text-xl font-bold text-zinc-100 mt-1">
                  {modalItem.item.title}
                </h3>
                {modalItem.item.subtitle && (
                  <p className="text-xs text-zinc-400 mt-0.5">{modalItem.item.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                aria-label="Close detail modal"
                onClick={() => setModalItem(null)}
                className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalItem.item.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                <img
                  src={modalItem.item.imageUrl}
                  alt={modalItem.item.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[380px] object-cover"
                />
              </div>
            )}

            <p className="text-sm text-zinc-300 leading-relaxed">
              {modalItem.item.description}
            </p>

            {modalItem.item.technologies && modalItem.item.technologies.length > 0 && (
              <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 flex flex-wrap items-center gap-2">
                <span className="text-zinc-500">Technologies &amp; Methods:</span>
                {modalItem.item.technologies.map((t, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span aria-hidden="true">·</span>}
                    <span className="text-zinc-200">{t}</span>
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {modalItem.item.githubUrl && (
                <a
                  href={modalItem.item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 hover:text-white inline-flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-xs font-medium text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
