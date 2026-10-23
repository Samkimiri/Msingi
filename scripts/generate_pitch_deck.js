import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pptxgen = require('pptxgenjs');
import path from 'path';
import fs from 'fs';

// Initialize Presentation
const pres = new pptxgen();

// Set 16:9 Widescreen Layout
pres.layout = 'LAYOUT_16x9';
pres.author = 'Msingi Initiative';
pres.company = 'Msingi Cloud Learning';
pres.title = 'Msingi - Professional Project Pitch Deck';
pres.subject = 'Microsoft Azure Fundamentals (AZ-900) Exam Prep for African Learners';

// Brand Color Palette
const COLORS = {
  bgDark: '0F172A',      // Deep Slate Navy
  bgCardDark: '1E293B',  // Slate 800
  bgLight: 'F8FAFC',     // Slate 50
  bgCardLight: 'FFFFFF', // Pure White
  azure: '0078D4',       // Official Microsoft Azure Blue
  azureLight: 'EFF6FF',  // Azure 50
  indigo: '4F46E5',      // Dusk Indigo
  savannah: '059669',    // Savannah Emerald Green
  amber: 'D97706',       // African Sunset Amber
  textPrimary: '0F172A',
  textSecondary: '475569',
  textMuted: '94A3B8',
  white: 'FFFFFF',
  borderLight: 'E2E8F0',
  borderDark: '334155',
};

// =========================================================================
// SLIDE 1: Title Slide (Executive Cover)
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgDark };

  // Decorative Accent Bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y: 1.0,
    w: 0.15,
    h: 5.2,
    fill: { color: COLORS.azure },
  });

  // Category Tag
  slide.addText('EDTECH & CLOUD ACCELERATION • AZ-900 PREPARATION', {
    x: 1.2,
    y: 1.0,
    w: 10.5,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });

  // Main Project Title
  slide.addText('Msingi', {
    x: 1.2,
    y: 1.4,
    w: 10.5,
    h: 1.3,
    fontSize: 54,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.white,
  });

  // Tagline & Description
  slide.addText('Foundation for Cloud Success in Africa', {
    x: 1.2,
    y: 2.8,
    w: 10.5,
    h: 0.6,
    fontSize: 22,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.amber,
  });

  slide.addText(
    'An AI-powered, culturally-grounded exam preparation platform built to empower 1 Million African developers to master and pass the Microsoft Azure Fundamentals (AZ-900) certification.',
    {
      x: 1.2,
      y: 3.5,
      w: 10.0,
      h: 1.2,
      fontSize: 15,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      lineSpacing: 22,
    }
  );

  // Feature Badges
  const badges = [
    { text: '✓ 2026 Microsoft Syllabus Aligned', color: COLORS.savannah },
    { text: '⚡ Offline PWA Capable', color: COLORS.azure },
    { text: '🌍 African Analogies & Languages', color: COLORS.amber },
    { text: '🤖 Rafiki Gemini AI Tutor', color: COLORS.indigo },
  ];

  badges.forEach((b, i) => {
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.2 + i * 2.7,
      y: 5.0,
      w: 2.5,
      h: 0.45,
      rectRadius: 0.1,
      fill: { color: COLORS.bgCardDark },
      line: { color: b.color, width: 1.5 },
    });
    slide.addText(b.text, {
      x: 1.2 + i * 2.7,
      y: 5.0,
      w: 2.5,
      h: 0.45,
      fontSize: 9.5,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.white,
      align: 'center',
      valign: 'middle',
    });
  });

  // Live URL Footer
  slide.addText('Live Web App: https://msingi-app.vercel.app  •  Open-Source on GitHub', {
    x: 1.2,
    y: 6.4,
    w: 10.5,
    h: 0.4,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLORS.textMuted,
  });
}

