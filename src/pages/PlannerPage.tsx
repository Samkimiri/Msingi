import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
  Check,
  CalendarCheck,
  Zap,
} from 'lucide-react';
import { DOMAINS, TOPICS } from '../data/az900-syllabus';
import { exportTasksToIcs, downloadIcsFile } from '../lib/ics';
import { generateStudyPlan } from '../lib/planner-engine';
import { StorageService } from '../lib/storage';
import { PlanTask, StudyPlan, UserProfile } from '../types';

interface PlannerPageProps {
  profile: UserProfile;
  onNavigate: (page: string, params?: { mode?: string; domainId?: string }) => void;
  onRetakeOnboarding: () => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({
  profile,
  onNavigate,
  onRetakeOnboarding,
}) => {
  const [tasks, setTasks] = useState<PlanTask[]>(() => StorageService.getPlanTasks());
  const [plan, setPlan] = useState<StudyPlan | null>(() => StorageService.getStudyPlan());
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [replanSuccess, setReplanSuccess] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute countdown to exam
  const daysUntilExam = useMemo(() => {
    if (!plan?.exam_date) return null;
    const examDate = new Date(plan.exam_date);
    const today = new Date();
    examDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }, [plan?.exam_date]);

  // Overall task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    const updated = StorageService.toggleTask(taskId);
    setTasks(updated);
  };

  // Re-plan from today based on remaining weak areas
  const handleReplan = () => {
    if (!plan) return;

    // Identify current weak topics from attempts
    const attempts = StorageService.getAttempts();
    const topicStats: Record<string, { total: number; correct: number }> = {};
    attempts.forEach(a => {
      const q = StorageService.getAttempts();
    });

    const weakTopicIds = plan.weak_topics || [];
    const { plan: newPlan, tasks: newTasks } = generateStudyPlan(
      plan.exam_date,
      plan.hours_per_day,
      weakTopicIds,
      new Date()
    );

    // Merge completed tasks from earlier dates
    const priorCompleted = tasks.filter(t => t.date < todayStr && t.is_completed);
    const combinedTasks = [...priorCompleted, ...newTasks];

    StorageService.saveStudyPlan(newPlan);
    StorageService.savePlanTasks(combinedTasks);
    setPlan(newPlan);
    setTasks(combinedTasks);

    setReplanSuccess(true);
    setTimeout(() => setReplanSuccess(false), 2500);
  };

  // Export to calendar
  const handleExportIcs = () => {
    if (!plan) return;
    const icsString = exportTasksToIcs(tasks, plan.exam_date);
    downloadIcsFile(icsString, `msingi-az900-schedule.ics`);
  };

