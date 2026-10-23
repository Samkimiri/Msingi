import React from 'react';
import {
  ShieldCheck,
  Info,
  Heart,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe2,
  Calendar,
  Layers,
  ArrowUp,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 pb-28 border-t border-slate-300/80 dark:border-slate-800/90 glass-strong text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 space-y-8">
        {/* Top Branding & Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold shadow-sm">
                M
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                Msingi
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                AZ-900 Exam Prep
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Empowering African developers and students to master Microsoft Azure Fundamentals with culturally grounded analogies and high-yield study tools.
            </p>
          </div>

          {/* Compliance & Standards Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>2026 Syllabus Aligned</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-800 dark:text-blue-300">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Offline Ready PWA</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
              <Globe2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>African Localized</span>
            </div>
          </div>
        </div>

        {/* 4-Column Professional Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
          {/* Col 1: Study Modules */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Study Modules</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard & Readiness
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Practice Quizzes & Mocks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('flashcards')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Spaced Repetition Cards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('notes')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>Structured Notes</span>
                  <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-1 rounded font-bold">New</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Adaptive Study Planner
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Official Microsoft References */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>Microsoft Resources</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://learn.microsoft.com/certifications/exams/az-900/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>Official Skills Outline</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://learn.microsoft.com/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>Microsoft Learn Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://azure.microsoft.com/pricing/calculator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>Azure Pricing Calculator</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://learn.microsoft.com/certifications/practice-assessments-for-microsoft-certifications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>Official Practice Assessment</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Accuracy & Trust */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trust & Standards</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('accuracy')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Accuracy Pipeline</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About the Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rafiki')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Rafiki AI Study Buddy</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Local Storage Encrypted
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Support */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>African Community</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed specifically for learners across Kenya, Nigeria, Rwanda, Ghana, South Africa and across the continent with low-bandwidth optimization.
            </p>
            <div className="pt-1">
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ArrowUp className="w-3 h-3" />
                <span>Back to top of page</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Enterprise Legal Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 shadow-sm">
          <div className="flex items-start space-x-3">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900 dark:text-amber-100 text-xs">
                Official Certification Disclaimer: Unofficial Educational Study Aid
              </p>
              <p className="text-[11px] text-slate-600 dark:text-amber-200/80 leading-relaxed">
                Msingi is an independent open educational project and is neither affiliated with, endorsed by, sponsored by, nor certified by Microsoft Corporation. "Microsoft", "Azure", and "AZ-900" are registered trademarks of Microsoft Corporation. All curriculum outlines and reference links are derived from the publicly available official Microsoft Learn skills measured standard. Readiness scores represent simulated estimates and do not guarantee official exam outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            <span>© 2026 Msingi Initiative • Built for </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">#1MillionDevs</span>
            <span> African Tech Ecosystem</span>
          </div>

          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>for future cloud architects</span>
          </div>
        </div>
      </div>
    </footer>
  );
};