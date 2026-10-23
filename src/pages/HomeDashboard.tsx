import React, { useMemo } from 'react';
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
    if (score >= 80) return { stroke: '#10B981', text: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (score >= 65) return { stroke: '#F59E0B', text: 'text-amber-400', bg: 'bg-amber-500/10' };
    if (score >= 40) return { stroke: '#E06D28', text: 'text-sunset-400', bg: 'bg-sunset-500/10' };
    return { stroke: '#EF4444', text: 'text-rose-400', bg: 'bg-rose-500/10' };
  };

  const scoreStyle = getScoreColor(readiness.overall_score);

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness.overall_score / 100) * circumference;

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-surface to-surface-light border border-surface-border rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-sunset-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-sunset-400">
                Habari, {profile.display_name}!
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-border text-slate-300">
                {profile.preferred_language}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Your AZ-900 Exam Foundation
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              {daysUntilExam !== null ? (
                <span>
                  Exam scheduled in <strong className="text-sunset-400 font-bold">{daysUntilExam} days</strong>. Stay consistent with your daily study plan.
                </span>
              ) : (
                'Prepare systematically for the Microsoft Azure Fundamentals certification.'
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-center">
            <button
              onClick={() => onNavigate('quiz', { mode: 'mock' })}
              className="bg-surface-border hover:bg-surface-light text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Mock (40Q)</span>
            </button>
            <button
              onClick={() => onNavigate('quiz', { mode: 'domain' })}
              className="bg-sunset-600 hover:bg-sunset-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-glow-orange transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid: Readiness Score Gauge + Next Best Action */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Radial Readiness Gauge Card */}
        <div className="md:col-span-5 bg-surface border border-surface-border rounded-2xl p-5 flex flex-col items-center justify-center text-center relative shadow-sm">
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-sunset-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
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
                stroke="#1E293B"
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
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {readiness.overall_score}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Recency-weighted</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-xs mt-1">
            {readiness.band_description}
          </p>

          {/* Estimate Disclaimer Note */}
          <p className="text-[10px] text-slate-500 mt-3 border-t border-surface-border/60 pt-2 w-full">
            * The readiness score is an estimate, not a guarantee of exam success.
          </p>
        </div>

        {/* Next Best Action Card & Daily Goal */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          {/* Smart Next-Best-Action Box */}
          <div className="bg-gradient-to-br from-surface to-indigo-deep border border-sunset-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-sunset-500/20 text-sunset-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sunset-400">
                Recommended Next Step
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {readiness.next_best_action.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {readiness.next_best_action.description}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-surface-border flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
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
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-sunset-400 hover:text-sunset-300 bg-sunset-500/10 hover:bg-sunset-500/20 px-3 py-1.5 rounded-lg border border-sunset-500/30 transition-all"
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
              className="bg-surface border border-surface-border hover:border-slate-700 rounded-xl p-3 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Flashcards</span>
                <Layers className="w-3.5 h-3.5 text-sunset-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-lg font-bold text-white">{dueCardsCount}</span>
                <span className="text-[10px] text-slate-400">due today</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('planner')}
              className="bg-surface border border-surface-border hover:border-slate-700 rounded-xl p-3 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Today's Plan</span>
                <Calendar className="w-3.5 h-3.5 text-savannah-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-lg font-bold text-white">
                  {completedTodayCount}/{todayTasks.length || 2}
                </span>
                <span className="text-[10px] text-slate-400">tasks done</span>
              </div>
            </div>

            <div
              onClick={onOpenRafiki}
              className="bg-surface border border-surface-border hover:border-slate-700 rounded-xl p-3 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Rafiki AI</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-lg font-bold text-white">24/7</span>
                <span className="text-[10px] text-slate-400">tutor ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Breakdown Bars */}
      <div className="bg-surface border border-surface-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">AZ-900 Domain Mastery</h3>
            <p className="text-xs text-slate-400">
              Weighted according to the official July 20, 2026 skills outline
            </p>
          </div>
          <button
            onClick={() => onNavigate('accuracy')}
            className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-savannah-400" />
            <span>Syllabus Mapping</span>
          </button>
        </div>

        <div className="space-y-4 pt-1">
          {readiness.domain_breakdowns.map(domain => {
            const hasData = domain.has_enough_data;
            const domainColor =
              domain.recent_accuracy_pct >= 80
                ? 'bg-emerald-500'
                : domain.recent_accuracy_pct >= 60
                ? 'bg-amber-500'
                : 'bg-sunset-500';

            return (
              <div key={domain.domain_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200">
                      {domain.domain_name}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-surface-light px-1.5 py-0.5 rounded border border-surface-border">
                      {domain.exam_weight_pct}% exam weight
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">
                      {hasData ? `${domain.recent_accuracy_pct}%` : `${domain.recent_accuracy_pct}% (Calibrating)`}
                    </span>
                    <button
                      onClick={() => onNavigate('quiz', { mode: 'domain', domainId: domain.domain_id })}
                      className="text-[10px] text-sunset-400 hover:underline flex items-center"
                    >
                      <span>Quiz</span>
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full bg-surface-light rounded-full h-2.5 overflow-hidden border border-surface-border">
                  <div
                    className={`h-full ${domainColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.max(5, domain.recent_accuracy_pct)}%` }}
                  />
                </div>
                {!hasData && (
                  <p className="text-[10px] text-slate-400 italic">
                    Answer at least 15 questions in this domain for full calibration ({domain.attempts_count}/15).
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Accuracy Heatmap Grid */}
      <div className="bg-surface border border-surface-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Syllabus Topic Heatmap</h3>
            <p className="text-xs text-slate-400">
              Instant breakdown across all 15 skills measured
            </p>
          </div>
          <div className="flex items-center space-x-3 text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/80 inline-block" />
              <span>&ge;80%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/80 inline-block" />
              <span>60-79%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/80 inline-block" />
              <span>&lt;60%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-700 inline-block" />
              <span>Untested</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
          {readiness.topic_readiness.map(topic => {
            let badgeBg = 'bg-slate-800/60 border-slate-700/60 text-slate-400';
            let dotBg = 'bg-slate-600';
            if (topic.total_attempts > 0) {
              if (topic.accuracy_pct >= 80) {
                badgeBg = 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300';
                dotBg = 'bg-emerald-400';
              } else if (topic.accuracy_pct >= 60) {
                badgeBg = 'bg-amber-950/40 border-amber-800/50 text-amber-300';
                dotBg = 'bg-amber-400';
              } else {
                badgeBg = 'bg-rose-950/40 border-rose-800/50 text-rose-300';
                dotBg = 'bg-rose-400';
              }
            }

            return (
              <div
                key={topic.topic_id}
                onClick={() => onNavigate('quiz', { mode: 'topic', domainId: topic.domain_id })}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform ${badgeBg}`}
              >
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotBg}`} />
                  <span className="text-xs font-medium truncate text-slate-200">
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
      </div>

      {/* Retake Diagnostic / Re-calibrate */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light border border-surface-border text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Want to reset your goals or retake the diagnostic quiz?</span>
        </div>
        <button
          onClick={onRetakeOnboarding}
          className="text-sunset-400 hover:text-sunset-300 font-semibold underline"
        >
          Reconfigure Target
        </button>
      </div>
    </div>
  );
};
