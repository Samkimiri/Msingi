import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';
import { DOMAINS, TOPICS } from '../data/az900-syllabus';
import { SEED_QUESTIONS } from '../data/seed-questions';
import { SEED_FLASHCARDS } from '../data/seed-flashcards';

interface AccuracyPageProps {
  onNavigate: (page: string) => void;
}

export const AccuracyPage: React.FC<AccuracyPageProps> = ({ onNavigate }) => {
  // Aggregate topic counts
  const topicStats = TOPICS.map(topic => {
    const qCount = SEED_QUESTIONS.filter(q => q.topic_id === topic.id).length;
    const fcCount = SEED_FLASHCARDS.filter(fc => fc.topic_id === topic.id).length;
    return {
      ...topic,
      qCount,
      fcCount,
    };
  });

  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-surface to-surface-light border border-savannah-500/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-savannah-500/20 text-savannah-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">
              Content Accuracy & Verification Pipeline
            </h1>
            <p className="text-xs text-slate-300">
              100% Grounded in the Microsoft Learn AZ-900 Outline (Updated July 20, 2026)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Msingi maintains rigorous zero-tolerance standards for hallucinations, obsolete content, and exam dumps. Every question and flashcard is authored through our two-stage verification process and mapped to official Microsoft documentation.
        </p>
      </div>

      {/* 3 Pillars of Verification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-surface-border rounded-2xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-sm font-bold text-white">Official Grounding</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every question stem and correct answer is anchored directly to a verifiable URL on Microsoft Learn. No unverified third-party assumptions.
          </p>
        </div>

        <div className="bg-surface border border-surface-border rounded-2xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-sunset-500/20 text-sunset-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="text-sm font-bold text-white">Distractor Scrutiny</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every incorrect option is intentionally crafted with a recorded note explaining why it is plausible in real life but wrong in this context.
          </p>
        </div>

        <div className="bg-surface border border-surface-border rounded-2xl p-5 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="text-sm font-bold text-white">No Exam Dumps</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            100% original scenarios (SACCO banking, M-Pesa transactions, Mombasa logistics). We never copy or support proprietary exam brain dumps.
          </p>
        </div>
      </div>

      {/* Full Syllabus Coverage Matrix */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 space-y-6 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white">
            Full Syllabus Coverage Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified mapping across all 3 domains and 15 measured skills
          </p>
        </div>

        <div className="space-y-6">
          {DOMAINS.map(domain => {
            const domainTopics = topicStats.filter(t => t.domain_id === domain.id);

            return (
              <div key={domain.id} className="space-y-3">
                <div className="flex items-center justify-between border-b border-surface-border pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-sunset-400 uppercase tracking-wider">
                      Domain {domain.order_index}:
                    </span>
                    <span className="text-sm font-bold text-white">
                      {domain.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-light border border-surface-border text-slate-300">
                    {domain.weight_min_pct}% - {domain.weight_max_pct}%
                  </span>
                </div>

                {/* Topics Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-surface-border/60">
                        <th className="pb-2 font-semibold">Skill / Topic Title</th>
                        <th className="pb-2 font-semibold">Status</th>
                        <th className="pb-2 font-semibold text-center">Questions</th>
                        <th className="pb-2 font-semibold text-center">Cards</th>
                        <th className="pb-2 font-semibold text-right">Official Doc</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/40 text-slate-300">
                      {domainTopics.map(topic => (
                        <tr key={topic.id} className="hover:bg-surface-light/40 transition-colors">
                          <td className="py-2.5 pr-2 font-medium">
                            <div>{topic.title}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {topic.outline_skill}
                            </div>
                          </td>
                          <td className="py-2.5">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-savannah-500/20 text-savannah-400 border border-savannah-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-bold text-white">
                            {topic.qCount}
                          </td>
                          <td className="py-2.5 text-center font-bold text-white">
                            {topic.fcCount}
                          </td>
                          <td className="py-2.5 text-right">
                            <a
                              href={topic.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-sunset-400 hover:text-sunset-300 hover:underline text-[11px]"
                            >
                              <span>MS Learn</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Scrutiny & Issue Reporting */}
      <div className="bg-surface border border-surface-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Found a discrepancy or outdated Azure detail?</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Every question, flashcard, and Rafiki tutor response has a built-in flag button. Reports are reviewed by our syllabus auditor against current Microsoft documentation.
          </p>
        </div>
        <button
          onClick={() => onNavigate('quiz')}
          className="px-4 py-2 bg-sunset-600 hover:bg-sunset-500 text-white text-xs font-bold rounded-xl shadow-glow-orange flex items-center space-x-1.5 self-start sm:self-center"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Explore Verified Quizzes</span>
        </button>
      </div>
    </div>
  );
};

