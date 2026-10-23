import React from 'react';
import { ShieldCheck, Info, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 pb-24 border-t border-surface-border bg-indigo-deep text-slate-400 text-xs">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Mandatory Compliance Box */}
        <div className="p-4 rounded-xl bg-surface/80 border border-amber-500/30 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">
                Msingi is an unofficial study tool. Not affiliated with or endorsed by Microsoft. AZ-900 is a Microsoft exam.
              </p>
              <p className="text-[11px] text-slate-400">
                Based on the AZ-900 skills measured as of July 20, 2026. The readiness score is an estimate, not a guarantee of exam success.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-4 text-slate-300">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-sunset-400 transition-colors"
            >
              About Msingi
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('accuracy')}
              className="hover:text-savannah-400 transition-colors flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Content Accuracy Pipeline</span>
            </button>
            <span>•</span>
            <a
              href="https://learn.microsoft.com/certifications/exams/az-900/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>Microsoft Learn Outline</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-sunset-500 fill-sunset-500 inline" />
            <span>for African learners • #1MillionDevs Hackathon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

