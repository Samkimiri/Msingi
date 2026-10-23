# Vercel Deployment & Backend Integration Guide 🚀

This document details how **Msingi** connects its frontend and serverless backend on **Vercel**, integrated with **Supabase** and the **Google Gemini API**.

---

## 🏗️ Architecture

```
                       ┌────────────────────────────────────────┐
                       │          Vercel Cloud Edge             │
                       │                                        │
  [Learner Device] ───►│  [React 18 + Tailwind SPA]             │
   (Mobile/PWA)        │    │                                   │
                       │    ├──► /api/rafiki (Serverless Node)  ───► Google Gemini API
                       │    │    (African Analogies Grounding)       (Protected GEMINI_API_KEY)
                       │    │                                   │
                       │    ├──► /api/report (Serverless Node)  ───► Supabase REST API
                       │    │                                   │
                       │    └──► /api/health (Diagnostics)      │
                       │                                        │
                       └──────────────────┬─────────────────────┘
                                          │ Direct Client Sync
                                          ▼
                             [Supabase PostgreSQL + RLS]
                             (User profiles, attempts, cards)
```

---

## 🛠️ Step 1: Set Up Supabase Backend Database

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and create a project (e.g. `msingi-az900`).
2. Navigate to **SQL Editor** in the left sidebar.
3. Open [`supabase/migrations/20261022000000_init_schema.sql`](../supabase/migrations/20261022000000_init_schema.sql).
4. Copy and paste the entire SQL file into the Supabase SQL editor and click **Run**.
5. Go to **Project Settings** > **API**:
   - Copy **Project URL**
   - Copy **anon / public** API key
   - Copy **service_role** API key (keep secret)

---

## ⚡ Step 2: Deploy to Vercel

### Option A: Via GitHub (Recommended)

1. Push your latest code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: add vercel serverless backend and configuration"
   git push origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your repository: `Samkimiri/Msingi`.
4. Vercel will automatically detect the **Vite** framework, `npm run build` command, and `dist` output folder from [`vercel.json`](../vercel.json).
5. In **Environment Variables**, add the following:

| Variable Name | Environment | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Production, Preview, Dev | Your Supabase Project URL (`https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Production, Preview, Dev | Your Supabase anonymous public key |
| `GEMINI_API_KEY` | Production, Preview, Dev | Google Gemini API key for the serverless AI tutor |
| `GEMINI_MODEL` | Production, Preview, Dev | `gemini-1.5-flash` or `gemini-2.5-flash` |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Dev | Optional: Supabase service role key for backend API writes |

6. Click **Deploy**.

---

### Option B: Via Vercel CLI

If you have the Vercel CLI installed:
```bash
npm install -g vercel
vercel login
vercel
```
Follow the interactive prompts to link the project. For production deployment:
```bash
vercel --prod
```

---

## 🔍 Step 3: Verify Backend Endpoints

Once your site is deployed (e.g. `https://msingi.vercel.app`):

### 1. Health Diagnostics
Visit:
```
https://<your-project>.vercel.app/api/health
```
Expected response:
```json
{
  "status": "healthy",
  "app": "Msingi AZ-900 Prep",
  "integrations": {
    "gemini": "configured",
    "supabase": "configured"
  },
  "environment": "production"
}
```

### 2. Rafiki AI Study Buddy Test
Test the AI tutor backend via POST:
```bash
curl -X POST https://<your-project>.vercel.app/api/rafiki \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain CapEx vs OpEx", "language": "Kiswahili"}'
```

### 3. SPA Routing & Fallback
Test direct URL routing like `https://<your-project>.vercel.app/quiz` to confirm that [`vercel.json`](../vercel.json) correctly rewrites to `index.html` without 404 errors.

---

## 🛡️ Offline-First Resiliency

Even if network connection drops or API keys are temporarily unavailable:
- The app automatically falls back to browser-backed `localStorage` for all attempts, flashcard SM-2 progress, and study plans.
- Rafiki falls back to its built-in rule-based grounded syllabus engine with cultural analogies in English, Kiswahili, Sheng, and Nigerian Pidgin.
- No learner is ever blocked or left with a blank screen.

