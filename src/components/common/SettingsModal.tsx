import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Moon,
  Sun,
  Laptop,
  Languages,
  Sparkles,
  Zap,
  Check,
  Sliders,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { SupportedLanguage, UserProfile } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  profile: UserProfile;
  onProfileUpdate: (updated: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  profile,
  onProfileUpdate,
}) => {
  if (!isOpen) return null;

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    const updated = { ...profile, preferred_language: lang };
    StorageService.saveProfile(updated);
    onProfileUpdate(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="glass-strong rounded-2xl max-w-md w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 sm:space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Learner Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting 1: Theme & Background Appearance */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>Visual Theme & Background</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onThemeChange('light')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all active:scale-95 ${
                currentTheme === 'light'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Glass</span>
              </div>
              {currentTheme === 'light' && <Check className="w-4 h-4 text-blue-600" />}
            </button>

            <button
              onClick={() => onThemeChange('dark')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all active:scale-95 ${
                currentTheme === 'dark'
                  ? 'border-indigo-500 bg-indigo-950/60 text-indigo-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Darker Mode</span>
              </div>
              {currentTheme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Darker mode renders deep midnight frosted glass with luminous Azure and Dusk aurora glows.
          </p>
        </div>

        {/* Setting 2: Rafiki AI Preferred Language */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-blue-600" />
            <span>Rafiki AI Language</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['English', 'Kiswahili', 'Sheng', 'Nigerian Pidgin'] as SupportedLanguage[]).map(
              lang => {
                const isSelected = profile.preferred_language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all active:scale-95 flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Save & Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