// =========================================================================
// SLIDE 2: The Problem (The African Cloud Gap)
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgLight };

  // Header
  slide.addText('THE PROBLEM', {
    x: 0.8,
    y: 0.6,
    w: 11,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });
  slide.addText('The Certification Barrier for African Cloud Talent', {
    x: 0.8,
    y: 0.9,
    w: 11,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.textPrimary,
  });

  const cards = [
    {
      num: '01',
      title: 'Abstract Cultural Disconnect',
      desc: 'Official cloud training materials use foreign enterprise analogies (US banking, Silicon Valley retail) that do not resonate with African tech learners starting their cloud journey.',
      accent: COLORS.amber,
    },
    {
      num: '02',
      title: 'High Exam Failure Cost',
      desc: 'At $99–$165 USD per attempt, failing an AZ-900 exam represents 25–40% of an entry-level African developer’s monthly income. Rote memorization without true comprehension leads to costly exam retakes.',
      accent: COLORS.azure,
    },
    {
      num: '03',
      title: 'Connectivity & Bandwidth Barriers',
      desc: 'Heavy video-based courses (Coursera, Udemy) require continuous high-speed data. Frequent mobile data cutoffs and load shedding disrupt continuous learning momentum across the continent.',
      accent: COLORS.savannah,
    },
  ];

  cards.forEach((c, i) => {
    const xPos = 0.8 + i * 3.8;
    // Card Box
    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 3.5,
      h: 4.4,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderLight, width: 1.5 },
    });

    // Top Accent strip
    slide.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 1.8,
      w: 3.5,
      h: 0.12,
      fill: { color: c.accent },
    });

    slide.addText(c.num, {
      x: xPos + 0.3,
      y: 2.1,
      w: 2.9,
      h: 0.5,
      fontSize: 26,
      fontFace: 'Arial',
      bold: true,
      color: c.accent,
    });

    slide.addText(c.title, {
      x: xPos + 0.3,
      y: 2.7,
      w: 2.9,
      h: 0.7,
      fontSize: 16,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.textPrimary,
    });

    slide.addText(c.desc, {
      x: xPos + 0.3,
      y: 3.5,
      w: 2.9,
      h: 2.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: COLORS.textSecondary,
      lineSpacing: 18,
    });
  });
}

// =========================================================================
// SLIDE 3: The Solution (Msingi: The Cloud Companion)
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgDark };

  // Header
  slide.addText('THE SOLUTION', {
    x: 0.8,
    y: 0.6,
    w: 11,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });
  slide.addText('Msingi: Culturally Grounded, AI-Powered Exam Mastery', {
    x: 0.8,
    y: 0.9,
    w: 11,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.white,
  });

  // Pillars Container
  const pillars = [
    {
      title: '🌍 African-Centered Mental Models',
      desc: 'Translates abstract cloud concepts into vivid, intuitive African analogies: CapEx vs OpEx via generators vs prepaid electricity tokens; Availability Zones via matatu/danfo transport fleets; Shared Responsibility via apartment tenancy.',
    },
    {
      title: '🤖 Rafiki AI: 24/7 Contextual Study Buddy',
      desc: 'Powered by Google Gemini with strict AZ-900 curriculum guardrails. Multilingual in English, Kiswahili, Sheng, and Nigerian Pidgin. Responds with official Microsoft terminology while breaking down complex questions with voice synthesis.',
    },
    {
      title: '⚡ Offline-First Mobile PWA Architecture',
      desc: 'Engineered as a lightweight Progressive Web App that works seamlessly offline in unstable network conditions. Zero layout shifts (CLS = 0), low-power throttling, and localStorage data persistence.',
    },
    {
      title: '🎯 Calibrated Readiness Score Engine',
      desc: 'Replaces false confidence with a Bayesian readiness algorithm weighted to Microsoft’s exact July 2026 syllabus outline (25-30% Concepts, 35-40% Architecture, 30-35% Governance).',
    },
  ];

  pillars.forEach((p, i) => {
    const xPos = 0.8 + (i % 2) * 5.8;
    const yPos = 1.8 + Math.floor(i / 2) * 2.3;

    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.4,
      h: 2.0,
      rectRadius: 0.15,
      fill: { color: COLORS.bgCardDark },
      line: { color: COLORS.borderDark, width: 1 },
    });

    slide.addText(p.title, {
      x: xPos + 0.3,
      y: yPos + 0.2,
      w: 4.8,
      h: 0.45,
      fontSize: 15,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.amber,
    });

    slide.addText(p.desc, {
      x: xPos + 0.3,
      y: yPos + 0.7,
      w: 4.8,
      h: 1.15,
      fontSize: 11.5,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      lineSpacing: 16,
    });
  });
}

