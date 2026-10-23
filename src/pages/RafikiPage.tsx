import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Languages,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Bot,
  User,
  Globe,
  Check,
} from 'lucide-react';
import { SEED_FLASHCARDS } from '../data/seed-flashcards';
import { SEED_QUESTIONS } from '../data/seed-questions';
import { TOPICS, DOMAINS } from '../data/az900-syllabus';
import { AZ900_STRUCTURED_NOTES } from '../data/az900-notes';
import { StorageService } from '../lib/storage';
import { ChatMessage, SupportedLanguage, Question } from '../types';
import { ReportModal } from '../components/common/ReportModal';

interface RafikiPageProps {
  initialQuestion?: Question | null;
  onNavigate: (page: string) => void;
}

const PRESET_CHIPS = [
  'Explain CapEx vs OpEx like a market stall',
  'Why does Shared Responsibility matter in Kenya / Nigeria?',
  'Explain Azure Availability Zones using matatus & danfos',
  'What is the difference between Azure Policy and RBAC?',
  'Explain IaaS vs PaaS vs SaaS using African street food',
  'How does Azure Blob Storage tiering save money?',
];

export const RafikiPage: React.FC<RafikiPageProps> = ({
  initialQuestion,
  onNavigate,
}) => {
  const profile = StorageService.getProfile();
  const [language, setLanguage] = useState<SupportedLanguage>(
    profile.preferred_language || 'English'
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = StorageService.getChatMessages();
    if (saved.length > 0) return saved;

    return [
      {
        id: 'msg-welcome',
        sender: 'rafiki',
        content: `Habari! I am **Rafiki**, your personal AZ-900 Study Buddy. 🌍\n\nI break down tricky cloud concepts using real African analogies (from M-Pesa to Lagos traffic and Mombasa ports) so that they stick in your memory for the exam.\n\nAsk me anything about Microsoft Azure Fundamentals, or choose one of the prompt chips below!`,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [reportMsgId, setReportMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle incoming initial question prompt
  useEffect(() => {
    if (initialQuestion) {
      const qPrompt = `Please explain this AZ-900 exam question and why the right answer is correct:\n\n"${initialQuestion.stem}"\n\nOptions:\n${initialQuestion.options.map((o, i) => `${i + 1}. ${o}`).join('\n')}`;
      handleSendMessage(qPrompt);
    }
  }, [initialQuestion]);

  // Grounded AI answering engine with strict course boundaries, African analogies, and language localization
  const generateRafikiResponse = (userText: string, currentLang: SupportedLanguage): string => {
    const text = userText.toLowerCase().trim();

    // 1. GREETINGS CHECK (resumes greetings in selected language)
    const greetingWords = [
      'hi', 'hello', 'hey', 'habari', 'jambo', 'mambo', 'niaje', 'sasa',
      'how far', 'kedu', 'good morning', 'good afternoon', 'good evening',
      'greetings', 'yo', 'sup', 'salut'
    ];
    const isPureGreeting =
      greetingWords.some(g => new RegExp(`(^|\\b)${g}(\\b|$)`, 'i').test(text)) &&
      text.split(/\s+/).length <= 4;

    if (isPureGreeting) {
      if (currentLang === 'Kiswahili') {
        return `Jambo rafiki! Mimi ni **Rafiki**, msaidizi wako maalum wa masomo ya Microsoft Azure Fundamentals (AZ-900). 🌍\n\nNipo hapa kukusaidia kuelewa kila dhana ya wingu kwa mifano rahisi ya Kiafrika. Je, una swali lolote kuhusu Cloud Concepts, Azure Architecture, au Management & Governance? Niulize sasa!`;
      }
      if (currentLang === 'Sheng') {
        return `Niaje msee! Ni **Rafiki**, study buddy wako wa ukweli wa AZ-900. 🌍\n\nForm ni gani leo? Nirushe maswali kuhusu cloud concepts, Azure servers, au security nikupe ma-analogy za mtaani zikushike mbaya kwa exam!`;
      }
      if (currentLang === 'Nigerian Pidgin') {
        return `How far my person! Na **Rafiki**, your correct AZ-900 Study Buddy. 🌍\n\nHow I fit help you pass your Azure exam today? Ask me anything about Cloud concepts, Azure architecture, or governance, make I break am down sharp sharp!`;
      }
      return `Habari! I am **Rafiki**, your dedicated Microsoft Azure Fundamentals (AZ-900) AI Study Buddy. 🌍\n\nI am here to help you pass the AZ-900 exam by breaking down tricky cloud concepts with relatable African analogies. What topic would you like to explore today? You can ask about Cloud Concepts, Azure Services, or Governance & Security!`;
    }

    // 2. COURSE SCOPE VALIDATION (Check if the question relates to Azure / Cloud / AZ-900)
    const azureKeywords = [
      'azure', 'cloud', 'iaas', 'paas', 'saas', 'capex', 'opex', 'server', 'compute',
      'storage', 'blob', 'disk', 'file', 'queue', 'network', 'vnet', 'subnet', 'vpn',
      'expressroute', 'nsg', 'firewall', 'security', 'identity', 'entra', 'active directory',
      'mfa', 'conditional access', 'zero trust', 'rbac', 'role', 'policy', 'governance',
      'lock', 'cost', 'pricing', 'tco', 'sla', 'high availability', 'scalability',
      'elasticity', 'agility', 'disaster recovery', 'fault tolerance', 'region', 'zone',
      'datacenter', 'virtual machine', 'vm', 'container', 'aks', 'aci', 'app service',
      'function', 'serverless', 'monitor', 'service health', 'log analytics', 'defender',
      'purview', 'subscription', 'resource group', 'management group', 'arm', 'bicep',
      'compliance', 'trust center', 'backup', 'database', 'sql', 'cosmos', 'exam',
      'az-900', 'az900', 'microsoft', 'shared responsibility', 'consumption', 'redundancy',
      'lrs', 'zrs', 'grs', 'archive', 'cool', 'hot', 'cold', 'advisor', 'scale set',
      'what is', 'explain', 'difference', 'how does'
    ];

    const hasAzureKeyword = azureKeywords.some(k => text.includes(k));
    const matchesStructuredNote = AZ900_STRUCTURED_NOTES.some(
      n => text.includes(n.title.toLowerCase()) || n.core_principles.some(p => text.includes(p.toLowerCase().slice(0, 15)))
    );
    const matchesSyllabus = TOPICS.some(
      t => text.includes(t.title.toLowerCase()) || text.includes(t.slug)
    );

    // If query has no relevance to the AZ-900 course, alert student that it is out of scope
    if (!hasAzureKeyword && !matchesStructuredNote && !matchesSyllabus) {
      return `⚠️ **Information Outside AZ-900 Scope**\n\nHujambo! I am **Rafiki**, your dedicated Microsoft Azure Fundamentals (AZ-900) AI Study Buddy. 🌍\n\nYour question appears to fall outside the scope of our course curriculum. To ensure you make the most of your study time and pass your exam, I can only assist with topics covered on the official AZ-900 exam:\n\n- ☁️ **Domain 1: Cloud Concepts (25-30%)**\n  * CapEx vs. OpEx, Cloud models (Public/Private/Hybrid), Shared Responsibility, Cloud benefits (HA, Scalability, Elasticity).\n- 🏗️ **Domain 2: Azure Architecture and Services (35-40%)**\n  * Regions & Availability Zones, Subscriptions, Compute (VMs, Containers, Functions), Storage (Blob, Tiers), Networking (VNets, ExpressRoute), Identity (Microsoft Entra ID).\n- 🛡️ **Domain 3: Azure Management and Governance (30-35%)**\n  * Azure Policy, RBAC, Resource Locks, Cost Management, Pricing Calculator, Azure Monitor, Service Health.\n\nPlease ask any question related to Microsoft Azure Fundamentals!`;
    }

    // Language prefix greetings
    let greeting = '';
    if (currentLang === 'Kiswahili') {
      greeting = 'Jambo rafiki! Hili hapa jibu lako sahihi kulingana na muhtasari wa Microsoft:\n\n';
    } else if (currentLang === 'Sheng') {
      greeting = 'Niaje msee! Cheki hii explanation fiti kabisa kulingana na syllabus ya Microsoft:\n\n';
    } else if (currentLang === 'Nigerian Pidgin') {
      greeting = 'How far my person! Make I break am down for you sharp sharp according to Microsoft standard:\n\n';
    }

    // 3. IN-SCOPE GROUNDED EXPLANATIONS WITH AFRICAN ANALOGIES

    // CapEx vs OpEx
    if (text.includes('capex') || text.includes('opex') || text.includes('capital expenditure') || text.includes('operating expenditure') || text.includes('market stall')) {
      return `${greeting}**CapEx vs OpEx (Cloud Economics)**:\n\n- **CapEx (Capital Expenditure)**: Heavy upfront financial spending on physical datacenter equipment (servers, generators, cooling). You absorb hardware depreciation and maintenance risk.\n- **OpEx (Operating Expenditure)**: Ongoing spending on operational services consumed dynamically (pay-as-you-go). No upfront costs, immediate tax deduction in billing cycle.\n\n**African Market Analogy**: CapEx is buying a commercial diesel generator in cash to power a shop in Nairobi or Lagos. OpEx is buying daily prepaid electricity tokens (tokens za stima) from your mobile phone—you pay only for the exact kilowatt-hours consumed!\n\n**AZ-900 Exam Takeaway**: Cloud computing shifts spending from CapEx to OpEx via a consumption-based pricing model.`;
    }

    // Shared Responsibility Model
    if (text.includes('shared responsibility') || text.includes('responsibility model')) {
      return `${greeting}**The Shared Responsibility Model**:\n\nSecurity and operations in Azure are a shared partnership between Microsoft and the customer:\n- **In IaaS**: Microsoft manages physical datacenter security, power, and hypervisors. You manage the guest OS, runtime, networking rules, applications, and data.\n- **In PaaS**: Microsoft manages physical servers AND operating system patching. You configure application settings and data.\n- **In SaaS**: Microsoft manages the entire software application. You manage users, data, and access.\n\n**Analogy**: Renting an apartment in Nairobi or Lagos: The landlord (Microsoft) maintains the building foundations, walls, and exterior gate. YOU are always 100% responsible for locking your door, keeping your valuables safe, and who you give keys to (Data, Identities, & Devices).\n\n**Exam Golden Rule**: Regardless of cloud model, the customer ALWAYS retains responsibility for **Data**, **Identities & Accounts**, and **Devices (Endpoints)**!`;
    }

    // Availability Zones & Regions
    if (text.includes('availability zone') || text.includes('region') || text.includes('datacenter')) {
      return `${greeting}**Azure Regions & Availability Zones**:\n\n- **Region**: A geographical area containing one or more physical datacenters connected via dedicated low-latency fiber (e.g. South Africa North in Johannesburg).\n- **Availability Zones (AZs)**: Physically separate datacenters within the SAME region. Each zone has independent power, cooling, and networking. Minimum of 3 zones per supported region.\n- **Region Pairs**: Each region is paired with another region within the same geography (>300 miles away) for disaster recovery.\n\n**Analogy**: If a logistics business stores all inventory in one single warehouse in Mombasa, a power surge stops all deliveries. If inventory is split across 3 separate warehouses in different suburbs with independent backup generators, one failure never halts business!\n\n**AZ-900 Tip**: Availability Zones protect against **datacenter-level failures**; Region Pairs protect against **regional natural disasters**.`;
    }

    // Azure Policy vs RBAC
    if (text.includes('policy') || text.includes('rbac') || text.includes('role-based') || text.includes('locks') || text.includes('resource lock')) {
      return `${greeting}**Azure Policy vs. RBAC vs. Resource Locks**:\n\n- **RBAC (Role-Based Access Control)** focuses on **WHO**: Can Amina create VMs? Can Kwame delete databases? (User authorization).\n- **Azure Policy** focuses on **WHAT PROPERTIES**: When any authorized user creates a resource, does it meet company rules? (e.g. "Only deploy in South Africa North", "Require CostCenter tag").\n- **Resource Locks**: Prevents accidental deletion (CanNotDelete) or modification (ReadOnly) of critical resources. Locks take precedence over RBAC!\n\n**Analogy**: RBAC is the club bouncer checking your ID at the door (authorization). Azure Policy is the dress code inside: even VIP guests with full access cannot enter wearing muddy flip-flops! A Resource Lock is placing the master keys in a locked glass case.`;
    }

    // IaaS vs PaaS vs SaaS
    if (text.includes('iaas') || text.includes('paas') || text.includes('saas')) {
      return `${greeting}**IaaS vs PaaS vs SaaS (Cloud Service Models)**:\n\n1. **IaaS (Infrastructure as a Service)**: Maximum flexibility. Microsoft provides virtual hardware, you manage OS, middleware, and software (e.g. Azure Virtual Machines).\n2. **PaaS (Platform as a Service)**: Focus on building applications without server management. Microsoft handles OS patching, scaling, and runtime (e.g. Azure App Service, Azure SQL Database).\n3. **SaaS (Software as a Service)**: Fully managed end-user application consumed over the internet (e.g. Microsoft 365, OneDrive).\n\n**Nyama Choma / Street Food Analogy**:\n- IaaS is buying raw meat and charcoal to grill your own nyama choma at home (full control, all work).\n- PaaS is going to a butchery where the grill master provides the hot fire and grill, and you just season your meat (platform provided).\n- SaaS is sitting in a restaurant where food is cooked and plated for you (ready to consume).`;
    }

    // Storage Tiers
    if (text.includes('blob') || text.includes('storage') || text.includes('tier') || text.includes('hot') || text.includes('cool') || text.includes('archive')) {
      return `${greeting}**Azure Blob Storage Access Tiers**:\n\n- **Hot Tier**: High storage cost, lowest access cost. For active, daily-accessed data.\n- **Cool Tier**: Lower storage cost, higher access fee. For data stored for at least 30 days (e.g. monthly bank statements).\n- **Cold Tier**: Even lower storage cost, higher access fee. Stored for at least 90 days.\n- **Archive Tier**: Lowest storage cost, highest access fee. Stored for at least 180 days; data is offline and takes hours to rehydrate.\n\n**Analogy**: Hot tier is cash in your mobile money wallet. Cool tier is funds in your bank savings. Archive tier is buying land upcountry: almost zero daily cost to hold, but takes time to liquidate when you need money!`;
    }

    // Microsoft Entra ID & Zero Trust
    if (text.includes('entra') || text.includes('active directory') || text.includes('mfa') || text.includes('zero trust') || text.includes('conditional access')) {
      return `${greeting}**Microsoft Entra ID & Cloud Security**:\n\n- **Microsoft Entra ID**: Cloud-based identity and access management service. Centralizes user sign-in and authentication across Azure Portal, Microsoft 365, and SaaS apps.\n- **Authentication (AuthN)**: Proves WHO you are (e.g. passwords, biometric sign-in).\n- **Authorization (AuthZ)**: Verifies WHAT permissions you have (e.g. RBAC roles).\n- **Conditional Access**: Automated security policy ("If employee logs in outside Africa, enforce MFA").\n- **Zero Trust**: "Never trust, always verify." Assume breach, verify explicitly, and grant least-privilege access.\n\n**Analogy**: Authentication is showing your National ID card to the bank teller. Authorization is checking your account ledger to see if you have enough balance to withdraw funds.`;
    }

    // Check matched note from structured notes
    const matchedNote = AZ900_STRUCTURED_NOTES.find(
      n => text.includes(n.title.toLowerCase()) || text.includes(n.id) || text.includes(n.outline_skill)
    );
    if (matchedNote) {
      return `${greeting}**${matchedNote.title}** (${matchedNote.domain_name}):\n\n${matchedNote.official_summary}\n\n**Core Key Points**:\n${matchedNote.core_principles.slice(0, 3).map(p => `- ${p.replace(/\*\*/g, '')}`).join('\n')}\n\n**Analogy**: "${matchedNote.african_analogy}"\n\n**Exam Watch**: ${matchedNote.exam_watch[0]}`;
    }

    // Check matched topic from syllabus
    const matchedTopic = TOPICS.find(t =>
      t.title.toLowerCase().includes(text) ||
      t.slug.toLowerCase().includes(text) ||
      text.includes(t.title.toLowerCase().split(' ')[0])
    );
    if (matchedTopic) {
      const relatedCard = SEED_FLASHCARDS.find(c => c.topic_id === matchedTopic.id);
      return `${greeting}**${matchedTopic.title}** (${matchedTopic.outline_skill}):\n\n${relatedCard?.back || matchedTopic.summary}\n\n${relatedCard?.african_analogy ? `**Analogy**: "${relatedCard.african_analogy}"\n\n` : ''}**AZ-900 Exam Tip**: Ensure you know how Microsoft defines this service and which tier or model applies.`;
    }

    // Default grounded in-scope guide
    return `${greeting}In Microsoft Azure Fundamentals (AZ-900), remember the 3 foundational domains:\n\n1. **Describe Cloud Concepts (25-30%)**: Cloud models (IaaS/PaaS/SaaS), Shared Responsibility, CapEx vs OpEx, and cloud benefits (High Availability, Scalability, Elasticity, Agility).\n2. **Describe Azure Architecture and Services (35-40%)**: Regions, Availability Zones, Resource Groups, Subscriptions, Compute (VMs, Functions, Containers), Storage (Blob, Files, Tiers), and Networking (VNet, VPN, ExpressRoute).\n3. **Describe Azure Management and Governance (30-35%)**: Azure Policy, RBAC, Resource Locks, Cost Management, Pricing Calculator, Azure Monitor, and Service Health.\n\nAsk me any question about these services, or choose one of the prompt chips below!`;
  };

  const handleSendMessage = async (contentToSend?: string) => {
    const text = (contentToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    StorageService.saveChatMessages(newMessages);
    if (!contentToSend) setInput('');
    setIsTyping(true);

    try {
      // Attempt backend Vercel serverless AI call
      const res = await fetch('/api/rafiki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: newMessages.slice(-6),
          questionContext: initialQuestion
            ? {
                stem: initialQuestion.stem,
                options: initialQuestion.options,
                correct: initialQuestion.correct,
                explanation: initialQuestion.explanation,
                outline_skill: initialQuestion.outline_skill,
              }
            : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const rafikiMsg: ChatMessage = {
            id: `rafiki-${Date.now()}`,
            sender: 'rafiki',
            content: data.reply,
            timestamp: new Date().toISOString(),
          };

          const finalMessages = [...newMessages, rafikiMsg];
          setMessages(finalMessages);
          StorageService.saveChatMessages(finalMessages);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Network unreachable or offline - fall through to offline grounded engine
    }

    // Offline grounded engine fallback
    setTimeout(() => {
      const responseText = generateRafikiResponse(text, language);
      const rafikiMsg: ChatMessage = {
        id: `rafiki-${Date.now()}`,
        sender: 'rafiki',
        content: responseText,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, rafikiMsg];
      setMessages(finalMessages);
      StorageService.saveChatMessages(finalMessages);
      setIsTyping(false);
    }, 450);
  };

  // Web Speech API text-to-speech for accessibility
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearChat = () => {
    const resetMsgs: ChatMessage[] = [
      {
        id: 'msg-welcome',
        sender: 'rafiki',
        content: `Habari! I am **Rafiki**, your personal AZ-900 Study Buddy. 🌍\n\nAsk me anything about Microsoft Azure Fundamentals, or choose one of the prompt chips below!`,
        timestamp: new Date().toISOString(),
      },
    ];
    setMessages(resetMsgs);
    StorageService.saveChatMessages(resetMsgs);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto space-y-4">
      {/* Top Banner: Language Selector & Controls */}
      <div className="glass border border-slate-200/90 rounded-3xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-bold text-slate-900">Rafiki AI Study Buddy</h2>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                Grounded
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Contextual AZ-900 tutor with African analogies</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language selector */}
          <div className="flex items-center space-x-1 bg-slate-50/80 border border-slate-200 px-2 py-1 rounded-xl text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="English" className="bg-white text-slate-800">English</option>
              <option value="Kiswahili" className="bg-white text-slate-800">Kiswahili</option>
              <option value="Sheng" className="bg-white text-slate-800">Sheng</option>
              <option value="Nigerian Pidgin" className="bg-white text-slate-800">Nigerian Pidgin</option>
            </select>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-all active:scale-90"
            title="Clear chat history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-200 text-slate-700 border border-slate-300'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10'
                    : 'glass border border-slate-200/90 text-slate-800 rounded-tl-none shadow-sm space-y-2'
                }`}
              >
                <div className="whitespace-pre-line font-normal">
                  {msg.content}
                </div>

                {!isUser && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <span className="text-[10px] text-slate-400">
                      AZ-900 Grounded Tutor
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-blue-700 text-slate-500 transition-colors flex items-center space-x-1"
                        title="Read aloud"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3 h-3 text-blue-600" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                      </button>
                      <button
                        onClick={() => setReportMsgId(msg.id)}
                        className="hover:text-amber-600 text-slate-400 transition-colors p-0.5 active:scale-90"
                        title="Report issue with answer"
                      >
                        <AlertCircle className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="glass border border-slate-200/90 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none text-xs">
        {PRESET_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-3.5 py-1.5 rounded-full glass hover:border-blue-400 hover:bg-blue-50/60 text-slate-700 hover:text-blue-700 text-[11px] whitespace-nowrap transition-all flex items-center space-x-1.5 flex-shrink-0 shadow-sm active:scale-[0.97]"
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask Rafiki in ${language}... (e.g. "What is an Azure region?")`}
          className="w-full glass focus:bg-white border border-slate-200 focus:border-blue-600 rounded-2xl px-4 py-3 pr-12 text-xs text-slate-800 placeholder-slate-400 focus:outline-none shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-md shadow-blue-500/20 disabled:shadow-none active:scale-[0.95]"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Report Modal */}
      {reportMsgId && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportMsgId(null)}
          contentType="rafiki_message"
          contentId={reportMsgId}
        />
      )}
    </div>
  );
};

