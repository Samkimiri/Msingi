-- Msingi: Certification Platform Schema
-- Generic schema designed for AZ-900, AI-900, AZ-104, etc.

-- 1. Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- e.g., 'AZ-900'
    title TEXT NOT NULL,
    description TEXT,
    skills_outline_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Domains
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certification_id UUID REFERENCES certifications(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    weight_min_pct INT NOT NULL,
    weight_max_pct INT NOT NULL,
    slug TEXT NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT domain_slug_cert_unique UNIQUE(certification_id, slug)
);

-- 3. Topics
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    outline_skill TEXT NOT NULL,
    source_url TEXT NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT topic_slug_domain_unique UNIQUE(domain_id, slug)
);

-- 4. Questions
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    stem TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('single', 'multiple', 'boolean')),
    options JSONB NOT NULL,
    correct JSONB NOT NULL,
    explanation TEXT NOT NULL,
    wrong_option_notes JSONB NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    outline_skill TEXT NOT NULL,
    source_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'verified')),
    verified_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Flashcards
CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    african_analogy TEXT,
    outline_skill TEXT NOT NULL,
    source_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'verified')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    target_exam_date DATE,
    weekly_hours INT DEFAULT 10,
    preferred_language TEXT DEFAULT 'English',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Card Progress (Spaced Repetition SM-2)
CREATE TABLE IF NOT EXISTS card_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
    ease NUMERIC(4,2) DEFAULT 2.50,
    interval_days INT DEFAULT 0,
    due_at TIMESTAMPTZ DEFAULT NOW(),
    lapses INT DEFAULT 0,
    repetitions INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_card_unique UNIQUE (user_id, card_id)
);

-- 8. Quiz Attempts
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_ms INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Mock Exams
CREATE TABLE IF NOT EXISTS mock_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score_pct NUMERIC(5,2) NOT NULL,
    domain_breakdown JSONB NOT NULL,
    duration_seconds INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Study Plans & Plan Tasks
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    hours_per_day JSONB NOT NULL, -- e.g. {"mon": 2, "tue": 1.5, ...}
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plan_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    task_type TEXT NOT NULL, -- 'study', 'quiz', 'flashcards', 'mock', 'review'
    title TEXT NOT NULL,
    estimated_minutes INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Chat Sessions (Rafiki Study Buddy)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'English',
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Content Reports
CREATE TABLE IF NOT EXISTS content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- nullable for guest mode
    content_type TEXT NOT NULL CHECK (content_type IN ('question', 'flashcard', 'rafiki_message')),
    content_id TEXT NOT NULL,
    issue_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

-- Content: Publicly readable for verified items
CREATE POLICY "Public read verified certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public read verified domains" ON domains FOR SELECT USING (true);
CREATE POLICY "Public read verified topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Public read verified questions" ON questions FOR SELECT USING (status = 'verified');
CREATE POLICY "Public read verified flashcards" ON flashcards FOR SELECT USING (status = 'verified');

-- User Data: Owner only
CREATE POLICY "User profiles self manage" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "User card progress self manage" ON card_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User attempts self manage" ON attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User mock exams self manage" ON mock_exams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User study plans self manage" ON study_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User plan tasks self manage" ON plan_tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM study_plans WHERE study_plans.id = plan_tasks.plan_id AND study_plans.user_id = auth.uid())
);
CREATE POLICY "User chat sessions self manage" ON chat_sessions FOR ALL USING (auth.uid() = user_id);

-- Content Reports: anyone (including guests) can insert
CREATE POLICY "Anyone can submit content reports" ON content_reports FOR INSERT WITH CHECK (true);

