import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Layers, Calendar, MessageSquareText } from 'lucide-react';
import { MOTION_CONFIG } from '../../lib/motion';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  dueCardsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  dueCardsCount = 0,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'quiz', label: 'Quiz', icon: CheckSquare },
    { id: 'flashcards', label: 'Cards', icon: Layers, badge: dueCardsCount > 0 ? dueCardsCount : undefined },
    { id: 'planner', label: 'Plan', icon: Calendar },
    { id: 'rafiki', label: 'Rafiki', icon: MessageSquareText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav pt-1.5 pb-safe px-2 sm:px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.94 }}
              className={`flex flex-col items-center justify-center py-1 px-2 xs:px-3 rounded-xl transition-colors relative flex-1 max-w-[76px] ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5"
                  transition={MOTION_CONFIG.springs.snappy}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