// =========================================================================
// SLIDE 4: Core Features (The 4 Learning Modes)
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgLight };

  slide.addText('CORE PRODUCT CAPABILITIES', {
    x: 0.8,
    y: 0.6,
    w: 11,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });
  slide.addText('Four Scientifically Engineered Study Engines', {
    x: 0.8,
    y: 0.9,
    w: 11,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.textPrimary,
  });

  const features = [
    {
      tag: 'CALIBRATION',
      title: 'Exam Readiness Gauge',
      details: [
        'Domain-weighted readiness score (0–100%)',
        'Topic-level mastery heatmaps across 15 skills',
        'Detects weak concepts and auto-generates drill sets',
      ],
      color: COLORS.savannah,
    },
    {
      tag: 'ACTIVE RECALL',
      title: 'SM-2 Spaced Repetition',
      details: [
        'SuperMemo-2 spaced interval scheduling',
        'African analogy cards with "Why It Matters" tips',
        'Daily retention queues to eliminate last-minute cramming',
      ],
      color: COLORS.azure,
    },
    {
      tag: 'SIMULATION',
      title: 'Timed Mock Exams',
      details: [
        '40-question randomized mock exams with 45-min timer',
        'Shuffled answer choices across A, B, C, and D positions',
        'Detailed rationale breakdowns for every option',
      ],
      color: COLORS.indigo,
    },
    {
      tag: 'STRUCTURED STUDY',
      title: 'Gamified Notes & Checkpoints',
      details: [
        '14 structured topics picked directly from Microsoft Learn',
        'Interactive knowledge checkpoints with +25 XP rewards',
        'Milestone achievement badges (Explorer to Scholar)',
      ],
      color: COLORS.amber,
    },
  ];

  features.forEach((f, i) => {
    const xPos = 0.8 + i * 2.85;
    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 2.65,
      h: 4.4,
      rectRadius: 0.12,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderLight, width: 1.5 },
    });

    slide.addText(f.tag, {
      x: xPos + 0.25,
      y: 2.1,
      w: 2.15,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      bold: true,
      color: f.color,
    });

    slide.addText(f.title, {
      x: xPos + 0.25,
      y: 2.45,
      w: 2.15,
      h: 0.7,
      fontSize: 15,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.textPrimary,
    });

    f.details.forEach((d, idx) => {
      slide.addText(`• ${d}`, {
        x: xPos + 0.25,
        y: 3.3 + idx * 1.0,
        w: 2.15,
        h: 0.9,
        fontSize: 10.5,
        fontFace: 'Arial',
        color: COLORS.textSecondary,
        lineSpacing: 15,
      });
    });
  });
}

