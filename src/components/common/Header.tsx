import React from 'react';
import { Flame, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  profile: UserProfile;
  streakDays: number;
  onOpenRafiki: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  streakDays,
  onOpenRafiki,
  currentPage,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2.5 cursor-pointer group active:scale-[0.98] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-lg tracking-tight">M</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">Msingi</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                AZ-900
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Foundation for Cloud Success</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Streak indicator */}
          <div 
            title="Active learning streak"
            className="flex items-center space-x-1 bg-amber-50/90 border border-amber-200/90 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-700 shadow-sm"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakDays}d</span>
          </div>

          {/* Accuracy & Fact-Check link */}
          <button
            onClick={() => onNavigate('accuracy')}
            className={`hidden sm:flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all active:scale-[0.97] hover:-translate-y-px ${
              currentPage === 'accuracy'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accuracy</span>
          </button>

          {/* Quick Rafiki AI Buddy button with Primary Shimmer Sweep */}
          <button
            onClick={onOpenRafiki}
            className="btn-shimmer flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md shadow-blue-500/20 transition-all hover:-translate-y-px active:scale-[0.97]"
          >
            <Sparkles className="w-3.5 h-3.5 relative z-10" />
            <span className="hidden xs:inline relative z-10">Ask</span>
            <span className="relative z-10">Rafiki</span>
          </button>
        </div>
      </div>
    </header>
  );
};
