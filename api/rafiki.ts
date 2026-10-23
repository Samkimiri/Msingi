// Vercel Serverless Function for Rafiki AI Study Buddy
// Powered by Google Gemini API with fallback handling

export const config = {
  runtime: 'nodejs',
};

interface RafikiRequestBody {
  message: string;
  language?: 'English' | 'Kiswahili' | 'Sheng' | 'Nigerian Pidgin';
  history?: Array<{ sender: 'user' | 'rafiki'; content: string }>;
  questionContext?: {
    stem: string;
    options: string[];
    correct: string[];
    explanation: string;
    outline_skill?: string;
  };
}

const SYSTEM_INSTRUCTION = `You are Rafiki, a friendly, encouraging, and highly knowledgeable AI Study Buddy designed for African developers and students preparing for the Microsoft Azure Fundamentals (AZ-900) exam.

Your mission:
1. Ground every abstract cloud infrastructure concept in vivid, culturally relatable African analogies (e.g., M-Pesa transaction surges for elasticity, Nairobi/Lagos apartment rental for Shared Responsibility, buying a diesel generator vs. prepaid electricity tokens for CapEx vs OpEx, matatu/danfo fleets for Availability Zones, club bouncers vs. dress codes for RBAC vs. Azure Policy).
2. Keep official technical terms in English (e.g., "Availability Zones", "Virtual Network", "Blob Storage", "Role-Based Access Control") so the student recognizes them on the official Microsoft exam.
3. Adapt the tone and conversational framing to the student's selected language:
   - English: Clear, friendly, engaging African-grounded tech coach.
   - Kiswahili: Warm, respectful East African mentor ("Jambo ndugu/rafiki!").
   - Sheng: Energetic Nairobi tech youth vibe ("Niaje msee! Cheki hii story...").
   - Nigerian Pidgin: Vibrant, punchy West African tech buddy ("How far my person! Make I break am down for you sharp sharp...").
4. Keep answers concise, formatted with clear markdown bullet points and bold highlights.
5. Strictly adhere to the official AZ-900 skills outline:
   - Domain 1: Describe cloud concepts (25–30%)
   - Domain 2: Describe Azure architecture and services (35–40%)
   - Domain 3: Describe Azure management and governance (30–35%)
6. Never hallucinate fake Azure services. If unsure or if a question is outside AZ-900, gently guide the learner back to exam topics.`;

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: RafikiRequestBody = await req.json();
    const { message, language = 'English', history = [], questionContext } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid message property' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'Gemini API key is not configured on the backend server',
          fallbackNeeded: true,
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Build context-enriched prompt
    let promptContent = `Language preference: ${language}\n`;
    if (questionContext) {
      promptContent += `\n[Exam Question Context]:\nQuestion: "${questionContext.stem}"\nOptions:\n${questionContext.options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\nCorrect Answer: ${questionContext.correct.join(', ')}\nOfficial Explanation: ${questionContext.explanation}\nSyllabus Skill: ${questionContext.outline_skill || 'General'}\n`;
    }

    // Format chat history for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add recent history (last 4 messages for concise context)
    const recentHistory = history.slice(-4);
    for (const h of recentHistory) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      });
    }

    // Add current user prompt with question context
    contents.push({
      role: 'user',
      parts: [{ text: `${promptContent}\nUser Question: ${message}` }],
    });

    const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1000,
          topP: 0.9,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.text();
      console.error('Gemini API Error:', geminiRes.status, errData);
      return new Response(
        JSON.stringify({
          error: `Gemini API returned status ${geminiRes.status}`,
          details: errData,
          fallbackNeeded: true,
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const data = await geminiRes.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Samahani, I could not generate an answer right now. Please try again!';

    return new Response(
      JSON.stringify({
        reply: replyText,
        source: 'gemini-live',
        language,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('Error handling /api/rafiki:', err);
    return new Response(
      JSON.stringify({
        error: err?.message || 'Internal server error',
        fallbackNeeded: true,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