// =========================================================================
// SLIDE 5: Deep Dive (Rafiki AI Study Buddy)
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgDark };

  slide.addText('AI INNOVATION SPOTLIGHT', {
    x: 0.8,
    y: 0.6,
    w: 11,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });
  slide.addText('Rafiki AI: Context-Aware African Study Companion', {
    x: 0.8,
    y: 0.9,
    w: 11,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.white,
  });

  // Left: Feature Columns
  const leftFeatures = [
    {
      title: 'Strict Course Scope Guardrails',
      desc: 'Rafiki recognizes non-cloud questions (sports, cooking, general coding) and politely alerts the student to stay focused on the official AZ-900 syllabus while welcoming friendly greetings.',
    },
    {
      title: 'Multilingual African Intelligence',
      desc: 'Seamlessly switches tone between English, Kiswahili (Jambo rafiki!), Sheng (Niaje msee!), and Nigerian Pidgin (How far my person!) while preserving technical English terms required on the exam.',
    },
    {
      title: 'Speech Synthesis & Quick Actions',
      desc: 'Integrated Web Speech API read-aloud functionality for auditory learners and low-literacy accessibility, alongside one-click copy to clipboard and issue reporting.',
    },
  ];

  leftFeatures.forEach((item, i) => {
    slide.addText(item.title, {
      x: 0.8,
      y: 1.8 + i * 1.5,
      w: 5.2,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.amber,
    });
    slide.addText(item.desc, {
      x: 0.8,
      y: 2.25 + i * 1.5,
      w: 5.2,
      h: 0.9,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      lineSpacing: 16,
    });
  });

  // Right: Real Dialogue Card
  slide.addShape(pres.ShapeType.roundRect, {
    x: 6.5,
    y: 1.8,
    w: 5.8,
    h: 4.4,
    rectRadius: 0.15,
    fill: { color: COLORS.bgCardDark },
    line: { color: COLORS.azure, width: 1.5 },
  });

  slide.addText('LIVE RAFIKI ANALOGY IN ACTION', {
    x: 6.8,
    y: 2.05,
    w: 5.2,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });

  // Student Bubble
  slide.addShape(pres.ShapeType.roundRect, {
    x: 6.8,
    y: 2.45,
    w: 5.2,
    h: 0.65,
    rectRadius: 0.08,
    fill: { color: COLORS.azure },
  });
  slide.addText('Student: "Explain the Shared Responsibility Model simply."', {
    x: 6.95,
    y: 2.45,
    w: 4.9,
    h: 0.65,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.white,
    valign: 'middle',
  });

  // Rafiki Bubble
  slide.addShape(pres.ShapeType.roundRect, {
    x: 6.8,
    y: 3.25,
    w: 5.2,
    h: 2.65,
    rectRadius: 0.08,
    fill: { color: COLORS.bgDark },
    line: { color: COLORS.borderDark, width: 1 },
  });
  slide.addText(
    'Rafiki: "Think of renting an apartment in Nairobi or Lagos:\n\n• The Landlord (Microsoft): Maintains the building foundations, concrete walls, security perimeter, and power backup.\n• You (The Tenant): ALWAYS 100% responsible for locking your door, keeping your safe secure, and who you give keys to (Your Data, Identities, and Devices).\n\nExam Watch: In SaaS (like Microsoft 365), you ALWAYS own data security!"',
    {
      x: 7.0,
      y: 3.35,
      w: 4.8,
      h: 2.45,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      lineSpacing: 15,
    }
  );
}

