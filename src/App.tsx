import React, { useCallback, useEffect, useState } from 'react';
import { SectionData, SiteSettings } from './types/portfolio';
import {
  createInitialSections,
  createInitialSettings,
} from './utils/portfolioEngine';
import { PublicPortfolioView } from './components/PublicPortfolioView';
import { PrivateStudioView } from './components/PrivateStudioView';

export function App() {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);
  const [settings, setSettings] = useState<SiteSettings>(() => createInitialSettings());
  const [sections, setSections] = useState<SectionData[]>(() => createInitialSections());

  const fetchPublicPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/public/portfolio');
      if (!res.ok) return;
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      if (Array.isArray(data.sections)) setSections(data.sections);
    } catch (err) {
      console.error('Error loading public portfolio:', err);
    }
  }, []);

  useEffect(() => {
    fetchPublicPortfolio();
  }, [fetchPublicPortfolio]);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (settings.seoTitle) {
      document.title = settings.seoTitle;
    }
  }, [settings.seoTitle]);

  const isPrivateStudioRoute = pathname.startsWith('/private-studio');

  if (isPrivateStudioRoute) {
    return <PrivateStudioView onPublicDataChanged={fetchPublicPortfolio} />;
  }

  return (
    <PublicPortfolioView
      settings={settings}
      sections={sections}
      includeDrafts={false}
    />
  );
}

export default App;
