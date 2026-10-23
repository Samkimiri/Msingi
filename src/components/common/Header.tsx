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
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sunset-500 to-sunset-700 flex items-center justify-center shadow-glow-orange group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-lg tracking-tight">M</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-white tracking-tight">Msingi</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-sunset-500/20 text-sunset-400 border border-sunset-500/30">
                AZ-900
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Foundation for Cloud Success</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Streak indicator */}
          <div 
            title="Active learning streak"
            className="flex items-center space-x-1 bg-surface-light/80 border border-surface-border px-2.5 py-1 rounded-full text-xs font-semibold text-amber-400"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakDays}d</span>
          </div>

          {/* Accuracy & Fact-Check link */}
          <button
            onClick={() => onNavigate('accuracy')}
            className={`hidden sm:flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
              currentPage === 'accuracy'
                ? 'bg-savannah-500/20 text-savannah-400 border-savannah-500/40'
                : 'text-slate-300 border-surface-border hover:bg-surface-light'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </button>

          {/* Quick Rafiki AI Buddy button */}
          <button
            onClick={onOpenRafiki}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-sunset-500 to-amber-600 hover:from-sunset-600 hover:to-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-glow-orange transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Ask</span>
            <span>Rafiki</span>
          </button>
        </div>
      </div>
    </header>
  );
};

