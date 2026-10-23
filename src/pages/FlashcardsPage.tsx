import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  BookOpen,
  Globe,
  AlertCircle,
  ThumbsUp,
  Brain,
} from 'lucide-react';
import { DOMAINS, TOPICS } from '../data/az900-syllabus';
import { SEED_FLASHCARDS } from '../data/seed-flashcards';
import { calculateSM2 } from '../lib/sm2';
import { StorageService } from '../lib/storage';
import { CardProgress, Flashcard, SM2Rating } from '../types';
import { ReportModal } from '../components/common/ReportModal';

interface FlashcardsPageProps {
  onOpenRafiki?: (concept: string) => void;
  onNavigate: (page: string, params?: { mode?: any; domainId?: string }) => void;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({
  onOpenRafiki,
  onNavigate,
}) => {
  // Filters
  const [filterMode, setFilterMode] = useState<'due' | 'all' | 'custom'>('due');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');

  // Load custom cards and SM-2 progress
  const [customCards, setCustomCards] = useState<Flashcard[]>([]);
  const [cardProgress, setCardProgress] = useState<Record<string, CardProgress>>({});

  // Active card session
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Issue report modal
  const [reportCardId, setReportCardId] = useState<string | null>(null);

  // Refresh progress and cards on mount
  useEffect(() => {
    setCustomCards(StorageService.getCustomFlashcards());
    setCardProgress(StorageService.getCardProgress());
  }, []);

  // Combined pool of all available flashcards
  const allCards = useMemo(() => {
    return [...SEED_FLASHCARDS, ...customCards];
  }, [customCards]);

  // Filter cards based on user selection
  const filteredCards = useMemo(() => {
    const now = new Date();

    return allCards.filter(card => {
      // Domain filter
      if (selectedDomainId !== 'all') {
        const topic = TOPICS.find(t => t.id === card.topic_id);
        if (!topic || topic.domain_id !== selectedDomainId) return false;
      }

      // Mode filter
      if (filterMode === 'custom') {
        return card.id.startsWith('from-q-');
      }

      if (filterMode === 'due') {
        const prog = cardProgress[card.id];
        // If not reviewed yet or due date has arrived
        if (!prog) return true;
        return new Date(prog.due_at) <= now;
      }

      return true; // 'all'
    });
  }, [allCards, cardProgress, selectedDomainId, filterMode]);

  const currentCard = filteredCards[currentIndex];

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionCompleted || !currentCard) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        if (e.key === '2') handleRate('hard');
        if (e.key === '3') handleRate('good');
        if (e.key === '4') handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, sessionCompleted, currentCard]);

  // Handle SM-2 rating
  const handleRate = (rating: SM2Rating) => {
    if (!currentCard) return;

    const currentProg = cardProgress[currentCard.id];
    const newProgOmit = calculateSM2(currentProg, rating);

    const updatedProg: CardProgress = {
      id: currentProg?.id || `prog-${Date.now()}`,
      user_id: 'guest-user',
      card_id: currentCard.id,
      ...newProgOmit,
    };

    // Save to storage
    StorageService.saveCardProgress(updatedProg);
    setCardProgress(prev => ({ ...prev, [currentCard.id]: updatedProg }));

    // Advance to next card or complete session
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  const getTopicTitle = (topicId: string) => {
    return TOPICS.find(t => t.id === topicId)?.title || 'AZ-900 Concept';
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">Spaced Repetition Coach</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            SuperMemo SM-2 algorithm scheduled based on your active recall intervals.
          </p>
        </div>

        {/* Filter modes */}
        <div className="flex items-center space-x-2">
          <div className="bg-white border border-slate-200 p-1 rounded-2xl flex items-center space-x-1 text-xs shadow-sm">
            <button
              onClick={() => { setFilterMode('due'); setCurrentIndex(0); setIsFlipped(false); setSessionCompleted(false); }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterMode === 'due'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Due Today ({allCards.filter(c => !cardProgress[c.id] || new Date(cardProgress[c.id].due_at) <= new Date()).length})
            </button>
            <button
              onClick={() => { setFilterMode('all'); setCurrentIndex(0); setIsFlipped(false); setSessionCompleted(false); }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Cards ({allCards.length})
            </button>
            {customCards.length > 0 && (
              <button
                onClick={() => { setFilterMode('custom'); setCurrentIndex(0); setIsFlipped(false); setSessionCompleted(false); }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  filterMode === 'custom'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Missed Quiz Qs ({customCards.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Domain dropdown filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <button
          onClick={() => { setSelectedDomainId('all'); setCurrentIndex(0); setIsFlipped(false); setSessionCompleted(false); }}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium border transition-colors ${
            selectedDomainId === 'all'
              ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Domains
        </button>
        {DOMAINS.map(d => (
          <button
            key={d.id}
            onClick={() => { setSelectedDomainId(d.id); setCurrentIndex(0); setIsFlipped(false); setSessionCompleted(false); }}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium border transition-colors ${
              selectedDomainId === d.id
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Session Completed View */}
      {sessionCompleted || filteredCards.length === 0 ? (
        <div className="glass border border-slate-200/90 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Kongole! Session Finished</h3>
            <p className="text-xs text-slate-600 mt-1">
              {filteredCards.length === 0
                ? 'No cards currently due. You have cleared all reviews for today!'
                : `You reviewed all ${filteredCards.length} cards in this deck.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-4 py-2 bg-slate-50/90 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center space-x-1.5 active:scale-[0.97] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Review Again</span>
            </button>
            <button
              onClick={() => onNavigate('quiz', { mode: 'domain' })}
              className="btn-shimmer w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5 active:scale-[0.97] hover:-translate-y-px transition-all"
            >
              <span className="relative z-10">Test Knowledge in Quiz</span>
              <ChevronRight className="w-3.5 h-3.5 relative z-10" />
            </button>
          </div>
        </div>
      ) : (
        /* Active Flashcard Viewer */
        <div className="space-y-4 max-w-xl mx-auto">
          {/* Card Top Bar: Progress and Topic */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                {getTopicTitle(currentCard.topic_id)}
              </span>
              <button
                onClick={() => setReportCardId(currentCard.id)}
                className="hover:text-blue-700 text-slate-400 p-1 rounded active:scale-90"
                title="Report issue with this card"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(prev => !prev)}
            className="w-full min-h-[300px] glass border border-slate-200/90 rounded-3xl p-6 sm:p-8 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between transition-all hover:border-blue-400 relative select-none"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                {isFlipped ? 'Answer & Explanation' : 'Question / Concept'}
              </span>
              <span className="text-[10px] text-slate-400">
                Click or press Space to flip
              </span>
            </div>

            {/* Main Content */}
            <div className="py-6 my-auto">
              {!isFlipped ? (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {currentCard.front}
                  </h2>
                  <p className="text-xs text-slate-500 italic">
                    Think of the definition and recall any African analogy before flipping.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                    {currentCard.back}
                  </div>

                  {/* African Analogy Section */}
                  {currentCard.african_analogy && (
                    <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs mt-4">
                      <div className="flex items-center space-x-1.5 text-blue-700 font-bold mb-1">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Rafiki's African Analogy</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed italic">
                        "{currentCard.african_analogy}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Tip or Recall status */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Interval:{' '}
                  <strong className="text-slate-800">
                    {cardProgress[currentCard.id]?.interval_days || 0}d
                  </strong>
                </span>
              </div>
              {onOpenRafiki && isFlipped && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRafiki(currentCard.front);
                  }}
                  className="text-blue-700 hover:text-blue-800 font-semibold flex items-center space-x-1 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Rafiki to Elaborate</span>
                </button>
              )}
            </div>
          </div>

          {/* SM-2 Recall Rating Bar (shown when flipped) */}
          {isFlipped ? (
            <div className="space-y-2 pt-2 animate-fadeIn">
              <p className="text-center text-xs text-slate-600 font-medium">
                How well did you remember this concept? (Keys 1 - 4)
              </p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRate('again')}
                  className="py-3 px-2 rounded-xl bg-rose-50/90 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all active:scale-[0.95] shadow-sm"
                >
                  <span className="text-sm font-extrabold">Again</span>
                  <span className="text-[10px] text-rose-600 font-normal">&lt; 1 day</span>
                </button>

                <button
                  onClick={() => handleRate('hard')}
                  className="py-3 px-2 rounded-xl bg-amber-50/90 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all active:scale-[0.95] shadow-sm"
                >
                  <span className="text-sm font-extrabold">Hard</span>
                  <span className="text-[10px] text-amber-600 font-normal">1-2 days</span>
                </button>

                <button
                  onClick={() => handleRate('good')}
                  className="py-3 px-2 rounded-xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all active:scale-[0.95] shadow-sm"
                >
                  <span className="text-sm font-extrabold">Good</span>
                  <span className="text-[10px] text-blue-600 font-normal">3-5 days</span>
                </button>

                <button
                  onClick={() => handleRate('easy')}
                  className="py-3 px-2 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all active:scale-[0.95] shadow-sm"
                >
                  <span className="text-sm font-extrabold">Easy</span>
                  <span className="text-[10px] text-emerald-600 font-normal">6+ days</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="btn-shimmer w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-[0.97] hover:-translate-y-px"
            >
              <span className="relative z-10">Show Answer & Recall Test</span>
              <span className="text-blue-100 text-[10px] relative z-10">(Space)</span>
            </button>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(prev => prev - 1);
                  setIsFlipped(false);
                }
              }}
              className="flex items-center space-x-1 disabled:opacity-30 disabled:cursor-not-allowed hover:text-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              disabled={currentIndex >= filteredCards.length - 1}
              onClick={() => {
                if (currentIndex < filteredCards.length - 1) {
                  setCurrentIndex(prev => prev + 1);
                  setIsFlipped(false);
                }
              }}
              className="flex items-center space-x-1 disabled:opacity-30 disabled:cursor-not-allowed hover:text-slate-800"
            >
              <span>Skip / Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportCardId && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportCardId(null)}
          contentType="flashcard"
          contentId={reportCardId}
        />
      )}
    </div>
  );
};
