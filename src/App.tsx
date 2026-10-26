import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MotionBackground } from './components/MotionBackground';
import { pageVariants } from './lib/motion';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { HomeDashboard } from './pages/HomeDashboard';
import { QuizPage } from './pages/QuizPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { PlannerPage } from './pages/PlannerPage';
import { RafikiPage } from './pages/RafikiPage';
import { AccuracyPage } from './pages/AccuracyPage';
import { AboutPage } from './pages/AboutPage';
import { NotesPage } from './pages/NotesPage';
import { SettingsModal } from './components/common/SettingsModal';
import { StorageService } from './lib/storage';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Question, UserProfile } from './types';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [hasPlan, setHasPlan] = useState<boolean>(() => !!StorageService.getStudyPlan());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!hasPlan);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [quizParams, setQuizParams] = useState<{ mode?: any; domainId?: string }>({});
  const [rafikiQuestion, setRafikiQuestion] = useState<Question | null>(null);

  // Theme settings (Light / Darker Mode)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => StorageService.getTheme());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Real-time network connectivity status
  const { isOnline, wasOffline } = useOnlineStatus();

  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const handleToggleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(next);
    StorageService.setTheme(next);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setCurrentTheme(newTheme);
    StorageService.setTheme(newTheme);
  };

  // Reload profile and plan when onboarding completes
  const handleOnboardingComplete = () => {
    setProfile(StorageService.getProfile());
    setHasPlan(true);
    setIsOnboardingOpen(false);
    setCurrentPage('home');
  };

  // Calculate learning streak days
  const streakDays = useMemo(() => {
    const attempts = StorageService.getAttempts();
    if (attempts.length === 0) return 1;

    const uniqueDays = new Set(
      attempts.map(a => a.created_at.split('T')[0])
    );
    return Math.max(1, uniqueDays.size);
  }, []);

  // Calculate count of due flashcards
  const dueCardsCount = useMemo(() => {
    const progress = StorageService.getCardProgress();
    const now = new Date();
    let count = 0;
    Object.values(progress).forEach(p => {
      if (new Date(p.due_at) <= now) {
        count++;
      }
    });
    return count;
  }, [currentPage]);

  // Handle navigation with optional parameters
  const handleNavigate = (page: string, params?: { mode?: any; domainId?: string }) => {
    if (params) {
      setQuizParams(params);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Rafiki with question context
  const handleOpenRafikiWithQuestion = (question: Question) => {
    setRafikiQuestion(question);
    setCurrentPage('rafiki');
  };

  // Determine MotionBackground variant based on screen activity
  const bgVariant: 'default' | 'calm' | 'celebrate' = useMemo(() => {
    if (currentPage === 'quiz' || currentPage === 'flashcards') return 'calm';
    return 'default';
  }, [currentPage]);

  if (isOnboardingOpen) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-700 relative">
      {/* Decorative Glassmorphic Motion Graphics Layer - Sits at z-0, above base bg, behind UI */}
      <MotionBackground variant={bgVariant} />

      {/* Primary UI Layer at relative z-10 - Frosted glass elements blur MotionBackground */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          profile={profile}
          streakDays={streakDays}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenRafiki={() => handleNavigate('rafiki')}
          currentTheme={currentTheme}
          onToggleTheme={handleToggleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isOnline={isOnline}
        />

        {/* Offline & Reconnection Status Banners */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-500/90 dark:bg-amber-600/90 text-white text-xs font-semibold py-2 px-3 text-center flex items-center justify-center space-x-2 shadow-sm border-b border-amber-600/40 backdrop-blur-sm"
            >
              <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Offline Mode Active • All quizzes, notes, flashcards & Rafiki AI are cached and work 100% offline!</span>
            </motion.div>
          )}
          {isOnline && wasOffline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-600/95 dark:bg-emerald-700/95 text-white text-xs font-semibold py-2 px-3 text-center flex items-center justify-center space-x-2 shadow-sm border-b border-emerald-700/40 backdrop-blur-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Back online! Your offline study sessions and attempts remain fully preserved.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area with 300ms Page Transitions */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-24 sm:pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {currentPage === 'home' && (
                <HomeDashboard
                  profile={profile}
                  onNavigate={handleNavigate}
                  onOpenRafiki={() => handleNavigate('rafiki')}
                  onRetakeOnboarding={() => setIsOnboardingOpen(true)}
                />
              )}

              {currentPage === 'notes' && (
                <NotesPage
                  onNavigate={handleNavigate}
                  onOpenRafikiWithTopic={(topicTitle) =>
                    handleOpenRafikiWithQuestion({
                      id: `topic-${Date.now()}`,
                      topic_id: 'top-cloud-def',
                      stem: `Can you explain ${topicTitle} in detail with exam tips and an African analogy?`,
                      options: [],
                      correct: [],
                      explanation: '',
                      type: 'single',
                      difficulty: 'easy',
                      outline_skill: topicTitle,
                      source_url: '',
                      status: 'verified',
                      verified_at: '',
                    } as any)
                  }
                />
              )}

              {currentPage === 'quiz' && (
                <QuizPage
                  initialMode={quizParams.mode}
                  initialDomainId={quizParams.domainId}
                  onNavigate={handleNavigate}
                  onOpenRafikiWithQuestion={handleOpenRafikiWithQuestion}
                />
              )}

              {currentPage === 'flashcards' && (
                <FlashcardsPage
                  onNavigate={handleNavigate}
                  onOpenRafiki={() => {
                    setCurrentPage('rafiki');
                  }}
                />
              )}

              {currentPage === 'planner' && (
                <PlannerPage
                  profile={profile}
                  onNavigate={handleNavigate}
                  onRetakeOnboarding={() => setIsOnboardingOpen(true)}
                />
              )}

              {currentPage === 'rafiki' && (
                <RafikiPage
                  initialQuestion={rafikiQuestion}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'accuracy' && (
                <AccuracyPage onNavigate={handleNavigate} />
              )}

              {currentPage === 'about' && (
                <AboutPage onNavigate={handleNavigate} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer with Mandatory Compliance Note */}
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Mobile-First Fixed Bottom Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        dueCardsCount={dueCardsCount}
      />

      {/* Learner Settings & Dark Mode Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        profile={profile}
        onProfileUpdate={setProfile}
      />
    </div>
  );
};

