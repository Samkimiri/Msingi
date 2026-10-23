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
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">Deterministic Study Planner</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Grounded in AZ-900 domain weights, your available weekly hours, and target exam date.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportIcs}
            className="px-3.5 py-2 bg-white/90 hover:bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all shadow-sm active:scale-[0.97]"
            title="Download .ics calendar file for Apple/Google/Outlook calendar"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Calendar (.ics)</span>
          </button>
          <button
            onClick={handleReplan}
            className="btn-shimmer px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all active:scale-[0.97] hover:-translate-y-px"
          >
            <RotateCcw className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Re-plan from Today</span>
          </button>
        </div>
      </div>

      {replanSuccess && (
        <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2 animate-fadeIn shadow-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">Schedule re-calculated successfully starting from today!</span>
        </div>
      )}

      {/* Target Exam Date & Overall Progress Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Target Exam Date
          </span>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {plan?.exam_date ? new Date(plan.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
            </span>
          </div>
          <span className="text-xs text-blue-700 font-semibold">
            {daysUntilExam !== null ? `${daysUntilExam} days remaining` : 'Configure your target date'}
          </span>
        </div>

        <div className="glass border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Tasks Completed
          </span>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {completedTasks} <span className="text-sm text-slate-400">/ {totalTasks}</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{
                width: `${completionPct}%`,
                transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>

        <div className="glass border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Weekly Study Pace
          </span>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {profile.weekly_hours} hrs <span className="text-xs text-slate-500 font-normal">/ week</span>
            </span>
          </div>
          <button
            onClick={onRetakeOnboarding}
            className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold text-left underline active:scale-95"
          >
            Adjust weekly study hours
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            filter === 'upcoming'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Today & Upcoming
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Tasks ({totalTasks})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed ({completedTasks})
        </button>
      </div>

      {/* Task List Grouped by Day */}
      {sortedDates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No tasks in this view</h3>
          <p className="text-xs text-slate-500">
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
                className={`glass border rounded-3xl p-4 sm:p-5 space-y-3 transition-colors shadow-sm ${
                  isToday
                    ? 'border-blue-400 bg-gradient-to-br from-blue-50/50 via-white/80 to-white/70 ring-2 ring-blue-500/10'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isToday
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {formatDateHeading(dateStr)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {dayTasks.filter(t => t.is_completed).length}/{dayTasks.length} done
                  </span>
                </div>

                {/* Day Tasks List */}
                <div className="space-y-2">
                  {dayTasks.map(task => {
                    const isCompleted = task.is_completed;
                    let typeBadge = 'bg-blue-50 text-blue-700 border border-blue-200';
                    if (task.task_type === 'quiz') typeBadge = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
                    if (task.task_type === 'flashcards') typeBadge = 'bg-amber-50 text-amber-700 border border-amber-200';
                    if (task.task_type === 'mock') typeBadge = 'bg-purple-50 text-purple-700 border border-purple-200';
                    if (task.task_type === 'review') typeBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-200';

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-3">
                          <button
                            type="button"
                            className="flex-shrink-0 text-slate-400 hover:text-slate-600"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-semibold ${
                                isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${typeBadge}`}>
                                {task.task_type}
                              </span>
                              <span className="text-[10px] text-slate-500 flex items-center space-x-1">
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
                            className="flex-shrink-0 text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center space-x-1"
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
