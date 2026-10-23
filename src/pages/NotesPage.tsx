import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Award,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Search,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check,
  ArrowRight,
  Zap,
  HelpCircle,
  X,
  RotateCcw,
} from 'lucide-react';
import { AZ900_STRUCTURED_NOTES, AZ900NoteTopic } from '../data/az900-notes';
import { StorageService } from '../lib/storage';
import { GlassCard } from '../components/ui/GlassCard';

interface NotesPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenRafikiWithTopic?: (topicTitle: string) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
  onNavigate,
  onOpenRafikiWithTopic,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNote, setActiveNote] = useState<AZ900NoteTopic | null>(null);

  // Gamification tracking state
  const [completedNotes, setCompletedNotes] = useState<string[]>(() =>
    StorageService.getCompletedNotes()
  );
  const [totalXp, setTotalXp] = useState<number>(() =>
    StorageService.getNotesXP()
  );
  const [earnedBadges, setEarnedBadges] = useState(() =>
    StorageService.getEarnedBadges()
  );

  // Checkpoint question state for active note
  const [selectedCheckpointOption, setSelectedCheckpointOption] = useState<string | null>(null);
  const [checkpointSubmitted, setCheckpointSubmitted] = useState<boolean>(false);
  const [justEarnedXp, setJustEarnedXp] = useState<boolean>(false);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return AZ900_STRUCTURED_NOTES.filter(note => {
      const matchesDomain = selectedDomain === 'all' || note.domain_id === selectedDomain;
      const matchesSearch =
        searchQuery.trim() === '' ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.official_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.core_principles.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDomain && matchesSearch;
    });
  }, [selectedDomain, searchQuery]);

  // Handle opening a note
  const handleOpenNote = (note: AZ900NoteTopic) => {
    setActiveNote(note);
    setSelectedCheckpointOption(null);
    setCheckpointSubmitted(false);
    setJustEarnedXp(false);
  };

  // Handle checkpoint submission
  const handleCheckpointSubmit = () => {
    if (!activeNote || !selectedCheckpointOption || checkpointSubmitted) return;
    setCheckpointSubmitted(true);

    const isCorrect = selectedCheckpointOption === activeNote.checkpoint.correct;
    if (isCorrect) {
      // Trigger confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      // Mark completed & award XP
      const result = StorageService.markNoteCompleted(activeNote.id);
      setCompletedNotes(StorageService.getCompletedNotes());
      setTotalXp(result.xp);
      setEarnedBadges(StorageService.getEarnedBadges());
      if (result.isNew) {
        setJustEarnedXp(true);
      }
    }
  };

  // Progress metrics
  const totalNotesCount = AZ900_STRUCTURED_NOTES.length;
  const completedCount = completedNotes.length;
  const progressPercent = Math.round((completedCount / totalNotesCount) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner with Gamification Bar */}
      <GlassCard className="p-5 sm:p-6 rounded-2xl relative overflow-hidden border border-blue-200/60 dark:border-blue-900/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 uppercase tracking-wider">
                Official Microsoft Learn Aligned
              </span>
              <span className="text-xs text-slate-500 font-medium">• 14 Core Topics</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              AZ-900 Structured Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Master the exact Microsoft Azure Fundamentals curriculum topic-by-topic. Complete reading checkpoints to earn XP and unlock scholar badges!
            </p>
          </div>

          {/* Gamification Stats Counter */}
          <div className="flex items-center space-x-3 bg-gradient-to-br from-amber-500/10 to-blue-500/10 dark:from-amber-500/20 dark:to-blue-500/20 p-3 rounded-xl border border-amber-200/80 dark:border-amber-700/40">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              <Zap className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">{totalXp} XP</span>
                <span className="text-xs text-slate-500 font-medium">Earned</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                {completedCount} of {totalNotesCount} Topics Mastered
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Syllabus Mastery</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badge Shelf */}
        {earnedBadges.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider flex-shrink-0">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Badges:
            </span>
            {earnedBadges.map(badge => (
              <div
                key={badge.id}
                title={badge.description}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 text-xs font-bold border border-amber-300/60 dark:border-amber-700/60 flex-shrink-0 animate-fade-in"
              >
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Domain Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'dom-1', label: '1. Cloud Concepts' },
            { id: 'dom-2', label: '2. Architecture' },
            { id: 'dom-3', label: '3. Governance' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedDomain(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap active:scale-95 ${
                selectedDomain === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'glass text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes (e.g. Blob, RBAC)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl glass border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map(note => {
          const isCompleted = completedNotes.includes(note.id);
          return (
            <GlassCard
              key={note.id}
              onClick={() => handleOpenNote(note)}
              className="p-5 rounded-2xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-all group active:scale-[0.99] flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                    Topic {note.order_index} • {note.domain_name}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                      <span>Mastered</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 text-xs font-bold">
                      <Zap className="w-3.5 h-3.5 fill-amber-500" />
                      <span>+25 XP</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {note.official_summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{note.read_time_minutes} min read</span>
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>{isCompleted ? 'Review Notes' : 'Study Topic'}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Note Reader Modal */}
      <AnimatePresence>
        {activeNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-strong rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <div className="flex items-center space-x-2 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>Topic {activeNote.order_index}</span>
                    <span>•</span>
                    <span>{activeNote.domain_name}</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {activeNote.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveNote(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-200">
                {/* Official Microsoft Definition */}
                <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Microsoft Learn Official Definition
                    </span>
                    <a
                      href={activeNote.microsoft_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Source Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                    {activeNote.official_summary}
                  </p>
                </div>

                {/* Core Principles */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Core Architectural Principles
                  </h4>
                  <ul className="space-y-2.5">
                    {activeNote.core_principles.map((principle, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: principle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                        }}
                      />
                    ))}
                  </ul>
                </div>

                {/* African Relatable Analogy */}
                <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 space-y-2">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    🌍 African Relatable Analogy
                  </span>
                  <p className="text-xs sm:text-sm italic leading-relaxed text-amber-950 dark:text-amber-100">
                    "{activeNote.african_analogy}"
                  </p>
                </div>

                {/* Exam Watch */}
                <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 space-y-2">
                  <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    🎯 Exam Watch: What Microsoft Tests
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-rose-950 dark:text-rose-200">
                    {activeNote.exam_watch.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Gamification Interactive Checkpoint */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-blue-50/90 dark:from-indigo-950/60 dark:to-blue-950/60 border border-indigo-200 dark:border-indigo-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 fill-amber-500 text-amber-500" /> Topic Checkpoint (+25 XP)
                    </span>
                    {justEarnedXp && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs font-bold animate-bounce">
                        🎉 +25 XP Added!
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {activeNote.checkpoint.stem}
                  </p>

                  <div className="space-y-2">
                    {activeNote.checkpoint.options.map((opt, idx) => {
                      const isSelected = selectedCheckpointOption === opt;
                      const isCorrect = opt === activeNote.checkpoint.correct;

                      let btnStyle = 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80';
                      if (checkpointSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 font-semibold';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={checkpointSubmitted}
                          onClick={() => setSelectedCheckpointOption(opt)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all active:scale-[0.99] ${btnStyle}`}
                        >
                          <div className="flex items-start space-x-2.5">
                            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {checkpointSubmitted && isCorrect && (
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!checkpointSubmitted ? (
                    <button
                      disabled={!selectedCheckpointOption}
                      onClick={handleCheckpointSubmit}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      Submit Checkpoint & Complete Topic (+25 XP)
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Official Explanation:</span>
                      <p className="text-slate-600 dark:text-slate-300">{activeNote.checkpoint.explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <button
                  onClick={() => {
                    const title = activeNote.title;
                    setActiveNote(null);
                    if (onOpenRafikiWithTopic) {
                      onOpenRafikiWithTopic(title);
                    } else {
                      onNavigate('rafiki');
                    }
                  }}
                  className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask Rafiki About This Topic</span>
                </button>

                <button
                  onClick={() => setActiveNote(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors"
                >
                  Close Notes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

