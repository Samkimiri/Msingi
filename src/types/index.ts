export type QuestionType = 'single' | 'multiple' | 'boolean';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ContentStatus = 'draft' | 'verified';

export interface Certification {
  id: string;
  code: string;
  title: string;
  description: string;
  skills_outline_date: string;
}

export interface Domain {
  id: string;
  certification_id: string;
  name: string;
  weight_min_pct: number;
  weight_max_pct: number;
  slug: string;
  order_index: number;
}

export interface Topic {
  id: string;
  domain_id: string;
  title: string;
  slug: string;
  outline_skill: string;
  source_url: string;
  order_index: number;
  summary?: string;
}

export interface Question {
  id: string;
  topic_id: string;
  stem: string;
  type: QuestionType;
  options: string[];
  correct: string[];
  explanation: string;
  wrong_option_notes: Record<string, string>;
  difficulty: Difficulty;
  outline_skill: string;
  source_url: string;
  status: ContentStatus;
  verified_at?: string;
  review_notes?: string;
}

export interface Flashcard {
  id: string;
  topic_id: string;
  front: string;
  back: string;
  african_analogy?: string;
  outline_skill: string;
  source_url: string;
  status: ContentStatus;
  verified_at?: string;
}

export type SM2Rating = 'again' | 'hard' | 'good' | 'easy';

export interface CardProgress {
  id: string;
  user_id: string;
  card_id: string;
  ease: number; // default 2.50
  interval_days: number;
  due_at: string;
  lapses: number;
  repetitions: number;
  updated_at: string;
}

export interface Attempt {
  id: string;
  user_id?: string;
  question_id: string;
  selected: string[];
  is_correct: boolean;
  time_ms: number;
  created_at: string;
}

export interface MockExam {
  id: string;
  user_id?: string;
  score_pct: number;
  domain_breakdown: Record<string, { total: number; correct: number; pct: number }>;
  duration_seconds: number;
  completed_at: string;
}

export interface WeekdayHours {
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

export interface StudyPlan {
  id: string;
  user_id?: string;
  exam_date: string;
  hours_per_day: WeekdayHours;
  weak_topics: string[];
  created_at: string;
}

export type TaskType = 'study' | 'quiz' | 'flashcards' | 'mock' | 'review';

export interface PlanTask {
  id: string;
  plan_id: string;
  date: string;
  topic_id?: string;
  task_type: TaskType;
  title: string;
  estimated_minutes: number;
  is_completed: boolean;
}

export type SupportedLanguage = 'English' | 'Kiswahili' | 'Sheng' | 'Nigerian Pidgin' | 'Other';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'rafiki';
  content: string;
  timestamp: string;
  topic?: string;
}

export interface ContentReport {
  id: string;
  user_id?: string;
  content_type: 'question' | 'flashcard' | 'rafiki_message';
  content_id: string;
  issue_text: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  target_exam_date?: string;
  weekly_hours: number;
  preferred_language: SupportedLanguage;
  is_guest: boolean;
}

export interface TopicReadiness {
  topic_id: string;
  topic_title: string;
  domain_id: string;
  slug: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy_pct: number;
  is_weak: boolean;
}

export interface DomainReadiness {
  domain_id: string;
  domain_name: string;
  exam_weight_pct: number;
  recent_accuracy_pct: number;
  attempts_count: number;
  has_enough_data: boolean;
}

export interface ReadinessScoreResult {
  overall_score: number;
  band: 'Not ready' | 'Getting there' | 'Almost ready' | 'Exam ready';
  band_description: string;
  domain_breakdowns: DomainReadiness[];
  topic_readiness: TopicReadiness[];
  mock_exam_qualifies: boolean;
  streak_days: number;
  total_questions_answered: number;
  next_best_action: {
    title: string;
    description: string;
    action_url: string;
    action_label: string;
    type: 'quiz' | 'flashcard' | 'diagnostic' | 'mock';
  };
}

