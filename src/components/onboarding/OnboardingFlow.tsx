import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { SEED_QUESTIONS } from '../../data/seed-questions';
import { SupportedLanguage, UserProfile } from '../../types';
import { StorageService } from '../../lib/storage';
import { generateStudyPlan } from '../../lib/planner-engine';
import { MotionBackground } from '../MotionBackground';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Default target date: 30 days from now
  const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [examDate, setExamDate] = useState(defaultDate);
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [language, setLanguage] = useState<SupportedLanguage>('English');

  // Step 3 Diagnostic Quiz state
  // Pick 10 representative diagnostic questions
  const diagnosticQuestions = SEED_QUESTIONS.slice(0, 10);
  const [currentDiagIdx, setCurrentDiagIdx] = useState(0);
  const [diagSelections, setDiagSelections] = useState<Record<number, string>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinishOnboarding = () => {
    setIsFinishing(true);

    // Save profile
    const profile: UserProfile = {
      id: 'user-' + Date.now(),
      display_name: 'Learner',
      target_exam_date: examDate,
      weekly_hours: weeklyHours,
      preferred_language: language,
      is_guest: true,
    };
    StorageService.saveProfile(profile);

    // Record diagnostic attempts to seed baseline weak areas
    const weakTopicIds: string[] = [];
    diagnosticQuestions.forEach((q, idx) => {
      const selected = diagSelections[idx];
      if (selected) {
        const isCorrect = q.correct.includes(selected);
        StorageService.saveAttempt({
          id: `diag-att-${Date.now()}-${idx}`,
          question_id: q.id,
          selected: [selected],
          is_correct: isCorrect,
          time_ms: 15000,
          created_at: new Date().toISOString(),
        });
        if (!isCorrect) {
          weakTopicIds.push(q.topic_id);
        }
      }
    });

    // Generate initial deterministic study plan
    const hoursPerDay = {
      mon: Number((weeklyHours / 7).toFixed(1)),
      tue: Number((weeklyHours / 7).toFixed(1)),
      wed: Number((weeklyHours / 7).toFixed(1)),
      thu: Number((weeklyHours / 7).toFixed(1)),
      fri: Number((weeklyHours / 7).toFixed(1)),
      sat: Number((weeklyHours / 5).toFixed(1)),
      sun: Number((weeklyHours / 5).toFixed(1)),
    };

    const { plan, tasks } = generateStudyPlan(examDate, hoursPerDay, weakTopicIds);
    StorageService.saveStudyPlan(plan);
    StorageService.savePlanTasks(tasks);

    setTimeout(() => {
      onComplete();
    }, 400);
  };

  const handleSelectOption = (option: string) => {
    setDiagSelections(prev => ({ ...prev, [currentDiagIdx]: option }));
    if (currentDiagIdx < diagnosticQuestions.length - 1) {
      setTimeout(() => {
        setCurrentDiagIdx(prev => prev + 1);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
      <MotionBackground variant="default" />
      <div className="w-full max-w-md glass-strong border border-slate-200/90 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/80">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 shadow-sm">
              {step}/3
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {step === 1 && 'Exam Target Date'}
              {step === 2 && 'Weekly Hours & Language'}
              {step === 3 && 'Baseline Diagnostic (10 Qs)'}
            </span>
          </div>

          <button
            onClick={handleFinishOnboarding}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-800 active:scale-95 transition-transform"
          >
            Skip for now →
          </button>
        </div>

        {/* STEP 1: Exam Target Date */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Karibu to Msingi! 🌍</h2>
              <p className="text-xs text-slate-600 mt-1">
                Let’s customize your preparation path for the Microsoft Azure Fundamentals (AZ-900) exam.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>When are you planning to sit the exam?</span>
              </label>

              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
              />

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: '2 Weeks', days: 14 },
                  { label: '1 Month', days: 30 },
                  { label: '2 Months', days: 60 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const d = new Date(Date.now() + preset.days * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0];
                      setExamDate(d);
                    }}
                    className="py-2 px-1 text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-blue-500 hover:text-blue-700 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-shimmer w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.97] hover:-translate-y-px"
            >
              <span className="relative z-10">Continue to Step 2</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </button>
          </div>
        )}

        {/* STEP 2: Weekly Hours & Language */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Study Pace & Preferences</h2>
              <p className="text-xs text-slate-600 mt-1">
                Realistic pacing helps build a daily habit without burnout.
              </p>
            </div>

            {/* Weekly Hours Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Available Study Time:</span>
                </span>
                <span className="font-extrabold text-blue-700 text-sm">{weeklyHours} hrs / week</span>
              </div>
              <input
                type="range"
                min={3}
                max={25}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2"
              />
              <p className="text-[11px] text-slate-500">
                ~{Math.round(weeklyHours / 7 * 60)} minutes per day of structured practice.
              </p>
            </div>

            {/* Language Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Rafiki AI Study Buddy Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'English', label: 'English', desc: 'Standard' },
                  { id: 'Kiswahili', label: 'Kiswahili (beta)', desc: 'Swahili analogies' },
                  { id: 'Sheng', label: 'Sheng (beta)', desc: 'Nairobi slang' },
                  { id: 'Nigerian Pidgin', label: 'Pidgin (beta)', desc: 'West African flow' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLanguage(item.id as SupportedLanguage)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      language === item.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all active:scale-[0.97]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-shimmer flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.97] hover:-translate-y-px"
              >
                <span className="relative z-10">Take 10-Q Diagnostic</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 10-Question Diagnostic Quiz */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                  Question {currentDiagIdx + 1} of {diagnosticQuestions.length}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Diagnostic Evaluation</h3>
              </div>
              <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentDiagIdx + 1) / diagnosticQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question Card */}
            {(() => {
              const currentQ = diagnosticQuestions[currentDiagIdx];
              const selectedOpt = diagSelections[currentDiagIdx];

              return (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    {currentQ.stem}
                  </p>

                  <div className="space-y-2">
                    {currentQ.options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(opt)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start space-x-2.5 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-sm'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 font-bold ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      disabled={currentDiagIdx === 0}
                      onClick={() => setCurrentDiagIdx(prev => prev - 1)}
                      className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30"
                    >
                      ← Previous
                    </button>

                    {currentDiagIdx === diagnosticQuestions.length - 1 ? (
                      <button
                        onClick={handleFinishOnboarding}
                        disabled={isFinishing}
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isFinishing ? 'Saving...' : 'Finish & View Readiness'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentDiagIdx(prev => prev + 1)}
                        className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
