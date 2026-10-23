import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { quizOptionVariants } from '../lib/motion';

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
      pool = [...SEED_QUESTIONS, ...SEED_QUESTIONS].slice(0, 40);
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOptions([]);
    setIsAnswerSubmitted(false);
    setIsQuizActive(true);
    setIsMockCompleted(false);
    setMockAnswers({});

    // Start timer if Mock Exam
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

  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted && selectedMode !== 'mock') return;

    if (currentQuestion.type === 'multiple') {
      // Multi-select toggle
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(o => o !== option));
      } else {
        if (selectedOptions.length < currentQuestion.correct.length) {
          setSelectedOptions([...selectedOptions, option]);
        }
      }
    } else {
      // Single select
      setSelectedOptions([option]);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOptions.length === 0) return;

    const isCorrect =
      currentQuestion.correct.length === selectedOptions.length &&
      currentQuestion.correct.every(c => selectedOptions.includes(c));

    setIsAnswerSubmitted(true);

    if (isCorrect) {
      setStreak(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      setStreak(0);
      // Auto-add to custom flashcards on incorrect attempt
      StorageService.addFlashcardFromQuestion(currentQuestion);
    }

    // Save attempt to storage
    const attempt: Attempt = {
      id: `att-${Date.now()}`,
      question_id: currentQuestion.id,
      selected: selectedOptions,
      is_correct: isCorrect,
      time_ms: 10000,
      created_at: new Date().toISOString(),
    };
    StorageService.saveAttempt(attempt);
  };

  const handleNextQuestion = () => {
    // Record mock answer if in mock mode
    if (selectedMode === 'mock') {
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Exam Practice
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Smart Quiz Builder
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Original scenario-based questions grounded in the official Microsoft Learn syllabus.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 glass rounded-2xl border border-slate-200/90 shadow-sm">
            {[
              { id: 'domain', label: 'By Domain', desc: 'Weighted modules' },
              { id: 'topic', label: 'By Topic', desc: 'Targeted skill' },
              { id: 'weak', label: 'Weak Areas', desc: 'Accuracy < 60%' },
              { id: 'mock', label: 'Mock Exam', desc: '40 Qs Timed' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedMode(tab.id as any)}
                className={`py-2.5 px-3 rounded-xl text-left transition-all active:scale-[0.97] ${
                  selectedMode === tab.id
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/70'
                }`}
              >
                <div className="text-xs font-bold">{tab.label}</div>
                <div className="text-[10px] opacity-80">{tab.desc}</div>
              </button>
            ))}
          </div>

          {/* Configuration Card based on Mode */}
          <div className="p-5 rounded-3xl glass border border-slate-200/90 space-y-4 shadow-sm">
            {selectedMode === 'domain' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select AZ-900 Domain:
                </label>
                <div className="space-y-2">
                  {DOMAINS.map(dom => (
                    <button
                      key={dom.id}
                      onClick={() => setSelectedDomainId(dom.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.98] ${
                        selectedDomainId === dom.id
                          ? 'border-blue-600 bg-blue-50/90 text-blue-900 font-semibold shadow-sm'
                          : 'border-slate-200/90 bg-white/70 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{dom.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Exam Weight: {dom.weight_min_pct}-{dom.weight_max_pct}%
                        </div>
                      </div>
                      {selectedDomainId === dom.id && (
                        <Check className="w-4 h-4 text-blue-700" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedMode === 'topic' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select Specific Topic (30 Outline Skills):
                </label>
                <select
                  value={selectedTopicId}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  {TOPICS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 italic">
                  {TOPICS.find(t => t.id === selectedTopicId)?.summary}
                </p>
              </div>
            )}

            {selectedMode === 'weak' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-amber-700">
                  <Filter className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">Targeted Weak Topic Practice</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focuses questions strictly on concepts where your historical accuracy is under 60%. Perfect for efficient, high-impact revision.
                </p>
              </div>
            )}

            {selectedMode === 'mock' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold">Official Exam Simulation</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  40 questions weighted across all 3 domains with a strict 45-minute countdown. Instant explanations are suppressed until the final submission to mirror the real testing environment.
                </p>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                  Passing target: <strong className="text-slate-900">700 / 1000 (70%)</strong>. Score 80%+ twice to qualify for the <strong className="text-emerald-700">Exam Ready</strong> badge.
                </div>
              </div>
            )}

            <button
              onClick={startQuiz}
              className="btn-shimmer w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.97] hover:-translate-y-px"
            >
              <span className="relative z-10">{selectedMode === 'mock' ? 'Begin 40-Q Mock Exam' : 'Start Practice Quiz'}</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ VIEW */}
      {isQuizActive && !isMockCompleted && currentQuestion && (
        <div className="space-y-5">
          {/* Top Progress & Timer Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {currentQuestion.type === 'multiple' && (
                <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  Select {currentQuestion.correct.length}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Streak pill */}
              {streak > 0 && selectedMode !== 'mock' && (
                <span className="text-xs font-bold text-amber-700 bg-amber-50/90 px-2.5 py-1 rounded-full border border-amber-200 flex items-center space-x-1 shadow-sm">
                  <span>🔥 {streak} streak</span>
                </span>
              )}

              {/* Timer for Mock */}
              {selectedMode === 'mock' && (
                <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-700 bg-blue-50/90 px-3 py-1 rounded-full border border-blue-200 shadow-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(timeRemainingSeconds)}</span>
                </div>
              )}

              <button
                onClick={() => setIsQuizActive(false)}
                className="text-xs text-slate-500 hover:text-slate-800 active:scale-95 transition-transform"
              >
                Quit
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Stem Card with Horizontal Slide + Fade Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-5 sm:p-6 rounded-3xl glass border border-slate-200/90 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-blue-700">
                  {TOPICS.find(t => t.id === currentQuestion.topic_id)?.title}
                </span>
                <button
                  onClick={() => setReportQuestionId(currentQuestion.id)}
                  className="hover:text-slate-800 flex items-center space-x-1 active:scale-90"
                  title="Report issue with this question"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Report</span>
                </button>
              </div>

              <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentQuestion.stem}
              </p>

              {/* Options List */}
              <div className="space-y-2.5 pt-1">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOptions.includes(option);
                  const isCorrect = currentQuestion.correct.includes(option);

                  // Styling logic based on submission state (only revealed in practice modes)
                  let itemStyle = 'border-slate-200/90 bg-white/80 text-slate-800 hover:border-slate-300 hover:bg-white';

                  if (selectedMode !== 'mock' && isAnswerSubmitted) {
                    if (isCorrect) {
                      itemStyle = 'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      itemStyle = 'border-rose-400 bg-rose-50/90 text-rose-950 font-semibold';
                    } else {
                      itemStyle = 'border-slate-200/60 bg-slate-50/40 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    itemStyle = 'border-blue-600 bg-blue-50/90 text-blue-900 font-semibold shadow-sm';
                  }

                  const feedbackAnimation =
                    selectedMode !== 'mock' && isAnswerSubmitted
                      ? isCorrect
                        ? 'correctPop'
                        : isSelected && !isCorrect
                        ? 'wrongShake'
                        : 'initial'
                      : 'initial';

                  return (
                    <motion.button
                      key={idx}
                      variants={quizOptionVariants}
                      animate={feedbackAnimation}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-colors flex items-start space-x-3 ${itemStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-snug">{option}</span>
                      {selectedMode !== 'mock' && isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-scale-pop" />
                      )}
                      {selectedMode !== 'mock' && isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Button: Check Answer or Next Question */}
          {selectedMode !== 'mock' && !isAnswerSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOptions.length === 0}
              className="btn-shimmer w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 disabled:opacity-40 transition-all active:scale-[0.97] hover:-translate-y-px"
            >
              <span className="relative z-10">Submit Answer</span>
              <Check className="w-4 h-4 relative z-10" />
            </button>
          ) : null}

          {/* INSTANT EXPLANATION PANEL (Practice Modes) */}
          {selectedMode !== 'mock' && isAnswerSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="p-5 rounded-3xl glass border border-slate-200/90 space-y-4 shadow-sm"
            >
              <div className="flex items-center space-x-2">
                {currentQuestion.correct.every(c => selectedOptions.includes(c)) &&
                currentQuestion.correct.length === selectedOptions.length ? (
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Hongera! Correct Answer</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
                    <XCircle className="w-5 h-5" />
                    <span>Not quite right — Learn from this!</span>
                  </div>
                )}
              </div>

              {/* Core Explanation */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Why this is correct:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Why Wrong Options are Wrong */}
              {Object.keys(currentQuestion.wrong_option_notes).length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Why other choices are incorrect:
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(currentQuestion.wrong_option_notes).map(([optName, note], nIdx) => (
                      <div key={nIdx} className="text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50/80 border border-slate-200">
                        <strong className="text-slate-900 block mb-0.5">• {optName}:</strong>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Add Flashcard, Explain Simply with Rafiki, Revise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleAddToFlashcards}
                  className="py-2.5 px-3 rounded-xl bg-slate-50/90 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-all active:scale-[0.97]"
                >
                  <BookmarkPlus className="w-4 h-4 text-blue-600" />
                  <span>Add to My Flashcards</span>
                </button>

                <button
                  onClick={() => onOpenRafikiWithQuestion?.(currentQuestion)}
                  className="py-2.5 px-3 rounded-xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 flex items-center justify-center space-x-1.5 transition-all active:scale-[0.97]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explain Simply with Rafiki</span>
                </button>
              </div>

              {cardAddedMessage && (
                <p className="text-xs text-emerald-700 font-semibold text-center animate-fadeIn">
                  {cardAddedMessage}
                </p>
              )}

              {/* Source Link */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <a
                  href={currentQuestion.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline flex items-center space-x-1"
                >
                  <span>Revise on Microsoft Learn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Next Question button */}
              <button
                onClick={handleNextQuestion}
                className="btn-shimmer w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.97] hover:-translate-y-px mt-3"
              >
                <span className="relative z-10">{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </button>
            </motion.div>
          )}

          {/* MOCK EXAM MODE: Direct Next Question Button */}
          {selectedMode === 'mock' && (
            <button
              onClick={handleNextQuestion}
              disabled={selectedOptions.length === 0}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 disabled:opacity-40 transition-all active:scale-[0.97] hover:-translate-y-px"
            >
              <span>{currentIndex < questions.length - 1 ? 'Record & Next Question' : 'Submit Mock Exam'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* MOCK EXAM RESULTS VIEW */}
      {isMockCompleted && mockExamResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-8 rounded-3xl glass border border-slate-200/90 space-y-6 text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-500/20">
            <Trophy className="w-8 h-8 text-white" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Mock Exam Result
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              {mockExamResult.score_pct}% Score
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Time taken: {formatTimer(mockExamResult.duration_seconds)} • Required to pass: 70%
            </p>
          </div>

          {/* Domain Breakdown Bars */}
          <div className="space-y-3 text-left pt-2">
            <h4 className="text-xs font-bold text-slate-700">Domain Performance:</h4>
            {DOMAINS.map(d => {
              const stat = mockExamResult.domain_breakdown[d.id] || { total: 0, correct: 0, pct: 0 };
              return (
                <div key={d.id} className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{d.name}</span>
                    <span className="font-bold text-blue-700">{stat.pct}% ({stat.correct}/{stat.total})</span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stat.pct >= 70 ? 'bg-emerald-600' : 'bg-rose-500'}`}
                      style={{
                        width: `${stat.pct}%`,
                        transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.97]"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setIsQuizActive(false);
                setIsMockCompleted(false);
              }}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-[0.97] hover:-translate-y-px"
            >
              Take Another Quiz
            </button>
          </div>
        </motion.div>
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
