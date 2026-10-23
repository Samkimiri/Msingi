import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Layers,
  BookOpen,
  Calendar,
  ShieldCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { DOMAINS, TOPICS } from '../data/az900-syllabus';
import { SEED_QUESTIONS } from '../data/seed-questions';
import { calculateReadiness } from '../lib/readiness';
import { StorageService } from '../lib/storage';
import { UserProfile } from '../types';
import { useCountUp } from '../hooks/useCountUp';
import { cardEntranceVariants, staggerContainerVariants } from '../lib/motion';

interface HomeDashboardProps {
  profile: UserProfile;
  onNavigate: (page: string, params?: { mode?: string; domainId?: string }) => void;
  onOpenRafiki: () => void;
  onRetakeOnboarding: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  onNavigate,
  onOpenRafiki,
  onRetakeOnboarding,
}) => {
  const attempts = useMemo(() => StorageService.getAttempts(), []);
  const mockExams = useMemo(() => StorageService.getMockExams(), []);
  const cardProgress = useMemo(() => StorageService.getCardProgress(), []);
  const planTasks = useMemo(() => StorageService.getPlanTasks(), []);

  // Map questions for readiness engine
  const questionMap = useMemo(() => {
    const map: Record<string, { topic_id: string }> = {};
    SEED_QUESTIONS.forEach(q => {
      map[q.id] = { topic_id: q.topic_id };
    });
    return map;
  }, []);

  const readiness = useMemo(() => {
    return calculateReadiness(attempts, mockExams, questionMap);
  }, [attempts, mockExams, questionMap]);

  // Count due flashcards today
  const dueCardsCount = useMemo(() => {
    const now = new Date();
    let count = 0;
    Object.values(cardProgress).forEach(p => {
      if (new Date(p.due_at) <= now) {
        count++;
      }
    });
    return count;
  }, [cardProgress]);

  // Today's pending tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = planTasks.filter(t => t.date === todayStr);
  const completedTodayCount = todayTasks.filter(t => t.is_completed).length;

  // Days until target exam date
  const daysUntilExam = useMemo(() => {
    if (!profile.target_exam_date) return null;
    const examDate = new Date(profile.target_exam_date);
    const now = new Date();
    examDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diff = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [profile.target_exam_date]);

  // Gauge color based on overall score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: '#059669', text: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200' };
    if (score >= 65) return { stroke: '#D97706', text: 'text-amber-700', bg: 'bg-amber-50 border border-amber-200' };
    if (score >= 40) return { stroke: '#0284C7', text: 'text-sky-700', bg: 'bg-sky-50 border border-sky-200' };
    return { stroke: '#E11D48', text: 'text-rose-700', bg: 'bg-rose-50 border border-rose-200' };
  };

  const scoreStyle = getScoreColor(readiness.overall_score);
  const animatedScore = useCountUp(readiness.overall_score, 800);

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness.overall_score / 100) * circumference;

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-6"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={cardEntranceVariants}
        className="glass border border-blue-200/90 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-700">
                Habari, {profile.display_name}!
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 border border-slate-200 text-slate-700 shadow-sm">
                {profile.preferred_language}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Your AZ-900 Exam Foundation
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              {daysUntilExam !== null ? (
                <span>
                  Exam scheduled in <strong className="text-blue-700 font-bold">{daysUntilExam} days</strong>. Stay consistent with your daily study plan.
                </span>
              ) : (
                'Prepare systematically for the Microsoft Azure Fundamentals certification.'
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-center">
            <button
              onClick={() => onNavigate('quiz', { mode: 'mock' })}
              className="bg-white/90 hover:bg-white text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center space-x-1.5 active:scale-[0.97] hover:-translate-y-px"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Full Mock (40Q)</span>
            </button>
            <button
              onClick={() => onNavigate('quiz', { mode: 'domain' })}
              className="btn-shimmer bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 active:scale-[0.97] hover:-translate-y-px"
            >
              <Zap className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Start Quiz</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid: Readiness Score Gauge + Next Best Action */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Radial Readiness Gauge Card */}
        <motion.div
          variants={cardEntranceVariants}
          className="md:col-span-5 glass border border-slate-200/90 rounded-3xl p-5 flex flex-col items-center justify-center text-center relative shadow-sm"
        >
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Readiness Score
              </h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreStyle.bg} ${scoreStyle.text}`}
            >
              {readiness.band}
            </span>
          </div>

          {/* Radial SVG Gauge */}
          <div className="relative my-3 flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#E2E8F0"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={scoreStyle.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {animatedScore}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Recency-weighted</span>
            </div>
          </div>

          <p className="text-xs text-slate-700 max-w-xs mt-1">
            {readiness.band_description}
          </p>

          {/* Estimate Disclaimer Note */}
          <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-100 pt-2 w-full">
            * The readiness score is an estimate, not a guarantee of exam success.
          </p>
        </motion.div>

        {/* Next Best Action Card & Daily Goal */}
        <motion.div
          variants={cardEntranceVariants}
          className="md:col-span-7 flex flex-col justify-between space-y-4"
        >
          {/* Smart Next-Best-Action Box */}
          <div className="glass border border-blue-200/90 rounded-3xl p-5 shadow-sm relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Recommended Next Step
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {readiness.next_best_action.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {readiness.next_best_action.description}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {readiness.total_questions_answered} questions answered so far
              </span>
              <button
                onClick={() => {
                  if (readiness.next_best_action.type === 'flashcard') {
                    onNavigate('flashcards');
                  } else if (readiness.next_best_action.type === 'mock') {
                    onNavigate('quiz', { mode: 'mock' });
                  } else {
                    onNavigate('quiz', { mode: 'weak' });
                  }
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-100/80 hover:bg-blue-200/70 px-3 py-1.5 rounded-lg border border-blue-200 transition-all active:scale-[0.97] hover:-translate-y-px"
              >
                <span>{readiness.next_best_action.action_label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar: Streaks, Due Cards, Plan Status */}
          <div className="grid grid-cols-3 gap-3">
            <div
              onClick={() => onNavigate('flashcards')}
              className="glass hover:border-blue-400 rounded-2xl p-3 cursor-pointer transition-all shadow-sm active:scale-[0.97] hover:-translate-y-px"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold">Flashcards</span>
                <Layers className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-lg font-bold text-slate-900">{dueCardsCount}</span>
                <span className="text-[10px] text-slate-500">due today</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('planner')}
              className="glass hover:border-blue-400 rounded-2xl p-3 cursor-pointer transition-all shadow-sm active:scale-[0.97] hover:-translate-y-px"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold">Today's Plan</span>
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-lg font-bold text-slate-900">
                  {completedTodayCount}/{todayTasks.length || 2}
                </span>
                <span className="text-[10px] text-slate-500">tasks done</span>
              </div>
            </div>

            <div
              onClick={onOpenRafiki}
              className="glass hover:border-blue-400 rounded-2xl p-3 cursor-pointer transition-all shadow-sm active:scale-[0.97] hover:-translate-y-px"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold">Rafiki AI</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-lg font-bold text-slate-900 dark:text-white">24/7</span>
                <span className="text-[10px] text-slate-500">tutor ready</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('notes')}
              className="glass hover:border-blue-400 rounded-2xl p-3 cursor-pointer transition-all shadow-sm active:scale-[0.97] hover:-translate-y-px"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold">AZ-900 Notes</span>
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {StorageService.getCompletedNotes().length}/14
                </span>
                <span className="text-[10px] text-slate-500">mastered</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Banner: Structured Notes Aligned to Microsoft Learn */}
      <motion.div
        variants={cardEntranceVariants}
        onClick={() => onNavigate('notes')}
        className="glass hover:border-blue-500 rounded-3xl p-5 shadow-sm cursor-pointer transition-all active:scale-[0.99] border border-blue-200/90 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-transparent dark:from-blue-950/40 dark:via-indigo-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                Microsoft Syllabus Notes
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-500" />
                <span>+25 XP Per Topic</span>
              </span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Master AZ-900 Structured Topics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg">
              Read comprehensive, official Microsoft-grounded notes for all 14 syllabus topics with African analogies, exam watch tips, and instant checkpoints!
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center space-x-1.5 flex-shrink-0">
          <span>Read Notes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Domain Breakdown Bars */}
      <motion.div
        variants={cardEntranceVariants}
        className="glass border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">AZ-900 Domain Mastery</h3>
            <p className="text-xs text-slate-500">
              Weighted according to the official July 20, 2026 skills outline
            </p>
          </div>
          <button
            onClick={() => onNavigate('accuracy')}
            className="text-[11px] text-slate-600 hover:text-blue-700 flex items-center space-x-1 active:scale-[0.97]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Syllabus Mapping</span>
          </button>
        </div>

        <div className="space-y-4 pt-1">
          {readiness.domain_breakdowns.map(domain => {
            const hasData = domain.has_enough_data;
            const domainColor =
              domain.recent_accuracy_pct >= 80
                ? 'bg-emerald-600'
                : domain.recent_accuracy_pct >= 60
                ? 'bg-amber-500'
                : 'bg-blue-600';

            return (
              <div key={domain.domain_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-800">
                      {domain.domain_name}
                    </span>
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {domain.exam_weight_pct}% exam weight
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">
                      {hasData ? `${domain.recent_accuracy_pct}%` : `${domain.recent_accuracy_pct}% (Calibrating)`}
                    </span>
                    <button
                      onClick={() => onNavigate('quiz', { mode: 'domain', domainId: domain.domain_id })}
                      className="text-[10px] text-blue-700 font-semibold hover:underline flex items-center"
                    >
                      <span>Quiz</span>
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full ${domainColor} rounded-full`}
                    style={{
                      width: `${Math.max(5, domain.recent_accuracy_pct)}%`,
                      transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
                {!hasData && (
                  <p className="text-[10px] text-slate-500 italic">
                    Answer at least 15 questions in this domain for full calibration ({domain.attempts_count}/15).
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Topic Accuracy Heatmap Grid */}
      <motion.div
        variants={cardEntranceVariants}
        className="glass border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Syllabus Topic Heatmap</h3>
            <p className="text-xs text-slate-500">
              Instant breakdown across all 15 skills measured
            </p>
          </div>
          <div className="flex items-center space-x-3 text-[10px] text-slate-600">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
              <span>&ge;80%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
              <span>60-79%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
              <span>&lt;60%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-300 inline-block" />
              <span>Untested</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
          {readiness.topic_readiness.map(topic => {
            let badgeBg = 'bg-slate-50/80 border-slate-200 text-slate-600';
            let dotBg = 'bg-slate-400';
            if (topic.total_attempts > 0) {
              if (topic.accuracy_pct >= 80) {
                badgeBg = 'bg-emerald-50/80 border-emerald-200 text-emerald-800';
                dotBg = 'bg-emerald-500';
              } else if (topic.accuracy_pct >= 60) {
                badgeBg = 'bg-amber-50/80 border-amber-200 text-amber-800';
                dotBg = 'bg-amber-500';
              } else {
                badgeBg = 'bg-rose-50/80 border-rose-200 text-rose-800';
                dotBg = 'bg-rose-500';
              }
            }

            return (
              <div
                key={topic.topic_id}
                onClick={() => onNavigate('quiz', { mode: 'topic', domainId: topic.domain_id })}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all active:scale-[0.98] ${badgeBg}`}
              >
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotBg}`} />
                  <span className="text-xs font-semibold truncate text-slate-800">
                    {topic.topic_title}
                  </span>
                </div>
                <span className="text-xs font-bold flex-shrink-0">
                  {topic.total_attempts > 0 ? `${topic.accuracy_pct}%` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Retake Diagnostic / Re-calibrate */}
      <motion.div
        variants={cardEntranceVariants}
        className="flex items-center justify-between p-4 rounded-2xl glass border border-slate-200/90 text-xs text-slate-600 shadow-sm"
      >
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Want to reset your goals or retake the diagnostic quiz?</span>
        </div>
        <button
          onClick={onRetakeOnboarding}
          className="text-blue-700 hover:text-blue-800 font-semibold underline active:scale-95"
        >
          Reconfigure Target
        </button>
      </motion.div>
    </motion.div>
  );
};
