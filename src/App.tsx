import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { HomeDashboard } from './pages/HomeDashboard';
import { QuizPage } from './pages/QuizPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { PlannerPage } from './pages/PlannerPage';
import { RafikiPage } from './pages/RafikiPage';
import { AccuracyPage } from './pages/AccuracyPage';
import { AboutPage } from './pages/AboutPage';
import { StorageService } from './lib/storage';
import { Question, UserProfile } from './types';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [hasPlan, setHasPlan] = useState<boolean>(() => !!StorageService.getStudyPlan());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!hasPlan);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [quizParams, setQuizParams] = useState<{ mode?: any; domainId?: string }>({});
  const [rafikiQuestion, setRafikiQuestion] = useState<Question | null>(null);

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

  if (isOnboardingOpen) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Top Header */}
      <Header
        profile={profile}
        streakDays={streakDays}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenRafiki={() => handleNavigate('rafiki')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4 pb-20">
        {currentPage === 'home' && (
          <HomeDashboard
            profile={profile}
            onNavigate={handleNavigate}
            onOpenRafiki={() => handleNavigate('rafiki')}
            onRetakeOnboarding={() => setIsOnboardingOpen(true)}
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
            onOpenRafiki={(concept) => {
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
      </main>

      {/* Footer with Mandatory Compliance Note */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile-First Fixed Bottom Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        dueCardsCount={dueCardsCount}
      />
    </div>
  );
};