// =========================================================================
// SLIDE 6: Curriculum Alignment (AZ-900 Official Specs)
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgLight };

  slide.addText('OFFICIAL CURRICULUM GROUNDING', {
    x: 0.8,
    y: 0.6,
    w: 11,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });
  slide.addText('100% Aligned to Microsoft AZ-900 Skills Measured', {
    x: 0.8,
    y: 0.9,
    w: 11,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.textPrimary,
  });

  const domains = [
    {
      domain: 'Domain 1',
      title: 'Describe Cloud Concepts',
      weight: '25% – 30%',
      color: COLORS.azure,
      topics: [
        'Cloud computing definitions & economics',
        'Shared responsibility model across IaaS/PaaS/SaaS',
        'Public, private, hybrid, and multi-cloud models',
        'Consumption-based pricing: CapEx vs. OpEx',
        'Benefits: High Availability, Scalability, Elasticity',
      ],
    },
    {
      domain: 'Domain 2',
      title: 'Azure Architecture & Services',
      weight: '35% – 40%',
      color: COLORS.indigo,
      topics: [
        'Regions, Availability Zones, and Region Pairs',
        'Management Groups, Subscriptions & Resource Groups',
        'Compute: VMs, App Services, Functions, ACI, AKS',
        'Storage: Blob, Files, Disks, Tiers & Redundancy',
        'Networking: VNets, Subnets, VPN, ExpressRoute',
        'Identity: Microsoft Entra ID & Zero Trust',
      ],
    },
    {
      domain: 'Domain 3',
      title: 'Azure Management & Governance',
      weight: '30% – 35%',
      color: COLORS.savannah,
      topics: [
        'Cost Management, Pricing & TCO Calculators',
        'Azure Policy vs. RBAC vs. Resource Locks',
        'Azure Monitor, Log Analytics & Service Health',
        'Microsoft Defender for Cloud & Purview compliance',
        'Trust Center & Service Trust Portal audits',
      ],
    },
  ];

  domains.forEach((d, i) => {
    const xPos = 0.8 + i * 3.8;

    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 3.5,
      h: 4.5,
      rectRadius: 0.12,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderLight, width: 1.5 },
    });

    slide.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 1.8,
      w: 3.5,
      h: 0.1,
      fill: { color: d.color },
    });

    slide.addText(d.domain, {
      x: xPos + 0.3,
      y: 2.1,
      w: 2.9,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: d.color,
    });

    slide.addText(d.title, {
      x: xPos + 0.3,
      y: 2.4,
      w: 2.9,
      h: 0.6,
      fontSize: 16,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.textPrimary,
    });

    slide.addText(`Exam Weight: ${d.weight}`, {
      x: xPos + 0.3,
      y: 3.0,
      w: 2.9,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.amber,
    });

    d.topics.forEach((t, idx) => {
      slide.addText(`✓ ${t}`, {
        x: xPos + 0.3,
        y: 3.4 + idx * 0.5,
        w: 2.9,
        h: 0.45,
        fontSize: 10,
        fontFace: 'Arial',
        color: COLORS.textSecondary,
      });
    });
  });
}

// =========================================================================
// SLIDE 7: Technical Architecture & Design System
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgDark };

  slide.addText('TECHNICAL EXCELLENCE', {
    x: 0.8,
    y: 0.6,
    w: 11,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });
  slide.addText('Modern Front-End Engineering & Motion Graphics', {
    x: 0.8,
    y: 0.9,
    w: 11,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.white,
  });

  const techStack = [
    {
      title: 'Next.js & Vite React 18',
      desc: 'Modular component architecture with strict TypeScript typing, sub-second hot reload, and production bundling.',
    },
    {
      title: 'Glassmorphism Design System',
      desc: 'Multi-layer frosted glass surfaces with backdrop-filter blur, WCAG 2.1 AA verified contrast, and full Dark Mode.',
    },
    {
      title: '60 FPS Motion Graphics Backdrop',
      desc: 'GPU-accelerated ambient aurora glows, panning African textile grids, continuous bottom waves, and floating bubbles.',
    },
    {
      title: 'Serverless AI & Offline Resilience',
      desc: 'Vercel Serverless Edge Functions powering Gemini AI, paired with an offline rule engine when data is unavailable.',
    },
  ];

  techStack.forEach((t, i) => {
    const xPos = 0.8 + (i % 2) * 5.8;
    const yPos = 1.8 + Math.floor(i / 2) * 2.3;

    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.4,
      h: 2.0,
      rectRadius: 0.12,
      fill: { color: COLORS.bgCardDark },
      line: { color: COLORS.borderDark, width: 1 },
    });

    slide.addText(t.title, {
      x: xPos + 0.3,
      y: yPos + 0.25,
      w: 4.8,
      h: 0.4,
      fontSize: 15,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.azure,
    });

    slide.addText(t.desc, {
      x: xPos + 0.3,
      y: yPos + 0.75,
      w: 4.8,
      h: 1.0,
      fontSize: 11.5,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      lineSpacing: 16,
    });
  });
}

