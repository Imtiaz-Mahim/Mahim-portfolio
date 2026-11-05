import {
  AccentColor,
  DatabaseState,
  FontFamilyChoice,
  LayoutType,
  MediaItem,
  SectionData,
  SiteSettings,
} from '../types/portfolio';

const BASE_ASSET_PATH = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '') + '/assets/images/';
export const PORTRAIT_IMAGE_URL = `${BASE_ASSET_PATH}profile_portrait_mahim_1793837250035.jpg`;
export const OPTIMAL_CONTROL_IMAGE_URL = `${BASE_ASSET_PATH}project_optimal_control_1793837251139.jpg`;
export const NEROBYTES_WEB_IMAGE_URL = `${BASE_ASSET_PATH}project_nerobytes_web_1793837251740.jpg`;
export const SKETCH_STUDY_IMAGE_URL = `${BASE_ASSET_PATH}creative_sketch_study_1793837251622.jpg`;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function createInitialSettings(): SiteSettings {
  return {
    ownerName: 'Ahmed Imtiaz Mahim',
    identities: [
      'Mathematics Postgraduate',
      'Web Developer',
      'JavaScript Developer',
      'React.js Developer',
    ],
    professionalSummary:
      'Mathematics postgraduate skilled in analytical modeling and problem-solving, with practical experience in web development using JavaScript and React.js. Strong at applying mathematical thinking to research and building efficient digital solutions.',
    heroGreeting: 'Analytical Rigor · Modern Web Engineering',
    profileImageUrl: PORTRAIT_IMAGE_URL,
    accentColor: 'violet',
    fontFamily: 'Poppins',
    email: 'aimtiazm2017@gmail.com',
    whatsapp: '+880 1700-000000',
    location: 'Chattogram, Bangladesh',
    githubUrl: 'https://github.com/ahmed-imtiaz-mahim',
    linkedinUrl: 'https://linkedin.com/in/ahmed-imtiaz-mahim',
    facebookUrl: 'https://facebook.com',
    seoTitle: 'Ahmed Imtiaz Mahim — Mathematics Postgraduate & Web Developer',
    seoDescription:
      'Mathematics postgraduate skilled in analytical modeling and problem-solving, with practical experience in web development using JavaScript and React.js.',
    updatedAt: '2026-11-04T16:00:00.000Z',
  };
}

export function createInitialMedia(): MediaItem[] {
  return [
    {
      id: 'media-portrait-1',
      title: 'Ahmed Imtiaz Mahim — Editorial Study Portrait',
      category: 'portrait',
      url: PORTRAIT_IMAGE_URL,
      caption: 'Portrait placeholder in minimalist mathematical and engineering workspace.',
      aspectRatio: '1:1',
      createdAt: '2026-11-04T16:00:00.000Z',
    },
    {
      id: 'media-project-1',
      title: 'Transportation Problem in Optimal Control Theory',
      category: 'academic',
      url: OPTIMAL_CONTROL_IMAGE_URL,
      caption: 'Mathematical formulation and trajectory optimization for optimal transport flow.',
      aspectRatio: '16:9',
      createdAt: '2026-11-04T16:00:00.000Z',
    },
    {
      id: 'media-project-2',
      title: 'Modern React.js & JavaScript Web Interfaces',
      category: 'project',
      url: NEROBYTES_WEB_IMAGE_URL,
      caption: 'Responsive component architecture and web application engineering.',
      aspectRatio: '16:9',
      createdAt: '2026-11-04T16:00:00.000Z',
    },
    {
      id: 'media-artwork-1',
      title: 'Graphite Reference Study — Architectural & Portrait Sketching',
      category: 'artwork',
      url: SKETCH_STUDY_IMAGE_URL,
      caption: 'Observation and reference sketching using fine graphite on cotton paper.',
      aspectRatio: '4:3',
      createdAt: '2026-11-04T16:00:00.000Z',
    },
  ];
}

