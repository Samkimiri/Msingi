import {
  Attempt,
  CardProgress,
  ContentReport,
  MockExam,
  PlanTask,
  StudyPlan,
  UserProfile,
  ChatMessage,
  Question,
  Flashcard,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PROFILE: 'msingi_profile',
  ATTEMPTS: 'msingi_attempts',
  CARD_PROGRESS: 'msingi_card_progress',
  MOCK_EXAMS: 'msingi_mock_exams',
  STUDY_PLAN: 'msingi_study_plan',
  PLAN_TASKS: 'msingi_plan_tasks',
  REPORTS: 'msingi_reports',
  CHAT_MESSAGES: 'msingi_chat_messages',
  CUSTOM_FLASHCARDS: 'msingi_custom_flashcards',
};

// Default Guest Profile
export const DEFAULT_GUEST_PROFILE: UserProfile = {
  id: 'guest-user-001',
  display_name: 'Guest Learner',
  weekly_hours: 8,
  preferred_language: 'English',
  is_guest: true,
};

export class StorageService {
  // Profiles
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_GUEST_PROFILE;
    } catch {
      return DEFAULT_GUEST_PROFILE;
    }
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    if (isSupabaseConfigured && supabase && !profile.is_guest) {
      supabase.from('profiles').upsert({
        id: profile.id,
        display_name: profile.display_name,
        target_exam_date: profile.target_exam_date,
        weekly_hours: profile.weekly_hours,
        preferred_language: profile.preferred_language,
      }).then();
    }
  }

  // Quiz Attempts
  static getAttempts(): Attempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveAttempt(attempt: Attempt): void {
    const attempts = this.getAttempts();
    attempts.unshift(attempt); // latest first
    // keep up to 1000 local attempts
    const trimmed = attempts.slice(0, 1000);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(trimmed));

    const profile = this.getProfile();
    if (isSupabaseConfigured && supabase && !profile.is_guest) {
      supabase.from('attempts').insert({
        user_id: profile.id,
        question_id: attempt.question_id,
        selected: attempt.selected,
        is_correct: attempt.is_correct,
        time_ms: attempt.time_ms,
        created_at: attempt.created_at,
      }).then();
    }
  }

  // Flashcard SM-2 Progress
  static getCardProgress(): Record<string, CardProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARD_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static saveCardProgress(progress: CardProgress): void {
    const all = this.getCardProgress();
    all[progress.card_id] = progress;
    localStorage.setItem(STORAGE_KEYS.CARD_PROGRESS, JSON.stringify(all));

    const profile = this.getProfile();
    if (isSupabaseConfigured && supabase && !profile.is_guest) {
      supabase.from('card_progress').upsert({
        user_id: profile.id,
        card_id: progress.card_id,
        ease: progress.ease,
        interval_days: progress.interval_days,
        due_at: progress.due_at,
        lapses: progress.lapses,
        repetitions: progress.repetitions,
        updated_at: progress.updated_at,
      }).then();
    }
  }

  // Auto-add question as flashcard
  static getCustomFlashcards(): Flashcard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_FLASHCARDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addFlashcardFromQuestion(question: Question): Flashcard {
    const existing = this.getCustomFlashcards();
    const existingCard = existing.find(c => c.id === `from-q-${question.id}`);
    if (existingCard) return existingCard;

    const newCard: Flashcard = {
      id: `from-q-${question.id}`,
      topic_id: question.topic_id,
      front: question.stem,
      back: `Correct Answer: ${question.correct.join(', ')}\n\nKey Takeaway: ${question.explanation}`,
      outline_skill: question.outline_skill,
      source_url: question.source_url,
      status: 'verified',
      verified_at: new Date().toISOString(),
    };

    existing.unshift(newCard);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FLASHCARDS, JSON.stringify(existing));
    return newCard;
  }

  // Mock Exams
  static getMockExams(): MockExam[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOCK_EXAMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveMockExam(exam: MockExam): void {
    const exams = this.getMockExams();
    exams.unshift(exam);
    localStorage.setItem(STORAGE_KEYS.MOCK_EXAMS, JSON.stringify(exams));

    const profile = this.getProfile();
    if (isSupabaseConfigured && supabase && !profile.is_guest) {
      supabase.from('mock_exams').insert({
        user_id: profile.id,
        score_pct: exam.score_pct,
        domain_breakdown: exam.domain_breakdown,
        duration_seconds: exam.duration_seconds,
        completed_at: exam.completed_at,
      }).then();
    }
  }

  // Study Plan
  static getStudyPlan(): StudyPlan | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveStudyPlan(plan: StudyPlan): void {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(plan));
  }

  static getPlanTasks(): PlanTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAN_TASKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static savePlanTasks(tasks: PlanTask[]): void {
    localStorage.setItem(STORAGE_KEYS.PLAN_TASKS, JSON.stringify(tasks));
  }

  static toggleTask(taskId: string): PlanTask[] {
    const tasks = this.getPlanTasks();
    const updated = tasks.map(t =>
      t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
    );
    this.savePlanTasks(updated);
    return updated;
  }

  // Content Reports
  static saveContentReport(report: Omit<ContentReport, 'id' | 'created_at'>): ContentReport {
    const fullReport: ContentReport = {
      ...report,
      id: 'rep-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      const reports: ContentReport[] = data ? JSON.parse(data) : [];
      reports.unshift(fullReport);
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

      if (isSupabaseConfigured && supabase) {
        supabase.from('content_reports').insert({
          user_id: fullReport.user_id,
          content_type: fullReport.content_type,
          content_id: fullReport.content_id,
          issue_text: fullReport.issue_text,
          created_at: fullReport.created_at,
        }).then();
      }

      // Also forward to Vercel backend /api/report
      fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullReport),
      }).catch(() => {
        // Silently ignore if offline
      });
    } catch {
      // silently tolerate storage quota
    }
    return fullReport;
  }

  // Rafiki Chat History
  static getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveChatMessages(messages: ChatMessage[]): void {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  }
}