// =========================================================================
// SLIDE 8: Market Opportunity & Target Impact
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgLight };

  slide.addText('MARKET OPPORTUNITY & SOCIAL IMPACT', {
    x: 0.8,
    y: 0.6,
    w: 11,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });
  slide.addText('Empowering the Next Generation of African Cloud Builders', {
    x: 0.8,
    y: 0.9,
    w: 11,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.textPrimary,
  });

  const stats = [
    { stat: '700M+', label: 'Sub-Saharan Youth Population', sub: 'World\'s youngest and fastest growing digital workforce.' },
    { stat: '1 Million', label: 'African Developers Initiative', sub: 'Target cohort entering global cloud and AI careers by 2030.' },
    { stat: '$90K+', label: 'Certified Cloud Average Salary', sub: 'Cloud certification accelerates earning power and upward mobility.' },
  ];

  stats.forEach((s, i) => {
    const xPos = 0.8 + i * 3.8;
    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 3.5,
      h: 4.4,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderLight, width: 1.5 },
    });

    slide.addText(s.stat, {
      x: xPos + 0.3,
      y: 2.2,
      w: 2.9,
      h: 0.8,
      fontSize: 34,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.azure,
      align: 'center',
    });

    slide.addText(s.label, {
      x: xPos + 0.3,
      y: 3.1,
      w: 2.9,
      h: 0.6,
      fontSize: 14,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.textPrimary,
      align: 'center',
    });

    slide.addText(s.sub, {
      x: xPos + 0.3,
      y: 3.8,
      w: 2.9,
      h: 1.8,
      fontSize: 12,
      fontFace: 'Arial',
      color: COLORS.textSecondary,
      align: 'center',
      lineSpacing: 18,
    });
  });
}

// =========================================================================
// SLIDE 9: Roadmap & Strategic Milestones
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgDark };

  slide.addText('GROWTH & EXECUTION', {
    x: 0.8,
    y: 0.6,
    w: 11,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
  });
  slide.addText('Product Milestones & Strategic Roadmap', {
    x: 0.8,
    y: 0.9,
    w: 11,
    h: 0.6,
    fontSize: 28,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.white,
  });

  const phases = [
    {
      phase: 'PHASE 1 • COMPLETED',
      title: 'Foundation & Core Engine',
      items: [
        'Complete AZ-900 syllabus mapping & verified question bank',
        'Bayesian exam readiness gauge with domain weight calibration',
        'SuperMemo-2 spaced repetition flashcards algorithm',
        'Rafiki AI study buddy with multilingual African analogies',
        '14 structured notes with +25 XP gamification checkpoints',
        'Glassmorphic UI design system with Darker Mode settings',
      ],
      color: COLORS.savannah,
    },
    {
      phase: 'PHASE 2 • NEXT 60 DAYS',
      title: 'Community & Peer Collaboration',
      items: [
        'Live peer study circles & mock exam multiplayer battles',
        'Audio-first flashcard podcasts for low-bandwidth commuters',
        'University and developer hub leaderboard integrations',
        'Expansion to Microsoft Azure Administrator (AZ-104) syllabus',
      ],
      color: COLORS.azure,
    },
    {
      phase: 'PHASE 3 • NEXT 180 DAYS',
      title: 'Scale & Institutional Partnerships',
      items: [
        'Enterprise upskilling dashboards for African tech startups',
        'Partnerships with universities in Kenya, Nigeria, Rwanda & SA',
        'Voucher sponsorship matching for underrepresented learners',
        'Expansion to multi-cloud fundamentals (AWS Cloud Practitioner & GCP)',
      ],
      color: COLORS.amber,
    },
  ];

  phases.forEach((p, i) => {
    const xPos = 0.8 + i * 3.8;
    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 3.5,
      h: 4.5,
      rectRadius: 0.12,
      fill: { color: COLORS.bgCardDark },
      line: { color: p.color, width: 1.5 },
    });

    slide.addText(p.phase, {
      x: xPos + 0.3,
      y: 2.1,
      w: 2.9,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: p.color,
    });

    slide.addText(p.title, {
      x: xPos + 0.3,
      y: 2.4,
      w: 2.9,
      h: 0.5,
      fontSize: 15,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.white,
    });

    p.items.forEach((item, idx) => {
      slide.addText(`• ${item}`, {
        x: xPos + 0.3,
        y: 3.1 + idx * 0.55,
        w: 2.9,
        h: 0.5,
        fontSize: 10,
        fontFace: 'Arial',
        color: COLORS.textMuted,
        lineSpacing: 14,
      });
    });
  });
}

