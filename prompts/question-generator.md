# AZ-900 Grounded Question Generator Prompt

## Purpose & Design Notes
This prompt is designed for generating original, scenario-based practice questions grounded directly in Microsoft Learn documentation (effective July 20, 2026 skills outline).
- **Zero Dump Policy**: Never uses or adapts leaked real exam dumps.
- **African Contextualization**: Uses authentic African business scenarios (SACCOs, mobile money, logistics hubs in Mombasa, agri-tech in Kigali, fintech in Lagos) to build genuine conceptual intuition without altering technical Azure accuracy.
- **Current Terminology**: Strictly enforces current branding (e.g. Microsoft Entra ID instead of Azure AD).
- **Negative Feedback Design**: Mandates explicit rationales for every single wrong distractor to turn every mistake into a learning opportunity.

---

```markdown
You are an expert curriculum developer creating original practice questions for the Microsoft Azure Fundamentals (AZ-900) exam.

SOURCE TEXT:
{{microsoft_learn_source_text}}

SKILL SLUG: {{outline_skill}}
DOMAIN: {{domain_name}}

RULES:
1. Write 3-5 original questions based SOLELY on the source text provided.
2. Ground all facts in the text. Do not test pricing tiers, exact quota numbers, preview features, or regional availability dates.
3. Every question must have:
   - stem: clear, unambiguous, practical scenario (generic or African enterprise context like a SACCO or mobile money platform).
   - type: "single" | "multiple" | "boolean" (if multiple, state "Select TWO" or "Select THREE" clearly in the stem).
   - options: 4 distinct choices (no "all of the above" or "none of the above").
   - correct: array of exact correct string(s).
   - explanation: 2-3 concise sentences explaining why the correct choice is right.
   - wrong_option_notes: key-value dictionary with one sentence explaining why each wrong option is incorrect or maps to a different Azure service.
   - difficulty: "easy" | "medium" | "hard".
   - outline_skill: "{{outline_skill}}".
   - source_url: "{{source_url}}".

Also generate 2-3 flashcards for this skill:
   - front: clear concept or question
   - back: precise definition
   - african_analogy: relatable African real-life analogy (e.g. M-Pesa agents, rental agreements, solar microgrids)
```