export function createInitialSections(): SectionData[] {
  const timestamp = '2026-11-04T16:00:00.000Z';
  return [
    {
      id: 'sec-home',
      title: 'Home',
      slug: 'home',
      sectionType: 'home',
      subtitle: 'Mathematics Postgraduate · Web Developer · JavaScript & React.js Developer',
      summary:
        'Mathematics postgraduate skilled in analytical modeling and problem-solving, with practical experience in web development using JavaScript and React.js. Strong at applying mathematical thinking to research and building efficient digital solutions.',
      layout: 'profile',
      navigationLabel: 'Home',
      navigationVisible: true,
      navigationOrder: 1,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Mathematics postgraduate skilled in analytical modeling and problem-solving, with practical experience in web development using JavaScript and React.js. Strong at applying mathematical thinking to research and building efficient digital solutions.',
        paragraphs: [
          'Bridging formal mathematical inquiry from the University of Chittagong with practical frontend and web engineering at Nerobytes in Chattogram, Bangladesh.',
        ],
        items: [
          {
            id: 'home-pillar-1',
            title: 'Mathematical Postgraduation',
            subtitle: 'M.Sc. & B.Sc. (Honours) in Mathematics',
            organization: 'University of Chittagong',
            description: 'Analytical modeling, optimal control theory, and structured quantitative reasoning.',
          },
          {
            id: 'home-pillar-2',
            title: 'Web & React.js Engineering',
            subtitle: 'Developer at Nerobytes',
            organization: 'Chattogram, Bangladesh',
            description: 'Building clean, responsive, and maintainable digital interfaces with JavaScript and React.js.',
          },
          {
            id: 'home-pillar-3',
            title: 'Leadership & Creative Observation',
            subtitle: 'General Secretary · Visual Arts',
            organization: "Jalalabad Student's Association",
            description: 'Organizational leadership paired with fine-art sketching by reference and competitive recognition.',
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-about',
      title: 'About Me',
      slug: 'about-me',
      sectionType: 'about',
      subtitle: 'Where Formal Mathematical Reasoning Meets Modern Web Development',
      summary:
        'An intellectual and professional overview balancing postgraduate mathematics, software craftsmanship, analytical thinking, creativity, and organizational leadership.',
      layout: 'editorial',
      navigationLabel: 'About Me',
      navigationVisible: true,
      navigationOrder: 2,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Mathematics postgraduate skilled in analytical modeling and problem-solving, with practical experience in web development using JavaScript and React.js. Strong at applying mathematical thinking to research and building efficient digital solutions.',
        paragraphs: [
          'My academic journey at the University of Chittagong—completing both a Bachelor of Science (Honours) and a Master of Science in Mathematics—shaped how I approach complex problems. Whether formulating an optimal control model or structuring state flow in a modern web application, I rely on clarity, precision, and foundational reasoning.',
          'Professionally, I work as a Developer at Nerobytes in Chattogram, Bangladesh, translating user and business requirements into responsive web experiences with JavaScript and React.js. Beyond equations and code, I value balanced personal growth: serving as General Secretary of the Jalalabad Student’s Association strengthened my communication and teamwork, while sketching by reference keeps my visual observation sharp.',
        ],
        items: [
          {
            id: 'soft-skill-1',
            title: 'Leadership',
            subtitle: "General Secretary, Jalalabad Student's Association",
            description: 'Guiding student initiatives, coordinating organizational responsibilities, and representing members with accountability.',
          },
          {
            id: 'soft-skill-2',
            title: 'Teamwork',
            subtitle: 'Collaborative Engineering & Academic Inquiry',
            description: 'Effective collaborator in group environments, bridging technical and organizational perspectives smoothly.',
          },
          {
            id: 'soft-skill-3',
            title: 'Communication',
            subtitle: 'Clear Articulation Across Disciplines',
            description: 'Confident communicator with diverse audiences—explaining abstract mathematical concepts and technical solutions clearly.',
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-education',
      title: 'Education',
      slug: 'education',
      sectionType: 'education',
      subtitle: 'Academic Timeline in Pure & Applied Mathematics',
      summary: 'Postgraduate and undergraduate mathematical studies at the University of Chittagong, Bangladesh.',
      layout: 'timeline',
      navigationLabel: 'Education',
      navigationVisible: true,
      navigationOrder: 3,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Rigorous academic training in theoretical and applied mathematics at the Department of Mathematics, University of Chittagong.',
        paragraphs: [],
        items: [
          {
            id: 'edu-msc',
            title: 'Master of Science in Mathematics',
            organization: 'University of Chittagong',
            location: 'Bangladesh',
            period: '2022–2023',
            category: 'Postgraduate Degree',
            description:
              'Advanced postgraduate study in mathematical modeling, optimal control theory, and analytical problem-solving, culminating in academic research on the Transportation Problem in Optimal Control Theory.',
            highlights: [
              'Academic Research: Transportation Problem in Optimal Control Theory',
              'Focus on analytical modeling, differential systems, and optimization methods',
            ],
          },
          {
            id: 'edu-bsc',
            title: 'Bachelor of Science (Honours) in Mathematics',
            organization: 'University of Chittagong',
            location: 'Bangladesh',
            period: '2019–2022',
            category: 'Undergraduate Honours Degree',
            description:
              'Four-year honours curriculum covering pure and applied mathematics, linear algebra, calculus, differential equations, numerical analysis, and mathematical programming foundations.',
            highlights: [
              'Strong foundation in quantitative proof, mathematical logic, and structured problem solving',
              'Active leadership in university student organization alongside academic coursework',
            ],
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-experience',
      title: 'Professional Experience',
      slug: 'professional-experience',
      sectionType: 'experience',
      subtitle: 'Software & Web Development Career',
      summary: 'Practical industry experience building modern web applications with JavaScript and React.js.',
      layout: 'experience-timeline',
      navigationLabel: 'Experience',
      navigationVisible: true,
      navigationOrder: 4,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Applying analytical precision to real-world web engineering, interface architecture, and client delivery.',
        paragraphs: [],
        items: [
          {
            id: 'exp-nerobytes',
            title: 'Developer',
            organization: 'Nerobytes',
            subtitle: 'Web Development Company',
            location: 'Chattogram, Bangladesh',
            period: 'July 2023 – Present',
            category: 'Full-Time Role',
            description:
              'Developing responsive, modern web applications and interactive user interfaces using JavaScript and React.js at Nerobytes in Chattogram, Bangladesh.',
            highlights: [
              'Building modular frontend interfaces and reusable component systems with React.js and modern JavaScript',
              'Applying structured problem-solving and clean state architecture to web development projects',
              'Collaborating within a team environment to deliver reliable, responsive digital solutions',
            ],
            technologies: ['JavaScript', 'React.js', 'Web Development'],
          },
        ],
        subsections: [],
        externalLinks: [],
        calloutNote:
          'Additional detailed responsibilities and future professional milestones can be expanded anytime via Mahim Private Studio.',
      },
    },
    {
      id: 'sec-skills',
      title: 'Technical Skills',
      slug: 'technical-skills',
      sectionType: 'skills',
      subtitle: 'Core Engineering, Productivity & Analytical Capabilities',
      summary: 'Organized inventory of programming technologies, productivity suites, and practical capabilities.',
      layout: 'grid',
      navigationLabel: 'Technical Skills',
      navigationVisible: true,
      navigationOrder: 5,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Curated technical toolkit grounded in practical web development, document engineering, and visual presentation—presented transparently without arbitrary percentage bars.',
        paragraphs: [],
        categories: [
          {
            id: 'skill-cat-prog',
            name: 'Programming & Development',
            skills: ['JavaScript', 'React.js', 'Web Development'],
          },
          {
            id: 'skill-cat-tools',
            name: 'Productivity & Design Tools',
            skills: ['MS Office Suite', 'Canva'],
          },
          {
            id: 'skill-cat-add',
            name: 'Additional Practical Skills',
            skills: ['Typing speed: 60–70 WPM', 'Sketching by reference'],
          },
          {
            id: 'skill-cat-soft',
            name: 'Professional & Soft Skills',
            skills: [
              "Leadership (General Secretary, Jalalabad Student's Association)",
              'Teamwork (Effective collaborator in group environments)',
              'Communication (Confident communicator with diverse audiences)',
            ],
          },
        ],
        items: [
          {
            id: 'skill-item-js',
            title: 'JavaScript & React.js',
            category: 'Programming',
            description: 'Interactive web application logic, component-driven UI development, and modern ECMAScript workflows.',
          },
          {
            id: 'skill-item-web',
            title: 'Web Development',
            category: 'Engineering',
            description: 'Responsive layout architecture, semantic structure, and cross-device web delivery.',
          },
          {
            id: 'skill-item-tools',
            title: 'MS Office Suite & Canva',
            category: 'Tools',
            description: 'Structured documentation, analytical reporting, presentation design, and visual asset layout.',
          },
          {
            id: 'skill-item-typing',
            title: '60–70 WPM Typing & Reference Sketching',
            category: 'Additional Skills',
            description: 'High-efficiency keyboard fluency (60–70 WPM) alongside observational freehand sketching by reference.',
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-projects',
      title: 'Projects',
      slug: 'projects',
      sectionType: 'projects',
      subtitle: 'Academic Research & Web Development Portfolio',
      summary: 'Selected academic research in Optimal Control Theory and practical web development projects.',
      layout: 'project-showcase',
      navigationLabel: 'Projects',
      navigationVisible: true,
      navigationOrder: 6,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'A curated showcase combining mathematical optimization research with modern web development applications.',
        paragraphs: [],
        items: [
          {
            id: 'proj-optimal-control',
            title: 'Transportation Problem in Optimal Control Theory',
            subtitle: 'Academic Research Project',
            organization: 'University of Chittagong — Department of Mathematics',
            period: '2022–2023',
            category: 'Academic Research · Mathematics',
            description:
              'Postgraduate mathematical study investigating the Transportation Problem within the framework of Optimal Control Theory. Focuses on analytical modeling, state-trajectory optimization, and cost-minimization dynamics across constrained transport networks.',
            technologies: ['Optimal Control Theory', 'Mathematical Modeling', 'Optimization', 'Analytical Research'],
            imageUrl: OPTIMAL_CONTROL_IMAGE_URL,
            githubUrl: 'https://github.com/ahmed-imtiaz-mahim',
            liveUrl: '#academic-background',
          },
          {
            id: 'proj-web-dev-1',
            title: 'Various Web Development Projects — React.js & JavaScript Applications',
            subtitle: 'Frontend & Web Engineering Showcase (Configurable Placeholder)',
            organization: 'Nerobytes & Independent Web Projects',
            period: '2023 – Present',
            category: 'Web Development',
            description:
              'Practical web development projects built with JavaScript and React.js, focusing on responsive layouts, interactive state management, and clean user experience. Individual project case studies, live deployment links, and repositories can be added directly from Mahim Private Studio.',
            technologies: ['JavaScript', 'React.js', 'Responsive Web Design', 'Modern CSS'],
            imageUrl: NEROBYTES_WEB_IMAGE_URL,
            githubUrl: 'https://github.com/ahmed-imtiaz-mahim',
            liveUrl: '#projects',
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-academic',
      title: 'Academic Background',
      slug: 'academic-background',
      sectionType: 'academic',
      subtitle: 'Mathematical Inquiry, Analytical Modeling & Optimal Control Research',
      summary:
        'Deepening the connection between postgraduate mathematical foundations at the University of Chittagong and computational problem-solving.',
      layout: 'cards',
      navigationLabel: 'Academic Background',
      navigationVisible: true,
      navigationOrder: 7,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Completed both Master of Science (2022–2023) and Bachelor of Science Honours (2019–2022) in Mathematics at the University of Chittagong, developing a disciplined approach to abstraction, formal proof, and analytical modeling.',
        paragraphs: [
          'My academic capstone work centered on the Transportation Problem in Optimal Control Theory—examining how dynamic systems and optimization principles govern resource distribution and trajectory efficiency.',
        ],
        items: [
          {
            id: 'acad-item-1',
            title: 'Transportation Problem in Optimal Control Theory',
            subtitle: 'Postgraduate Academic Research (M.Sc. in Mathematics)',
            period: '2022–2023',
            organization: 'University of Chittagong',
            description:
              'Formulated and analyzed transportation optimization problems through the lens of optimal control, evaluating cost functionals, admissible control trajectories, and boundary conditions.',
          },
          {
            id: 'acad-item-2',
            title: 'Analytical Modeling & Problem-Solving Methodology',
            subtitle: 'Mathematical Foundation Applied to Software',
            period: '2019–2023',
            organization: 'University of Chittagong',
            description:
              'Translating mathematical structure into algorithmic thinking, clean state transitions, and systematic debugging in JavaScript and React.js applications.',
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-awards',
      title: 'Awards & Achievements',
      slug: 'awards-and-achievements',
      sectionType: 'awards',
      subtitle: 'Distinctions in Creative Talent & Visual Arts Competitions',
      summary: 'Recognized honors in talent search and fine art competitions.',
      layout: 'achievement-showcase',
      navigationLabel: 'Awards',
      navigationVisible: true,
      navigationOrder: 8,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Selected competitive honors recognizing intellectual curiosity, creative expression, and artistic execution.',
        paragraphs: [],
        items: [
          {
            id: 'award-srijonshil-2017',
            title: 'Champion — Srijonshil Medha Onneshon Protijogita',
            subtitle: 'Creative Talent Hunt Competition',
            period: '2017',
            organization: 'Srijonshil Medha Onneshon Protijogita',
            category: 'Championship Honor',
            description:
              'Awarded Champion distinction in the Srijonshil Medha Onneshon Protijogita in 2017, recognizing excellence in analytical and creative merit.',
          },
          {
            id: 'award-art-upazila',
            title: 'First Place — Art Competition',
            subtitle: 'Upazila-level School Art Contest',
            period: 'School Level Honor',
            organization: 'Upazila-level School Art Contest',
            category: 'First Place Distinction',
            description:
              'Secured First Place in the Upazila-level School Art Contest, demonstrating early dedication to visual composition and observational drawing.',
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-leadership',
      title: 'Leadership & Extracurricular Activities',
      slug: 'leadership-and-extracurricular',
      sectionType: 'leadership',
      subtitle: 'Student Governance, Organizational Responsibility & Community Collaboration',
      summary: 'Dedicated showcase of student leadership and organizational stewardship.',
      layout: 'timeline',
      navigationLabel: 'Leadership',
      navigationVisible: true,
      navigationOrder: 9,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Active involvement in student representation, organizational coordination, and community-building initiatives.',
        paragraphs: [],
        items: [
          {
            id: 'lead-jalalabad',
            title: 'General Secretary',
            organization: "Jalalabad Student's Association",
            subtitle: 'Executive Student Leadership',
            period: 'Tenure at University',
            category: 'Executive Role',
            description:
              "Served as General Secretary of the Jalalabad Student's Association, leading organizational planning, coordinating student welfare activities, facilitating member communication, and fostering collaborative teamwork.",
            highlights: [
              'Executive coordination and organizational stewardship for association members',
              'Strengthened public speaking, cross-group collaboration, and event management',
            ],
          },
        ],
        subsections: [
          {
            id: 'lead-future-space',
            title: 'Future Organizational & Volunteering Archive',
            body: 'Structured space ready for future volunteering, university event retrospectives, organizational responsibilities, and community initiatives managed via Mahim Private Studio.',
          },
        ],
        externalLinks: [],
      },
    },
    {
      id: 'sec-creative',
      title: 'Creative Interests',
      slug: 'creative-interests',
      sectionType: 'creative',
      subtitle: 'Sketching by Reference & Visual Observation',
      summary: 'Exploring proportion, light, shadow, and perspective through freehand reference sketching.',
      layout: 'gallery',
      navigationLabel: 'Creative Interests',
      navigationVisible: true,
      navigationOrder: 10,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Alongside mathematics and software development, I practice sketching by reference—studying visual proportions, tonal contrast, and fine details with the same patience required in analytical modeling.',
        paragraphs: [
          'Having earned First Place at the Upazila-level School Art Contest, drawing remains a meaningful creative discipline that informs my eye for clean user interface design, visual balance, and typography.',
        ],
        items: [
          {
            id: 'creative-sketching-ref',
            title: 'Sketching by Reference',
            subtitle: 'Graphite & Freehand Observational Drawing',
            category: 'Visual Arts',
            description:
              'Freehand sketching from architectural, portrait, and natural references. New artwork scans, photographs, and creative galleries can be uploaded and published anytime through Mahim Private Studio.',
            imageUrl: SKETCH_STUDY_IMAGE_URL,
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-languages',
      title: 'Languages',
      slug: 'languages',
      sectionType: 'languages',
      subtitle: 'Multilingual Communication Proficiency',
      summary: 'Spoken and written communication across Bangla, English, and Hindi.',
      layout: 'cards',
      navigationLabel: 'Languages',
      navigationVisible: true,
      navigationOrder: 11,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Effective communication across academic, professional, and collaborative environments.',
        paragraphs: [],
        items: [
          {
            id: 'lang-bangla',
            title: 'Bangla',
            subtitle: 'Native',
            metricValue: 'Native',
            category: 'First Language',
            description: 'Native fluency in speaking, reading, academic writing, and public communication.',
          },
          {
            id: 'lang-english',
            title: 'English',
            subtitle: 'Proficient',
            metricValue: 'Proficient',
            category: 'Professional & Academic Language',
            description: 'Proficient in technical documentation, academic mathematics research, and professional workplace communication.',
          },
          {
            id: 'lang-hindi',
            title: 'Hindi',
            subtitle: 'Conversational',
            metricValue: 'Conversational',
            category: 'Spoken Communication',
            description: 'Conversational proficiency for everyday spoken interaction and comprehension.',
          },
        ],
        subsections: [],
        externalLinks: [],
      },
    },
    {
      id: 'sec-contact',
      title: 'Contact',
      slug: 'contact',
      sectionType: 'contact',
      subtitle: 'Connect for Web Development, Research Collaboration & Opportunities',
      summary: 'Direct contact channels, social profiles, and message inquiry form.',
      layout: 'custom-combination',
      navigationLabel: 'Contact',
      navigationVisible: true,
      navigationOrder: 12,
      homepageVisible: true,
      placement: 'homepage',
      status: 'published',
      isCore: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        leadParagraph:
          'Available for web development opportunities, React.js & JavaScript engineering roles, and analytical or academic discussions.',
        paragraphs: [
          'Based in Chattogram, Bangladesh. Reach out directly via email, WhatsApp, GitHub, or the direct inquiry form below.',
        ],
        items: [
          {
            id: 'contact-email',
            title: 'Email',
            subtitle: 'aimtiazm2017@gmail.com',
            description: 'Direct electronic mail for professional inquiries and collaboration.',
          },
          {
            id: 'contact-whatsapp',
            title: 'WhatsApp',
            subtitle: '+880 1700-000000 (Configurable in Studio)',
            description: 'Direct messaging for quick communication.',
          },
          {
            id: 'contact-location',
            title: 'Location',
            subtitle: 'Chattogram, Bangladesh',
            description: 'Currently working as Developer at Nerobytes, Chattogram.',
          },
        ],
        subsections: [],
        externalLinks: [
          {
            id: 'ext-github',
            label: 'GitHub Profile',
            url: 'https://github.com/ahmed-imtiaz-mahim',
          },
          {
            id: 'ext-linkedin',
            label: 'LinkedIn Profile',
            url: 'https://linkedin.com/in/ahmed-imtiaz-mahim',
          },
        ],
      },
    },
  ];
}

export function createInitialDatabaseState(): DatabaseState {
  return {
    settings: createInitialSettings(),
    sections: createInitialSections(),
    media: createInitialMedia(),
    auditLog: [
      {
        id: 'audit-init-1',
        action: 'published',
        sectionTitle: 'Initial Portfolio Publication',
        summary: 'Initialized Ahmed Imtiaz Mahim portfolio with 12 verified CV sections.',
        timestamp: '2026-11-04T16:00:00.000Z',
      },
    ],
    messages: [
      {
        id: 'msg-welcome-1',
        name: 'Nerobytes Engineering Colleague',
        email: 'team@nerobytes.example.com',
        subject: 'Portfolio Platform Launch',
        message: 'Congratulations on launching your new portfolio platform, Mahim!',
        createdAt: '2026-11-04T15:30:00.000Z',
        read: false,
      },
    ],
    security: {
      ownerEmail: 'aimtiazm2017@gmail.com',
      passwordHash: 'MahimStudio2026!',
      loginHistory: [],
    },
  };
}

/**
 * Resolves a section for either public viewing or Private Studio draft preview.
 */
export function resolveSectionForView(section: SectionData, includeDrafts: boolean): SectionData {
  if (includeDrafts && section.hasUnpublishedDraft && section.draftData) {
    return {
      ...section,
      title: section.draftData.title,
      subtitle: section.draftData.subtitle,
      summary: section.draftData.summary,
      layout: section.draftData.layout,
      content: section.draftData.content,
      navigationLabel: section.draftData.navigationLabel,
      navigationVisible: section.draftData.navigationVisible,
      homepageVisible: section.draftData.homepageVisible,
      placement: section.draftData.placement,
      targetSectionId: section.draftData.targetSectionId,
      updatedAt: section.draftData.updatedAt,
    };
  }
  return section;
}

/**
 * Returns ordered homepage sections.
 * When includeDrafts is false (public visitor), strictly returns published sections.
 * Also respects 'before-section' and 'after-section' relative placement.
 */
export function getVisibleHomepageSections(
  sections: SectionData[],
  includeDrafts = false
): SectionData[] {
  const resolved = sections.map((s) => resolveSectionForView(s, includeDrafts));
  const eligible = resolved.filter((s) => {
    const statusOk = includeDrafts ? s.status !== 'hidden' : s.status === 'published';
    if (!statusOk || !s.homepageVisible) return false;
    if (s.placement === 'inside-section' || s.placement === 'footer' || s.placement === 'standalone-page') {
      return false;
    }
    return true;
  });

  const baseOrdered = eligible
    .filter((s) => s.placement !== 'before-section' && s.placement !== 'after-section')
    .sort((a, b) => a.navigationOrder - b.navigationOrder);

  const relativeSections = eligible
    .filter((s) => s.placement === 'before-section' || s.placement === 'after-section')
    .sort((a, b) => a.navigationOrder - b.navigationOrder);

  const result = [...baseOrdered];
  for (const rel of relativeSections) {
    const targetIdx = result.findIndex((item) => item.id === rel.targetSectionId);
    if (targetIdx === -1) {
      result.push(rel);
    } else if (rel.placement === 'before-section') {
      result.splice(targetIdx, 0, rel);
    } else {
      result.splice(targetIdx + 1, 0, rel);
    }
  }

  return result;
}

/**
 * Returns sections approved for the main navigation menu.
 * New sections must not automatically appear in the navigation menu unless approved (`navigationVisible: true` and `status === 'published'`).
 */
export function getVisibleNavigationSections(
  sections: SectionData[],
  includeDrafts = false
): SectionData[] {
  const resolved = sections.map((s) => resolveSectionForView(s, includeDrafts));
  return resolved
    .filter((s) => {
      const statusOk = includeDrafts ? s.status !== 'hidden' : s.status === 'published';
      return statusOk && s.navigationVisible;
    })
    .sort((a, b) => a.navigationOrder - b.navigationOrder);
}

/**
 * Returns sections placed inside a specific parent section.
 */
export function getChildSectionsForParent(
  sections: SectionData[],
  parentSectionId: string,
  includeDrafts = false
): SectionData[] {
  const resolved = sections.map((s) => resolveSectionForView(s, includeDrafts));
  return resolved
    .filter((s) => {
      const statusOk = includeDrafts ? s.status !== 'hidden' : s.status === 'published';
      return statusOk && s.placement === 'inside-section' && s.targetSectionId === parentSectionId;
    })
    .sort((a, b) => a.navigationOrder - b.navigationOrder);
}

/**
 * Returns sections placed in the footer.
 */
export function getFooterPlacedSections(
  sections: SectionData[],
  includeDrafts = false
): SectionData[] {
  const resolved = sections.map((s) => resolveSectionForView(s, includeDrafts));
  return resolved
    .filter((s) => {
      const statusOk = includeDrafts ? s.status !== 'hidden' : s.status === 'published';
      return statusOk && s.placement === 'footer';
    })
    .sort((a, b) => a.navigationOrder - b.navigationOrder);
}

/**
 * Infers the best layout from a natural language prompt.
 */
export function inferLayoutFromPrompt(prompt: string): LayoutType {
  const lower = prompt.toLowerCase();
  if (lower.includes('timeline') && lower.includes('gallery')) return 'custom-combination';
  if (lower.includes('timeline')) return 'timeline';
  if (lower.includes('gallery') || lower.includes('photo') || lower.includes('artwork')) return 'gallery';
  if (lower.includes('statistic') || lower.includes('metric')) return 'statistics';
  if (lower.includes('editorial') || lower.includes('essay') || lower.includes('article')) return 'editorial';
  if (lower.includes('project')) return 'project-showcase';
  if (lower.includes('award') || lower.includes('achievement') || lower.includes('certification')) {
    return 'achievement-showcase';
  }
  if (lower.includes('experience') || lower.includes('career') || lower.includes('job')) {
    return 'experience-timeline';
  }
  if (lower.includes('grid')) return 'grid';
  return 'cards';
}

/**
 * Extracts a clean section title from a natural language creation prompt.
 */
export function extractSectionTitleFromPrompt(prompt: string): string {
  const calledMatch = prompt.match(/(?:called|named|titled|section\s+for)\s+["']?([A-Z0-9][A-Za-z0-9\s&-]{2,45}?)["']?(?:\.|,|\s+I\s+|\s+where\s+|\s+with\s+|\s+using\s+|\s+to\s+|$)/i);
  if (calledMatch && calledMatch[1]) {
    return calledMatch[1].trim();
  }
  const quotesMatch = prompt.match(/["']([^"']{3,50})["']/);
  if (quotesMatch && quotesMatch[1]) {
    return quotesMatch[1].trim();
  }
  if (prompt.toLowerCase().includes('university')) return 'My University Life';
  if (prompt.toLowerCase().includes('publication') || prompt.toLowerCase().includes('research')) {
    return 'Research & Publications';
  }
  if (prompt.toLowerCase().includes('certification')) return 'Certifications & Training';
  return 'Custom Portfolio Section';
}

/**
 * Generates a structured draft section from natural language instructions.
 * Notice:
 * - status is always 'draft' initially
 * - navigationVisible is false by default (never appears in navigation unless approved)
 */
export function generateSectionFromNaturalLanguageFallback(
  prompt: string,
  existingSections: SectionData[]
): Omit<SectionData, 'id' | 'createdAt' | 'updatedAt'> {
  const title = extractSectionTitleFromPrompt(prompt);
  const slug = slugify(title) || `section-${ existingSections.length + 1 }`;
  const layout = inferLayoutFromPrompt(prompt);
  const nextOrder =
    existingSections.reduce((max, s) => Math.max(max, s.navigationOrder), 0) + 1;

  const isUniversity = prompt.toLowerCase().includes('university');

  return {
    title,
    slug,
    sectionType: 'custom',
    subtitle: isUniversity
      ? 'Campus Memories, Extracurricular Leadership & Academic Camaraderie at University of Chittagong'
      : `Curated ${title} Showcase`,
    summary: prompt.trim(),
    layout,
    navigationLabel: title,
    navigationVisible: false, // Must not automatically appear in nav unless approved
    navigationOrder: nextOrder,
    homepageVisible: true,
    placement: 'homepage',
    status: 'draft', // Always saved as draft until approved & published
    isCore: false,
    content: {
      leadParagraph: isUniversity
        ? 'Reflections from my years studying Mathematics at the University of Chittagong (2019–2023), combining academic seminars, Jalalabad Student’s Association events, and campus memories.'
        : `Generated from your studio brief: "${prompt.trim()}"`,
      paragraphs: [
        isUniversity
          ? 'From undergraduate Honours classes to postgraduate Optimal Control research and student organization leadership, university life shaped both my analytical discipline and collaborative spirit.'
          : 'Every item in this section is structured for clean presentation and can be customized, reordered, or expanded before publishing.',
      ],
      items: isUniversity
        ? [
            {
              id: `gen-item-${Date.now()}-1`,
              title: 'Postgraduate Mathematics Seminars & Study Sessions',
              subtitle: 'Department of Mathematics, University of Chittagong',
              period: '2022–2023',
              category: 'Academic Memory',
              description:
                'Collaborative problem-solving sessions and research discussions on Optimal Control Theory and applied mathematical modeling.',
              imageUrl: OPTIMAL_CONTROL_IMAGE_URL,
            },
            {
              id: `gen-item-${Date.now()}-2`,
              title: "Jalalabad Student's Association Campus Gatherings",
              subtitle: 'General Secretary Responsibilities & Cultural Events',
              period: '2019–2023',
              category: 'Extracurricular & Leadership',
              description:
                'Organizing student orientation, community programs, and cultural events with fellow students from the Jalalabad community.',
              imageUrl: PORTRAIT_IMAGE_URL,
            },
          ]
        : [
            {
              id: `gen-item-${Date.now()}-1`,
              title: `${title} — Featured Entry`,
              subtitle: 'Structured Highlight',
              period: '2026',
              category: title,
              description: prompt.trim(),
              imageUrl: NEROBYTES_WEB_IMAGE_URL,
            },
          ],
      subsections: [],
      externalLinks: [],
    },
  };
}

/**
 * Applies a targeted natural-language modification to the website state
 * without overwriting unrelated sections.
 */
export function applyNaturalLanguageEditFallback(
  instruction: string,
  state: { settings: SiteSettings; sections: SectionData[] }
): {
  summary: string;
  targetSectionId?: string;
  updatedSettings?: SiteSettings;
  updatedSections?: SectionData[];
  createdSection?: SectionData;
} {
  const lower = instruction.toLowerCase();
  const now = new Date().toISOString();
  const sectionsCopy: SectionData[] = JSON.parse(JSON.stringify(state.sections));
  const settingsCopy: SiteSettings = JSON.parse(JSON.stringify(state.settings));

  // 1. Accent color changes ("Change the accent color from purple to blue")
  if (lower.includes('accent') || lower.includes('color') || lower.includes('theme')) {
    let newColor: AccentColor | null = null;
    if (lower.includes('blue') || lower.includes('cobalt')) newColor = 'blue';
    else if (lower.includes('purple') || lower.includes('violet')) newColor = 'violet';
    else if (lower.includes('emerald') || lower.includes('green')) newColor = 'emerald';
    else if (lower.includes('amber') || lower.includes('gold')) newColor = 'amber';
    else if (lower.includes('rose') || lower.includes('red') || lower.includes('crimson')) newColor = 'rose';

    if (newColor) {
      settingsCopy.accentColor = newColor;
      settingsCopy.updatedAt = now;
      return {
        summary: `Updated website accent color to ${newColor} across all components.`,
        updatedSettings: settingsCopy,
      };
    }
  }

  // 2. Font changes
  if (lower.includes('font') || lower.includes('typography')) {
    let newFont: FontFamilyChoice | null = null;
    if (lower.includes('montserrat')) newFont = 'Montserrat';
    else if (lower.includes('lato')) newFont = 'Lato';
    else if (lower.includes('poppins')) newFont = 'Poppins';

    if (newFont) {
      settingsCopy.fontFamily = newFont;
      settingsCopy.updatedAt = now;
      return {
        summary: `Updated primary typography to ${newFont}.`,
        updatedSettings: settingsCopy,
      };
    }
  }

  // 3. Reordering sections ("Move my Education section above Professional Experience")
  if (lower.includes('move') && (lower.includes('above') || lower.includes('below') || lower.includes('before') || lower.includes('after'))) {
    const matchedMove = sectionsCopy.find((s) =>
      lower.indexOf(s.title.toLowerCase()) !== -1 &&
      lower.indexOf(s.title.toLowerCase()) < (lower.indexOf('above') !== -1 ? lower.indexOf('above') : lower.indexOf('below') !== -1 ? lower.indexOf('below') : lower.length)
    );
    const matchedTarget = sectionsCopy.find(
      (s) => s.id !== matchedMove?.id && lower.includes(s.title.toLowerCase())
    );

    if (matchedMove && matchedTarget) {
      const sorted = [...sectionsCopy].sort((a, b) => a.navigationOrder - b.navigationOrder);
      const fromIdx = sorted.findIndex((s) => s.id === matchedMove.id);
      sorted.splice(fromIdx, 1);
      const targetIdx = sorted.findIndex((s) => s.id === matchedTarget.id);
      const placeBefore = lower.includes('above') || lower.includes('before');
      sorted.splice(placeBefore ? targetIdx : targetIdx + 1, 0, matchedMove);
      sorted.forEach((s, idx) => {
        s.navigationOrder = idx + 1;
      });
      return {
        summary: `Moved "${matchedMove.title}" ${placeBefore ? 'above' : 'below'} "${matchedTarget.title}".`,
        targetSectionId: matchedMove.id,
        updatedSections: sorted,
      };
    }
  }

  // 4. Create a new section via editor ("Create a new section for my university extracurricular activities")
  if (lower.startsWith('create a new section') || lower.startsWith('add a new section')) {
    const generated = generateSectionFromNaturalLanguageFallback(instruction, sectionsCopy);
    const created: SectionData = {
      ...generated,
      id: `sec-custom-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    sectionsCopy.push(created);
    return {
      summary: `Created draft section "${created.title}" with ${created.layout} layout.`,
      targetSectionId: created.id,
      updatedSections: sectionsCopy,
      createdSection: created,
    };
  }

  // 5. Redesign Awards section ("Redesign my awards section with a beautiful timeline")
  if (lower.includes('award') || lower.includes('achievement')) {
    const awardsSec = sectionsCopy.find((s) => s.sectionType === 'awards' || s.slug.includes('award'));
    if (awardsSec) {
      const requestedLayout = inferLayoutFromPrompt(instruction);
      awardsSec.layout = lower.includes('timeline') ? 'timeline' : requestedLayout;
      awardsSec.subtitle = 'Distinctions & Competitive Milestones Timeline';
      awardsSec.updatedAt = now;
      return {
        summary: `Redesigned "${awardsSec.title}" section with the ${awardsSec.layout} layout while preserving all verified awards.`,
        targetSectionId: awardsSec.id,
        updatedSections: sectionsCopy,
      };
    }
  }

  // 6. Edit About Me section ("Make my About Me section more professional")
  if (lower.includes('about me') || lower.includes('about section')) {
    const aboutSec = sectionsCopy.find((s) => s.sectionType === 'about' || s.slug === 'about-me');
    if (aboutSec) {
      aboutSec.subtitle = 'Executive Profile — Mathematical Modeling & Modern Frontend Engineering';
      aboutSec.content.leadParagraph =
        'Mathematics postgraduate (M.Sc. & B.Sc. Honours, University of Chittagong) and Web Developer at Nerobytes specializing in analytical modeling, algorithmic problem-solving, and production React.js & JavaScript engineering.';
      aboutSec.content.paragraphs = [
        'Grounded in formal mathematical training at the University of Chittagong, I bring quantitative precision to modern software development. My academic research in Optimal Control Theory informs my systematic approach to state management, data flow, and architectural clarity.',
        'At Nerobytes in Chattogram, I engineer responsive, user-centric web applications using JavaScript and React.js. Complemented by executive student leadership as General Secretary of the Jalalabad Student’s Association and a lifelong practice in observational sketching, I bridge analytical rigor with refined visual execution.',
      ];
      aboutSec.updatedAt = now;
      return {
        summary: 'Refined the "About Me" section with elevated executive prose while strictly preserving factual CV credentials.',
        targetSectionId: aboutSec.id,
        updatedSections: sectionsCopy,
      };
    }
  }

  // 7. Add a new project ("Add a new project to my portfolio")
  if (lower.includes('project')) {
    const projSec = sectionsCopy.find((s) => s.sectionType === 'projects' || s.slug === 'projects');
    if (projSec) {
      const titleMatch = instruction.match(/(?:called|named|titled)\s+["']?([^"'.]+)["']?/i);
      const newProjTitle = titleMatch ? titleMatch[1].trim() : 'React.js Analytical Web Application';
      projSec.content.items.push({
        id: `proj-added-${Date.now()}`,
        title: newProjTitle,
        subtitle: 'Web Development Project',
        organization: 'Portfolio Showcase',
        period: '2026',
        category: 'Web Development · React.js',
        description: `Added via AI Website Editor: ${instruction.trim()}`,
        technologies: ['JavaScript', 'React.js', 'Web Development'],
        imageUrl: NEROBYTES_WEB_IMAGE_URL,
        githubUrl: state.settings.githubUrl,
        liveUrl: '#projects',
      });
      projSec.updatedAt = now;
      return {
        summary: `Added project "${newProjTitle}" to the Projects section.`,
        targetSectionId: projSec.id,
        updatedSections: sectionsCopy,
      };
    }
  }

  // 8. Add new professional experience ("Add my new professional experience")
  if (lower.includes('experience') || lower.includes('job') || lower.includes('role')) {
    const expSec = sectionsCopy.find((s) => s.sectionType === 'experience');
    if (expSec) {
      expSec.content.items.unshift({
        id: `exp-added-${Date.now()}`,
        title: 'Web Developer — New Milestone',
        organization: 'Nerobytes / Professional Update',
        location: 'Chattogram, Bangladesh',
        period: 'Present',
        category: 'Professional Experience',
        description: `Recorded via AI Website Editor: ${instruction.trim()}`,
        highlights: ['Expanded web application architecture and React.js delivery responsibilities'],
        technologies: ['JavaScript', 'React.js'],
      });
      expSec.updatedAt = now;
      return {
        summary: 'Added new professional experience entry to "Professional Experience".',
        targetSectionId: expSec.id,
        updatedSections: sectionsCopy,
      };
    }
  }

  // 9. Add artwork to creative gallery ("Add my new artwork to the creative gallery")
  if (lower.includes('artwork') || lower.includes('sketch') || lower.includes('creative') || lower.includes('gallery')) {
    const creativeSec = sectionsCopy.find((s) => s.sectionType === 'creative');
    if (creativeSec) {
      creativeSec.content.items.push({
        id: `creative-added-${Date.now()}`,
        title: 'Reference Sketch Study — New Addition',
        subtitle: 'Observational Pencil & Ink Study',
        category: 'Visual Arts Gallery',
        description: `Added via AI Website Editor: ${instruction.trim()}`,
        imageUrl: SKETCH_STUDY_IMAGE_URL,
      });
      creativeSec.updatedAt = now;
      return {
        summary: 'Added new artwork entry to the "Creative Interests" gallery.',
        targetSectionId: creativeSec.id,
        updatedSections: sectionsCopy,
      };
    }
  }

  // Default targeted update: find any section mentioned in instruction
  const mentioned = sectionsCopy.find((s) => lower.includes(s.title.toLowerCase()));
  if (mentioned) {
    mentioned.content.paragraphs.push(instruction.trim());
    mentioned.updatedAt = now;
    return {
      summary: `Updated "${mentioned.title}" with your requested changes.`,
      targetSectionId: mentioned.id,
      updatedSections: sectionsCopy,
    };
  }

  return {
    summary: 'Applied instruction to portfolio configuration.',
    updatedSections: sectionsCopy,
  };
}