// =========================================================================
// SLIDE 10: Call to Action & Conclusion
// =========================================================================
{
  const slide = pres.addSlide();
  slide.background = { color: COLORS.bgDark };

  // Large Center Callout
  slide.addShape(pres.ShapeType.roundRect, {
    x: 1.5,
    y: 1.0,
    w: 9.8,
    h: 5.2,
    rectRadius: 0.2,
    fill: { color: COLORS.bgCardDark },
    line: { color: COLORS.azure, width: 2 },
  });

  slide.addText('JOIN THE MISSION', {
    x: 2.0,
    y: 1.4,
    w: 8.8,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.azure,
    align: 'center',
  });

  slide.addText('Building Africa\'s Cloud-Certified Future Together', {
    x: 2.0,
    y: 1.9,
    w: 8.8,
    h: 0.8,
    fontSize: 32,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.white,
    align: 'center',
  });

  slide.addText(
    'Msingi is ready to scale across developer communities, student clubs, and tech bootcamps. Partner with us to sponsor exam vouchers, integrate curriculum, or support the open-source platform.',
    {
      x: 2.2,
      y: 2.8,
      w: 8.4,
      h: 1.0,
      fontSize: 14,
      fontFace: 'Arial',
      color: COLORS.textMuted,
      align: 'center',
      lineSpacing: 22,
    }
  );

  // Link Buttons
  const links = [
    { label: '🌐 Live Application', val: 'https://msingi-app.vercel.app' },
    { label: '💻 GitHub Codebase', val: 'https://github.com/Samkimiri/Msingi' },
    { label: '🎓 Target Exam', val: 'Microsoft Azure AZ-900 (2026 Aligned)' },
  ];

  links.forEach((l, i) => {
    const xPos = 2.0 + i * 2.9;
    slide.addShape(pres.ShapeType.roundRect, {
      x: xPos,
      y: 4.1,
      w: 2.7,
      h: 1.1,
      rectRadius: 0.1,
      fill: { color: COLORS.bgDark },
      line: { color: COLORS.borderDark, width: 1 },
    });

    slide.addText(l.label, {
      x: xPos + 0.1,
      y: 4.25,
      w: 2.5,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: COLORS.amber,
      align: 'center',
    });

    slide.addText(l.val, {
      x: xPos + 0.1,
      y: 4.65,
      w: 2.5,
      h: 0.45,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: COLORS.white,
      align: 'center',
    });
  });

  slide.addText('© 2026 Msingi Initiative • Built for #1MillionDevs African Tech Ecosystem', {
    x: 2.0,
    y: 5.5,
    w: 8.8,
    h: 0.4,
    fontSize: 10.5,
    fontFace: 'Arial',
    color: COLORS.textMuted,
    align: 'center',
  });
}

// Ensure docs directory exists
const outputDir = path.resolve(process.cwd(), 'docs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'Msingi_AZ900_Project_Pitch_Deck.pptx');

console.log('Generating PowerPoint pitch deck at:', outputPath);

pres
  .writeFile({ fileName: outputPath })
  .then(() => {
    console.log('SUCCESS: PowerPoint presentation successfully generated at:', outputPath);
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR generating PowerPoint presentation:', err);
    process.exit(1);
  });