  // Group filtered tasks by Date
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filter === 'completed') return t.is_completed;
      if (filter === 'upcoming') return t.date >= todayStr;
      return true; // all
    });
  }, [tasks, filter, todayStr]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, PlanTask[]> = {};
    filteredTasks.forEach(t => {
      if (!grouped[t.date]) grouped[t.date] = [];
      grouped[t.date].push(t);
    });
    return grouped;
  }, [filteredTasks]);

  const sortedDates = useMemo(() => {
    return Object.keys(tasksByDate).sort();
  }, [tasksByDate]);

  // Format date readable
  const formatDateHeading = (dateStr: string) => {
    if (dateStr === todayStr) return 'Today';
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (dateStr === tomorrow) return 'Tomorrow';

    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-savannah-500/20 text-savannah-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-extrabold text-white">Deterministic Study Planner</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in AZ-900 domain weights, your available weekly hours, and target exam date.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportIcs}
            className="px-3 py-2 bg-surface hover:bg-surface-light border border-surface-border text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
            title="Download .ics calendar file for Apple/Google/Outlook calendar"
          >
            <Download className="w-3.5 h-3.5 text-savannah-400" />
            <span>Export Calendar (.ics)</span>
          </button>
          <button
            onClick={handleReplan}
            className="px-3 py-2 bg-sunset-600 hover:bg-sunset-500 text-white text-xs font-bold rounded-xl shadow-glow-orange flex items-center space-x-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-plan from Today</span>
          </button>
        </div>
      </div>

      {replanSuccess && (
        <div className="p-3 bg-savannah-500/10 border border-savannah-500/30 rounded-xl text-xs text-savannah-300 flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-savannah-400" />
          <span>Schedule re-calculated successfully starting from today!</span>
        </div>
      )}

      {/* Target Exam Date & Overall Progress Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-surface-border rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Target Exam Date
          </span>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-white">
              {plan?.exam_date ? new Date(plan.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
            </span>
          </div>
          <span className="text-xs text-sunset-400 font-semibold">
            {daysUntilExam !== null ? `${daysUntilExam} days remaining` : 'Configure your target date'}
          </span>
        </div>

        <div className="bg-surface border border-surface-border rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Tasks Completed
          </span>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-white">
              {completedTasks} <span className="text-sm text-slate-500">/ {totalTasks}</span>
            </span>
          </div>
          <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden border border-surface-border">
            <div
              className="h-full bg-savannah-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        <div className="bg-surface border border-surface-border rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Weekly Study Pace
          </span>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-white">
              {profile.weekly_hours} hrs <span className="text-xs text-slate-400 font-normal">/ week</span>
            </span>
          </div>
          <button
            onClick={onRetakeOnboarding}
            className="text-[11px] text-sunset-400 hover:underline text-left"
          >
            Adjust weekly study hours
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-surface-border pb-2 text-xs">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'upcoming'
              ? 'bg-sunset-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Today & Upcoming
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-sunset-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Tasks ({totalTasks})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-sunset-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed ({completedTasks})
        </button>
      </div>

      {/* Task List Grouped by Day */}
      {sortedDates.length === 0 ? (
        <div className="bg-surface border border-surface-border rounded-2xl p-8 text-center max-w-md mx-auto space-y-3">
          <CalendarCheck className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No tasks in this view</h3>
          <p className="text-xs text-slate-400">
            {filter === 'completed'
              ? 'You have not checked off any tasks yet.'
              : 'All scheduled tasks have passed or been completed!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(dateStr => {
            const dayTasks = tasksByDate[dateStr];
            const isToday = dateStr === todayStr;

            return (
              <div
                key={dateStr}
                className={`bg-surface border rounded-2xl p-4 sm:p-5 space-y-3 transition-colors ${
                  isToday
                    ? 'border-sunset-500/50 shadow-glow-orange/10 bg-gradient-to-br from-surface to-surface-light'
                    : 'border-surface-border'
                }`}
              >
                <div className="flex items-center justify-between border-b border-surface-border/60 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isToday
                          ? 'bg-sunset-500 text-white'
                          : 'bg-surface-light text-slate-300 border border-surface-border'
                      }`}
                    >
                      {formatDateHeading(dateStr)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {dayTasks.filter(t => t.is_completed).length}/{dayTasks.length} done
                  </span>
                </div>

                {/* Day Tasks List */}
                <div className="space-y-2">
                  {dayTasks.map(task => {
                    const isCompleted = task.is_completed;
                    let typeBadge = 'bg-blue-500/20 text-blue-400';
                    if (task.task_type === 'quiz') typeBadge = 'bg-sunset-500/20 text-sunset-400';
                    if (task.task_type === 'flashcards') typeBadge = 'bg-amber-500/20 text-amber-400';
                    if (task.task_type === 'mock') typeBadge = 'bg-purple-500/20 text-purple-400';
                    if (task.task_type === 'review') typeBadge = 'bg-emerald-500/20 text-emerald-400';

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-surface-light/40 border-surface-border text-slate-500'
                            : 'bg-surface hover:bg-surface-light border-surface-border hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-3">
                          <button
                            type="button"
                            className="flex-shrink-0 text-slate-400 hover:text-white"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-savannah-400 fill-savannah-500/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-semibold ${
                                isCompleted ? 'line-through text-slate-400' : 'text-slate-200'
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${typeBadge}`}>
                                {task.task_type}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                                <Clock className="w-3 h-3 inline mr-0.5" />
                                <span>{task.estimated_minutes} min</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action jump button */}
                        {!isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (task.task_type === 'quiz') {
                                onNavigate('quiz', { mode: 'domain' });
                              } else if (task.task_type === 'flashcards') {
                                onNavigate('flashcards');
                              } else if (task.task_type === 'mock') {
                                onNavigate('quiz', { mode: 'mock' });
                              }
                            }}
                            className="flex-shrink-0 text-[11px] font-bold text-sunset-400 hover:text-sunset-300 bg-sunset-500/10 hover:bg-sunset-500/20 px-2.5 py-1 rounded-lg border border-sunset-500/30 flex items-center space-x-1"
                          >
                            <span>Start</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
