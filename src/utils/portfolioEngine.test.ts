import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialDatabaseState,
  getVisibleHomepageSections,
  getVisibleNavigationSections,
  generateSectionFromNaturalLanguageFallback,
  applyNaturalLanguageEditFallback,
  resolveSectionForView,
} from './portfolioEngine';

test('initial database state contains all 12 factual CV sections for Ahmed Imtiaz Mahim', () => {
  const db = createInitialDatabaseState();
  assert.equal(db.settings.ownerName, 'Ahmed Imtiaz Mahim');
  assert.equal(db.sections.length, 12);

  const titles = db.sections.map((s) => s.title);
  assert.deepEqual(titles, [
    'Home',
    'About Me',
    'Education',
    'Professional Experience',
    'Technical Skills',
    'Projects',
    'Academic Background',
    'Awards & Achievements',
    'Leadership & Extracurricular Activities',
    'Creative Interests',
    'Languages',
    'Contact',
  ]);
});

test('AI section generator creates draft sections that do NOT auto-appear in public navigation or homepage until published', () => {
  const db = createInitialDatabaseState();
  const newSecDraft = generateSectionFromNaturalLanguageFallback(
    'Create a new section called My University Life. I want to share my university memories, extracurricular activities, event photographs, and experiences. Make it visually attractive using a timeline and image gallery.',
    db.sections
  );

  assert.equal(newSecDraft.title, 'My University Life');
  assert.equal(newSecDraft.status, 'draft');
  assert.equal(newSecDraft.navigationVisible, false);
  assert.equal(newSecDraft.layout, 'custom-combination');

  const sectionsWithDraft = [
    ...db.sections,
    {
      ...newSecDraft,
      id: 'sec-uni-life',
      createdAt: '2026-11-04T16:00:00.000Z',
      updatedAt: '2026-11-04T16:00:00.000Z',
    },
  ];

  // Public visitors must NOT see draft sections
  const publicHomepage = getVisibleHomepageSections(sectionsWithDraft, false);
  assert.equal(publicHomepage.some((s) => s.id === 'sec-uni-life'), false);

  const publicNav = getVisibleNavigationSections(sectionsWithDraft, false);
  assert.equal(publicNav.some((s) => s.id === 'sec-uni-life'), false);

  // Private Studio preview (includeDrafts = true) sees the draft on homepage preview
  const previewHomepage = getVisibleHomepageSections(sectionsWithDraft, true);
  assert.equal(previewHomepage.some((s) => s.id === 'sec-uni-life'), true);
});

test('AI Website Editor modifies only targeted sections or settings without overwriting unrelated sections', () => {
  const db = createInitialDatabaseState();

  // 1. Change accent color
  const colorRes = applyNaturalLanguageEditFallback(
    'Change the accent color from purple to blue',
    { settings: db.settings, sections: db.sections }
  );
  assert.equal(colorRes.updatedSettings?.accentColor, 'blue');

  // 2. Redesign awards section with timeline
  const awardsRes = applyNaturalLanguageEditFallback(
    'Redesign my awards section with a beautiful timeline',
    { settings: db.settings, sections: db.sections }
  );
  const updatedAwards = awardsRes.updatedSections?.find((s) => s.sectionType === 'awards');
  const untouchedAbout = awardsRes.updatedSections?.find((s) => s.sectionType === 'about');
  assert.equal(updatedAwards?.layout, 'timeline');
  assert.equal(untouchedAbout?.layout, 'editorial');
  assert.equal(updatedAwards?.content.items.length, 2);

  // 3. Move Education section above About Me
  const moveRes = applyNaturalLanguageEditFallback(
    'Move my Education section above About Me',
    { settings: db.settings, sections: db.sections }
  );
  const eduOrder = moveRes.updatedSections?.find((s) => s.sectionType === 'education')?.navigationOrder ?? 99;
  const aboutOrder = moveRes.updatedSections?.find((s) => s.sectionType === 'about')?.navigationOrder ?? 0;
  assert.equal(eduOrder < aboutOrder, true);
});

test('resolveSectionForView keeps published content separate from unpublished draft edits for public visitors', () => {
  const db = createInitialDatabaseState();
  const about = {
    ...db.sections[1],
    hasUnpublishedDraft: true,
    draftData: {
      title: 'About Me (Draft Version)',
      subtitle: 'Draft Subtitle',
      summary: 'Draft Summary',
      layout: 'cards' as const,
      content: db.sections[1].content,
      navigationLabel: 'About Draft',
      navigationVisible: true,
      homepageVisible: true,
      placement: 'homepage' as const,
      updatedAt: '2026-11-04T16:10:00.000Z',
    },
  };

  const publicView = resolveSectionForView(about, false);
  assert.equal(publicView.title, 'About Me');
  assert.equal(publicView.layout, 'editorial');

  const studioPreview = resolveSectionForView(about, true);
  assert.equal(studioPreview.title, 'About Me (Draft Version)');
  assert.equal(studioPreview.layout, 'cards');
});
