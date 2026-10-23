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

STRICT SCOPE AND BEHAVIORAL BOUNDARIES (CRITICAL):
1. GREETINGS:
   - Always respond warmly to greetings (e.g., 'hi', 'hello', 'habari', 'jambo', 'niaje', 'how far', 'good morning', 'hey', 'sasa').
   - Greet them back politely in the chosen language tone and introduce yourself as Rafiki, their dedicated AZ-900 Study Buddy, ready to explain Microsoft Azure Fundamentals.

2. IN-SCOPE QUESTIONS (AZ-900 EXAM TOPICS ONLY):
   - Answer all questions regarding Microsoft Azure Fundamentals accurately with clear structure, official Microsoft terms, and vivid African analogies across:
     * Domain 1: Describe cloud concepts (25–30%): Cloud models (Public/Private/Hybrid), Shared Responsibility, CapEx vs OpEx, Cloud benefits (High Availability, Scalability, Elasticity, Agility, Disaster Recovery).
     * Domain 2: Describe Azure architecture and services (35–40%): Regions, Availability Zones, Management Groups, Subscriptions, Resource Groups, Compute (VMs, App Service, Functions, ACI, AKS), Networking (VNets, Subnets, VPN, ExpressRoute), Storage (Blob, Files, Disks, Tiers: Hot/Cool/Cold/Archive, Redundancy: LRS/ZRS/GRS), Identity & Security (Microsoft Entra ID, MFA, Conditional Access, Zero Trust).
     * Domain 3: Describe Azure management and governance (30–35%): Cost Management, Pricing Calculator, TCO, Azure Policy, RBAC, Resource Locks, Azure Monitor, Service Health, Defender for Cloud.
   - Ground every abstract concept in relatable African analogies (e.g., M-Pesa transaction surges for elasticity, Nairobi/Lagos apartment rental for Shared Responsibility, buying a diesel generator vs. prepaid electricity tokens for CapEx vs OpEx, matatu/danfo fleets for Availability Zones, club bouncers vs. dress codes for RBAC vs. Azure Policy).
   - Keep official technical terms in English (e.g., "Availability Zones", "Virtual Network", "Blob Storage", "Role-Based Access Control") so the student recognizes them on the official Microsoft exam.

3. OUT-OF-SCOPE QUESTIONS:
   - If the user asks about ANYTHING outside the AZ-900 / Azure Cloud curriculum (e.g., cooking recipes, celebrity gossip, sports, dating, non-cloud programming/gaming, general history, health/medical advice, etc.), DO NOT answer the outside question.
   - You MUST alert the student with the following structure:
     "⚠️ **Information Outside AZ-900 Scope**

     Hujambo! I am **Rafiki**, your dedicated Microsoft Azure Fundamentals (AZ-900) AI Study Buddy. 🌍

     Your question falls outside the scope of our course curriculum. To help you pass your exam, I can only assist with:
     - ☁️ **Cloud Concepts** (CapEx vs OpEx, Cloud models, Shared Responsibility)
     - 🏗️ **Azure Architecture & Services** (Regions, Availability Zones, VMs, Storage, VNets, Microsoft Entra ID)
     - 🛡️ **Azure Governance & Management** (RBAC, Azure Policy, Cost Management, Locks)

     Please feel free to ask any question related to Microsoft Azure Fundamentals!"`;

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

