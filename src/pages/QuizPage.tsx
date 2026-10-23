import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  BookmarkPlus,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Filter,
  Trophy,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { DOMAINS, TOPICS } from '../data/az900-syllabus';
import { SEED_QUESTIONS } from '../data/seed-questions';
import { Question, Attempt, MockExam } from '../types';
import { StorageService } from '../lib/storage';
import { ReportModal } from '../components/common/ReportModal';

interface QuizPageProps {
  initialMode?: 'domain' | 'topic' | 'weak' | 'mock' | 'diagnostic';
  initialDomainId?: string;
  onOpenRafikiWithQuestion?: (question: Question) => void;
  onNavigate: (page: string) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({
  initialMode = 'domain',
  initialDomainId,
  onOpenRafikiWithQuestion,
  onNavigate,
}) => {
  // Mode selection state
  const [selectedMode, setSelectedMode] = useState<'domain' | 'topic' | 'weak' | 'mock'>(
    initialMode === 'mock' ? 'mock' : initialMode === 'weak' ? 'weak' : 'domain'
  );
  const [selectedDomainId, setSelectedDomainId] = useState<string>(
    initialDomainId || DOMAINS[0].id
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPICS[0].id);

  // Active quiz session state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [cardAddedMessage, setCardAddedMessage] = useState<string | null>(null);

  // Timer for Mock Exam
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(45 * 60); // 45 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock exam answers collection (for end-of-exam evaluation)
  const [mockAnswers, setMockAnswers] = useState<Record<string, string[]>>({});
  const [isMockCompleted, setIsMockCompleted] = useState(false);
  const [mockExamResult, setMockExamResult] = useState<MockExam | null>(null);

  // Report issue modal
  const [reportQuestionId, setReportQuestionId] = useState<string | null>(null);

  // Filter questions based on selected mode
  const startQuiz = () => {
    let pool: Question[] = [];

    if (selectedMode === 'domain') {
      const topicIdsInDomain = TOPICS.filter(t => t.domain_id === selectedDomainId).map(t => t.id);
      pool = SEED_QUESTIONS.filter(q => topicIdsInDomain.includes(q.topic_id));
    } else if (selectedMode === 'topic') {
      pool = SEED_QUESTIONS.filter(q => q.topic_id === selectedTopicId);
    } else if (selectedMode === 'weak') {
      // Find weak topics from stored attempts
      const attempts = StorageService.getAttempts();
      const topicStats: Record<string, { total: number; correct: number }> = {};
      attempts.forEach(a => {
        const q = SEED_QUESTIONS.find(item => item.id === a.question_id);
        if (q) {
          if (!topicStats[q.topic_id]) topicStats[q.topic_id] = { total: 0, correct: 0 };
          topicStats[q.topic_id].total++;
          if (a.is_correct) topicStats[q.topic_id].correct++;
        }
      });
      const weakTopicIds = Object.keys(topicStats).filter(
        tid => topicStats[tid].total > 0 && (topicStats[tid].correct / topicStats[tid].total) < 0.6
      );
      pool = SEED_QUESTIONS.filter(q => weakTopicIds.includes(q.topic_id));
      if (pool.length === 0) {
        // Fallback to domain 1 if no weak topics yet
        pool = SEED_QUESTIONS.slice(0, 10);
      }
    } else if (selectedMode === 'mock') {
      // 40 questions representative simulation
      // Duplicate & shuffle pool to reach 40 questions
      const shuffled = [...SEED_QUESTIONS].sort(() => 0.5 - Math.random());
      pool = [];
      while (pool.length < 40) {
        pool.push(...shuffled);
      }
      pool = pool.slice(0, 40).map((q, idx) => ({ ...q, id: `${q.id}-mock-${idx}` }));
    }

    if (pool.length === 0) {
      pool = SEED_QUESTIONS.slice(0, 5);
    }

    setQuestions(pool);
    setCurrentIndex(0);
    setSelectedOptions([]);
    setIsAnswerSubmitted(false);
    setIsQuizActive(true);
    setIsMockCompleted(false);
    setMockAnswers({});

    // Start timer for mock exam
    if (selectedMode === 'mock') {
      setTimeRemainingSeconds(45 * 60);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishMock();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted && selectedMode !== 'mock') return;

    if (currentQuestion.type === 'multiple') {
      // Multi-select
      setSelectedOptions(prev =>
        prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
      );
    } else {
      // Single choice
      setSelectedOptions([opt]);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOptions.length === 0) return;

    // Check correctness
    const isCorrect =
      currentQuestion.correct.length === selectedOptions.length &&
      currentQuestion.correct.every(c => selectedOptions.includes(c));

    // Save attempt
    StorageService.saveAttempt({
      id: `att-${Date.now()}`,
      question_id: currentQuestion.id.split('-mock-')[0],
      selected: selectedOptions,
      is_correct: isCorrect,
      time_ms: 12000,
      created_at: new Date().toISOString(),
    });

    setIsAnswerSubmitted(true);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      // Confetti celebration on 5-streak
      if (newStreak % 5 === 0) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#F97316', '#10B981', '#38BDF8'],
        });
      }
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (selectedMode === 'mock') {
      // Record mock answer
      setMockAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedOptions,
      }));
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptions([]);
      setIsAnswerSubmitted(false);
      setCardAddedMessage(null);
    } else {
      if (selectedMode === 'mock') {
        handleFinishMock();
      } else {
        setIsQuizActive(false);
      }
    }
  };

  const handleFinishMock = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let correctCount = 0;
    const domainStats: Record<string, { total: number; correct: number; pct: number }> = {
      'dom-1': { total: 0, correct: 0, pct: 0 },
      'dom-2': { total: 0, correct: 0, pct: 0 },
      'dom-3': { total: 0, correct: 0, pct: 0 },
    };

    questions.forEach(q => {
      const answers = mockAnswers[q.id] || selectedOptions;
      const isCorrect =
        q.correct.length === answers.length &&
        q.correct.every(c => answers.includes(c));

      if (isCorrect) correctCount++;

      const topic = TOPICS.find(t => t.id === q.topic_id);
      const domId = topic?.domain_id || 'dom-1';
      if (domainStats[domId]) {
        domainStats[domId].total++;
        if (isCorrect) domainStats[domId].correct++;
      }
    });

    Object.keys(domainStats).forEach(domId => {
      const s = domainStats[domId];
      s.pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);

    const examRecord: MockExam = {
      id: `mock-${Date.now()}`,
      score_pct: scorePct,
      domain_breakdown: domainStats,
      duration_seconds: 45 * 60 - timeRemainingSeconds,
      completed_at: new Date().toISOString(),
    };

    StorageService.saveMockExam(examRecord);
    setMockExamResult(examRecord);
    setIsMockCompleted(true);
  };

  const handleAddToFlashcards = () => {
    if (!currentQuestion) return;
    StorageService.addFlashcardFromQuestion(currentQuestion);
    setCardAddedMessage('Added to your spaced repetition deck! 🗂️');
    setTimeout(() => setCardAddedMessage(null), 3000);
  };

  // Helper formatting for seconds to MM:SS
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER BAR & MODE SELECTOR (when not in an active quiz) */}
      {!isQuizActive && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sunset-400">
              Exam Practice
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              Smart Quiz Builder
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Original scenario-based questions grounded in the official Microsoft Learn syllabus.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-surface rounded-2xl border border-surface-border">
            {[
              { id: 'domain', label: 'By Domain', desc: 'Weighted modules' },
              { id: 'topic', label: 'By Topic', desc: 'Targeted skill' },
              { id: 'weak', label: 'Weak Areas', desc: 'Accuracy < 60%' },
              { id: 'mock', label: 'Mock Exam', desc: '40 Qs Timed' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedMode(tab.id as any)}
                className={`py-2.5 px-3 rounded-xl text-left transition-all ${
                  selectedMode === tab.id
                    ? 'bg-gradient-to-r from-sunset-500 to-amber-600 text-white font-bold shadow-glow-orange'
                    : 'text-slate-400 hover:text-white hover:bg-surface-light'
                }`}
              >
                <div className="text-xs font-bold">{tab.label}</div>
                <div className="text-[10px] opacity-80">{tab.desc}</div>
              </button>
            ))}
          </div>

          {/* Configuration Card based on Mode */}
          <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-4">
            {selectedMode === 'domain' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select AZ-900 Domain:
                </label>
                <div className="space-y-2">
                  {DOMAINS.map(dom => (
                    <button
                      key={dom.id}
                      onClick={() => setSelectedDomainId(dom.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        selectedDomainId === dom.id
                          ? 'border-sunset-500 bg-sunset-500/10 text-white'
                          : 'border-surface-border bg-surface-light text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{dom.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Exam Weight: {dom.weight_min_pct}-{dom.weight_max_pct}%
                        </div>
                      </div>
                      {selectedDomainId === dom.id && (
                        <Check className="w-4 h-4 text-sunset-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedMode === 'topic' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select Specific Topic (30 Outline Skills):
                </label>
                <select
                  value={selectedTopicId}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sunset-500"
                >
                  {TOPICS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic">
                  {TOPICS.find(t => t.id === selectedTopicId)?.summary}
                </p>
              </div>
            )}

            {selectedMode === 'weak' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Filter className="w-4 h-4" />
                  <span className="text-xs font-bold">Targeted Weak Topic Practice</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focuses questions strictly on concepts where your historical accuracy is under 60%. Perfect for efficient, high-impact revision.
                </p>
              </div>
            )}

            {selectedMode === 'mock' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sunset-400">
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs font-bold">Official Exam Simulation</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  40 questions weighted across all 3 domains with a strict 45-minute countdown. Instant explanations are suppressed until the final submission to mirror the real testing environment.
                </p>
                <div className="p-3 bg-surface-light rounded-xl border border-surface-border text-[11px] text-slate-300">
                  Passing target: <strong className="text-white">700 / 1000 (70%)</strong>. Score 80%+ twice to qualify for the <strong className="text-savannah-400">Exam Ready</strong> badge.
                </div>
              </div>
            )}

            <button
              onClick={startQuiz}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sunset-500 to-amber-600 hover:from-sunset-600 hover:to-amber-700 text-white font-bold text-sm shadow-glow-orange flex items-center justify-center space-x-2 transition-all active:scale-98"
            >
              <span>{selectedMode === 'mock' ? 'Begin 40-Q Mock Exam' : 'Start Practice Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ VIEW */}
      {isQuizActive && !isMockCompleted && currentQuestion && (
        <div className="space-y-5 animate-fadeIn">
          {/* Top Progress & Timer Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-200">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {currentQuestion.type === 'multiple' && (
                <span className="text-[10px] bg-dusk-500/20 text-dusk-400 font-semibold px-2 py-0.5 rounded border border-dusk-500/30">
                  Select {currentQuestion.correct.length}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Streak pill */}
              {streak > 0 && selectedMode !== 'mock' && (
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center space-x-1">
                  <span>🔥 {streak} streak</span>
                </span>
              )}

              {/* Timer for Mock */}
              {selectedMode === 'mock' && (
                <div className="flex items-center space-x-1.5 text-xs font-bold text-sunset-400 bg-surface-light px-3 py-1 rounded-full border border-surface-border">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(timeRemainingSeconds)}</span>
                </div>
              )}

              <button
                onClick={() => setIsQuizActive(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Quit
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface-light h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sunset-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Stem Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-sunset-400">
                {TOPICS.find(t => t.id === currentQuestion.topic_id)?.title}
              </span>
              <button
                onClick={() => setReportQuestionId(currentQuestion.id)}
                className="hover:text-slate-200 flex items-center space-x-1"
                title="Report issue with this question"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[10px]">Report</span>
              </button>
            </div>

            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              {currentQuestion.stem}
            </p>

            {/* Options List */}
            <div className="space-y-2.5 pt-1">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptions.includes(option);
                const isCorrect = currentQuestion.correct.includes(option);

                // Styling logic based on submission state (only revealed in practice modes)
                let itemStyle = 'border-surface-border bg-surface-light text-slate-200 hover:border-slate-600';

                if (selectedMode !== 'mock' && isAnswerSubmitted) {
                  if (isCorrect) {
                    itemStyle = 'border-savannah-500 bg-savannah-500/15 text-white font-semibold';
                  } else if (isSelected && !isCorrect) {
                    itemStyle = 'border-red-500 bg-red-500/15 text-white';
                  } else {
                    itemStyle = 'border-surface-border bg-surface-light/50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  itemStyle = 'border-sunset-500 bg-sunset-500/20 text-white font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start space-x-3 ${itemStyle}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 font-bold ${
                      isSelected ? 'bg-sunset-500 text-white' : 'bg-surface-border text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                    {selectedMode !== 'mock' && isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-savannah-400 flex-shrink-0" />
                    )}
                    {selectedMode !== 'mock' && isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button: Check Answer or Next Question */}
          {selectedMode !== 'mock' && !isAnswerSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOptions.length === 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sunset-500 to-amber-600 hover:from-sunset-600 text-white font-bold text-sm shadow-glow-orange flex items-center justify-center space-x-2 disabled:opacity-40 transition-all active:scale-98"
            >
              <span>Submit Answer</span>
              <Check className="w-4 h-4" />
            </button>
          ) : null}

          {/* INSTANT EXPLANATION PANEL (Practice Modes) */}
          {selectedMode !== 'mock' && isAnswerSubmitted && (
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-surface-border space-y-4 animate-fadeIn">
              <div className="flex items-center space-x-2">
                {currentQuestion.correct.every(c => selectedOptions.includes(c)) &&
                currentQuestion.correct.length === selectedOptions.length ? (
                  <div className="flex items-center space-x-2 text-savannah-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Hongera! Correct Answer</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                    <XCircle className="w-5 h-5" />
                    <span>Not quite right — Learn from this!</span>
                  </div>
                )}
              </div>

              {/* Core Explanation */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Why this is correct:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-surface-light p-3.5 rounded-xl border border-surface-border">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Why Wrong Options are Wrong */}
              {Object.keys(currentQuestion.wrong_option_notes).length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Why other choices are incorrect:
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(currentQuestion.wrong_option_notes).map(([optName, note], nIdx) => (
                      <div key={nIdx} className="text-xs text-slate-300 p-2.5 rounded-lg bg-surface-light/40 border border-surface-border/60">
                        <strong className="text-slate-400 block mb-0.5">• {optName}:</strong>
                        <span className="text-slate-300">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Add Flashcard, Explain Simply with Rafiki, Revise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleAddToFlashcards}
                  className="py-2.5 px-3 rounded-xl bg-surface-light hover:bg-surface-border border border-surface-border text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <BookmarkPlus className="w-4 h-4 text-sunset-400" />
                  <span>Add to My Flashcards</span>
                </button>

                <button
                  onClick={() => onOpenRafikiWithQuestion?.(currentQuestion)}
                  className="py-2.5 px-3 rounded-xl bg-sunset-500/15 hover:bg-sunset-500/25 border border-sunset-500/40 text-xs font-bold text-sunset-300 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explain Simply with Rafiki</span>
                </button>
              </div>

              {cardAddedMessage && (
                <p className="text-xs text-savannah-400 font-semibold text-center animate-fadeIn">
                  {cardAddedMessage}
                </p>
              )}

              {/* Source Link */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-surface-border">
                <a
                  href={currentQuestion.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sunset-400 hover:underline flex items-center space-x-1"
                >
                  <span>Revise on Microsoft Learn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Next Question button */}
              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sunset-500 to-amber-600 hover:from-sunset-600 text-white font-bold text-sm shadow-glow-orange flex items-center justify-center space-x-2 transition-all active:scale-98 mt-3"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* MOCK EXAM MODE: Direct Next Question Button */}
          {selectedMode === 'mock' && (
            <button
              onClick={handleNextQuestion}
              disabled={selectedOptions.length === 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sunset-500 to-amber-600 hover:from-sunset-600 text-white font-bold text-sm shadow-glow-orange flex items-center justify-center space-x-2 disabled:opacity-40 transition-all active:scale-98"
            >
              <span>{currentIndex < questions.length - 1 ? 'Record & Next Question' : 'Submit Mock Exam'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* MOCK EXAM RESULTS VIEW */}
      {isMockCompleted && mockExamResult && (
        <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br from-sunset-500 to-amber-600 shadow-glow-orange">
            <Trophy className="w-8 h-8 text-white" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sunset-400">
              Mock Exam Result
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              {mockExamResult.score_pct}% Score
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Time taken: {formatTimer(mockExamResult.duration_seconds)} • Required to pass: 70%
            </p>
          </div>

          {/* Domain Breakdown Bars */}
          <div className="space-y-3 text-left pt-2">
            <h4 className="text-xs font-bold text-slate-300">Domain Performance:</h4>
            {DOMAINS.map(d => {
              const stat = mockExamResult.domain_breakdown[d.id] || { total: 0, correct: 0, pct: 0 };
              return (
                <div key={d.id} className="p-3 bg-surface-light rounded-xl border border-surface-border space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{d.name}</span>
                    <span className="font-bold text-sunset-400">{stat.pct}% ({stat.correct}/{stat.total})</span>
                  </div>
                  <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stat.pct >= 70 ? 'bg-savannah-500' : 'bg-red-500'}`}
                      style={{ width: `${stat.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3 rounded-xl border border-surface-border text-xs font-bold text-slate-200 hover:bg-surface-light"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setIsQuizActive(false);
                setIsMockCompleted(false);
              }}
              className="flex-1 py-3 rounded-xl bg-sunset-500 hover:bg-sunset-600 text-white font-bold text-xs shadow-glow-orange"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      )}

      {/* Content Issue Report Modal */}
      {reportQuestionId && (
        <ReportModal
          isOpen={Boolean(reportQuestionId)}
          onClose={() => setReportQuestionId(null)}
          contentType="question"
          contentId={reportQuestionId}
        />
      )}
    </div>
  );
};

