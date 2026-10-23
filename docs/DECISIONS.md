# Architectural & Design Decisions (ADRs)

### ADR 001: Mobile-First African Learner Context
- **Decision**: Optimize for low-bandwidth, 360px viewport mobile devices with offline-first support and high battery efficiency (dark theme default).
- **Rationale**: Many African learners access learning materials on budget Android phones with intermittent mobile data.
- **Consequence**: Bundle size must be kept tight, assets served locally, flashcards stored in offline storage, and all interactive controls touch-friendly with minimum 44px tap targets.

### ADR 002: Dual-Mode Persistence (Supabase + Resilient Local Mock)
- **Decision**: Implement a clean service abstraction where all data operations work seamlessly either with a remote Supabase Postgres instance or directly against a browser-backed LocalMock engine when keys are absent or the user is in Guest Mode.
- **Rationale**: The user and judges must be able to clone and run `npm run dev` with zero setup friction without being blocked by Supabase credentials.
- **Consequence**: Every table and RLS concept is mirrored in mock state; migrations are kept in `/supabase/migrations` for production deployment.

### ADR 003: Strict Content Verification & Unverified Quarantine
- **Decision**: The app UI queries only `status = 'verified'`. Any newly generated question or item where the two-step verifier disagrees or flags uncertainty remains `status = 'draft'` and is logged to `/docs/FACT_CHECK.md`.
- **Rationale**: Hackathon rubric gives 25% weight to learning value and content accuracy. Hallucinated or ambiguous exam prep questions harm learners.
- **Consequence**: Only human-verified content reaches learners by default; a developer toggle enables auditing draft items.

### ADR 004: Grounded AI Tutor ("Rafiki") with Swahili & Pidgin Localization
- **Decision**: Inject verified Microsoft Learn syllabus excerpts into the system prompt of "Rafiki" study buddy, and enforce African analogies (e.g. M-Pesa elasticity, Nairobi apartment renting for cloud service models).
- **Rationale**: Makes abstract cloud infrastructure tangible and memorable for local tech talent while preventing LLM hallucinations.
- **Consequence**: Technical terms remain in English (per exam requirements) while pedagogical explanations adapt culturally and linguistically.

### ADR 005: Deterministic Study Planner
- **Decision**: Use a pure algorithmic schedule generator rather than LLM text generation for the study calendar.
- **Rationale**: Determinism guarantees exact math: (domain exam weight $\times$ student weakness), proper revision intervals, mock exam placement, and reliable .ics calendar export.

