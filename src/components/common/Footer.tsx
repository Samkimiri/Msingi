import React from 'react';
import { ShieldCheck, Info, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 pb-24 border-t border-slate-200/80 glass-subtle text-slate-600 text-xs">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Mandatory Compliance Box */}
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/90 mb-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">
                Msingi is an unofficial study tool. Not affiliated with or endorsed by Microsoft. AZ-900 is a Microsoft exam.
              </p>
              <p className="text-[11px] text-slate-600">
                Based on the AZ-900 skills measured as of July 20, 2026. The readiness score is an estimate, not a guarantee of exam success.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-4 text-slate-600 font-medium">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-blue-700 transition-colors active:scale-95"
            >
              About Msingi
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('accuracy')}
              className="hover:text-emerald-700 transition-colors flex items-center space-x-1 active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Content Accuracy Pipeline</span>
            </button>
            <span>•</span>
            <a
              href="https://learn.microsoft.com/certifications/exams/az-900/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors flex items-center space-x-1 active:scale-95"
            >
              <span>Microsoft Learn Outline</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for African learners • #1MillionDevs Hackathon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
