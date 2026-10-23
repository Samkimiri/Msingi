import React from 'react';
import {
  Flame,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Moon,
  Sun,
  Sliders,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  profile: UserProfile;
  streakDays: number;
  onOpenRafiki: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streakDays,
  onOpenRafiki,
  currentPage,
  onNavigate,
  currentTheme,
  onToggleTheme,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2.5 cursor-pointer group active:scale-[0.98] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-lg tracking-tight">M</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Msingi</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                AZ-900
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Foundation for Cloud Success</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Notes Navigation Button */}
          <button
            onClick={() => onNavigate('notes')}
            title="Structured AZ-900 Notes"
            className={`flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all active:scale-[0.97] hover:-translate-y-px ${
              currentPage === 'notes'
                ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                : 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Notes</span>
          </button>

          {/* Theme Quick Toggle (Light / Darker Mode) */}
          <button
            onClick={onToggleTheme}
            title={currentTheme === 'dark' ? 'Switch to Light mode' : 'Switch to Darker mode'}
            className="p-1.5 sm:px-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center space-x-1"
          >
            {currentTheme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-[11px] font-medium">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline text-[11px] font-medium">Dark</span>
              </>
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            title="Learner Settings & Dark Mode"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Streak indicator */}
          <div 
            title="Active learning streak"
            className="flex items-center space-x-1 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-sm"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakDays}d</span>
          </div>

          {/* Quick Rafiki AI Buddy button with Primary Shimmer Sweep */}
          <button
            onClick={onOpenRafiki}
            className="btn-shimmer flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md shadow-blue-500/20 transition-all hover:-translate-y-px active:scale-[0.97]"
          >
            <Sparkles className="w-3.5 h-3.5 relative z-10" />
            <span className="hidden sm:inline relative z-10">Ask</span>
            <span className="relative z-10">Rafiki</span>
          </button>
        </div>
      </div>
    </header>
  );
};
