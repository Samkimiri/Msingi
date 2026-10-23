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

  // Offline grounded answering engine with African analogies and language localization
  const generateRafikiResponse = (userText: string, currentLang: SupportedLanguage): string => {
    const text = userText.toLowerCase();

    // Language prefix greetings
    let greeting = '';
    if (currentLang === 'Kiswahili') {
      greeting = 'Jambo rafiki! Hili hapa jibu lako rahisi:\n\n';
    } else if (currentLang === 'Sheng') {
      greeting = 'Niaje msee! Cheki hii explanation fiti kabisa:\n\n';
    } else if (currentLang === 'Nigerian Pidgin') {
      greeting = 'How far my person! Make I break am down for you sharp sharp:\n\n';
    }

    // 1. CapEx vs OpEx
    if (text.includes('capex') || text.includes('opex') || text.includes('capital expenditure') || text.includes('operating expenditure') || text.includes('market stall')) {
      if (currentLang === 'Kiswahili') {
        return `${greeting}**CapEx (Capital Expenditure)** ni kama kununua jenereta kubwa ya petroli kwa pesa taslimu ili upate umeme dukani kwako—gharama kubwa upfront, na mashine inachakaa.\n\n**OpEx (Operating Expenditure)** ni kulipia tokeni za umeme za KPLC au Shirika la Umeme kila mwezi kulingana na units unazotumia tu.\n\nKatika Azure na Cloud, unabadilisha CapEx kuwa OpEx: hakuna kununua seva za mamilioni, unalipia tu kile unachotumia (Pay-as-you-go).`;
      }
      if (currentLang === 'Nigerian Pidgin') {
        return `${greeting}**CapEx (Capital Expenditure)** na like say you go buy big generator with plenty money upfront to power your shop in Alaba Market. Na you go still buy diesel and maintain the machine when e spoil.\n\n**OpEx (Operating Expenditure)** na like say you dey buy prepaid NEPA units only for the light wey you burn that day. In Azure Cloud, you dey drop heavy upfront CapEx cost to enjoy flexible OpEx (pay-as-you-go).`;
      }
      if (currentLang === 'Sheng') {
        return `${greeting}**CapEx** ni kununua generator ya luku na doh mob cash uweke kwa base yako. Doh inaisha yote pap!\n\n**OpEx** ni kununua tokeni za stima za bob 200 kwa simu kulingana na venye unawasha taa. Kwa Azure, CapEx inatupwa nje unaingia life ya OpEx: pay-as-you-go bila stress ya hardware!`;
      }
      return `${greeting}**CapEx vs OpEx Analogy**:\n\n- **CapEx (Capital Expenditure)**: Buying a costly petrol generator upfront with heavy cash reserves. You take on maintenance, depreciation, and hardware replacement risk.\n- **OpEx (Operating Expenditure)**: Paying monthly prepaid electricity tokens for exactly what you consume. No upfront datacenter hardware purchases.\n\n**AZ-900 Exam Takeaway**: Cloud computing shifts IT spending from CapEx to OpEx with zero upfront infrastructure cost and a consumption-based pricing model.`;
    }

    // 2. Shared Responsibility Model
    if (text.includes('shared responsibility') || text.includes('kenya') || text.includes('nigeria') || text.includes('landlord')) {
      if (currentLang === 'Nigerian Pidgin') {
        return `${greeting}**Shared Responsibility Model** na like when you rent shop for Computer Village, Ikeja.\n\nThe landlord dey responsible for the physical building, security gate, and roof (Datacenter, Power, Physical Servers).\n\n**YOU** dey 100% responsible for locking your shop door, keeping your money in safe, and managing who enter your store (Data, Identities, and Access control).\n\nEven if you dey IaaS, PaaS, or SaaS, your customer data and account passwords na always your own responsibility!`;
      }
      return `${greeting}**Shared Responsibility Model Analogy**:\n\nImagine renting an apartment in Nairobi or an office in Victoria Island:\n\n- **The Landlord (Microsoft/Azure)** is responsible for the building foundation, concrete walls, security perimeter, and power generators (Datacenter physical security and hardware).\n- **You (The Customer)** are ALWAYS responsible for locking your front door, protecting your personal files, and giving keys only to trusted family (Your Data, Identities, and User Access).\n\n**AZ-900 Exam Rule**: Regardless of cloud model (IaaS, PaaS, SaaS), the customer **ALWAYS** retains responsibility for **Information and Data**, **Devices (Mobile/PC)**, and **Accounts & Identities**.`;
    }

    // 3. Availability Zones & Regions
    if (text.includes('availability zone') || text.includes('region') || text.includes('matatu') || text.includes('danfo')) {
      return `${greeting}**Azure Regions & Availability Zones**:\n\n- **Region**: A geographical area containing one or more datacenters connected via dedicated low-latency fiber (e.g. South Africa North in Johannesburg).\n- **Availability Zones (AZs)**: Physically separate datacenters within the SAME region. Each zone has independent power, cooling, and networking.\n\n**The Danfo / Matatu Analogy**:\nIf a logistics company puts all its goods inside one single matatu or danfo, a tire blowout halts all deliveries. But if goods are split across three separate vans taking different routes across the city, your delivery operation never stops if one breaks down!\n\n**AZ-900 Tip**: Availability Zones protect your workloads against entire datacenter-level power or cooling outages.`;
    }

    // 4. Azure Policy vs RBAC
    if (text.includes('policy') || text.includes('rbac') || text.includes('role-based')) {
      return `${greeting}**Azure Policy vs Role-Based Access Control (RBAC)**:\n\n- **RBAC (Role-Based Access Control)** focuses on **WHO**: Can Amina create virtual machines? Can Kwame delete the database?\n- **Azure Policy** focuses on **WHAT PROPERTIES**: When any authorized user creates a resource, does it meet company rules? (e.g. "Only deploy in South Africa North", "Require a tag for Project SACCO").\n\n**Analogy**: RBAC is the club bouncer checking your ID at the gate (authorization). Azure Policy is the dress code inside: even VIP guests with full access cannot enter wearing muddy flip-flops!`;
    }

    // 5. IaaS vs PaaS vs SaaS
    if (text.includes('iaas') || text.includes('paas') || text.includes('saas') || text.includes('street food')) {
      return `${greeting}**IaaS vs PaaS vs SaaS (The Food Analogy)**:\n\n1. **IaaS (Infrastructure as a Service)**: Buying raw beef, charcoal, and salt to roast your own nyama choma / suya. You have full control over the fire and spices, but you do all the work.\n2. **PaaS (Platform as a Service)**: Going to a butchery where the chef lights the grill and handles the heat, and you just bring your marinated recipe to cook. (e.g. Azure App Service).\n3. **SaaS (Software as a Service)**: Sitting down at a restaurant where food is cooked, plated, and served directly to you. You just eat! (e.g. Microsoft 365).`;
    }

    // 6. Azure Blob Storage Tiering
    if (text.includes('blob') || text.includes('tier') || text.includes('storage') || text.includes('hot') || text.includes('cool') || text.includes('archive')) {
      return `${greeting}**Azure Blob Storage Access Tiers**:\n\n- **Hot Tier**: High storage cost, lowest access cost. For data accessed frequently (e.g. active daily web photos).\n- **Cool Tier**: Lower storage cost, higher access fee. For data stored for at least 30 days (e.g. monthly billing invoices).\n- **Cold Tier**: Even lower storage cost, higher access fee. Stored for at least 90 days.\n- **Archive Tier**: Lowest storage cost, highest access fee. For data stored for at least 180 days with hours of retrieval latency (e.g. legal records).\n\n**Analogy**: Hot tier is the cash in your pocket ready to spend right now. Cool tier is money in your bank account. Archive tier is a plot of land inherited upcountry: virtually zero daily cost to hold, but takes hours or days to liquidate when you need it!`;
    }

    // Fallback: search syllabus for closest topic
    const matchedTopic = TOPICS.find(t =>
      t.title.toLowerCase().includes(text) ||
      t.slug.toLowerCase().includes(text) ||
      text.includes(t.title.toLowerCase().split(' ')[0])
    );

    if (matchedTopic) {
      const relatedCard = SEED_FLASHCARDS.find(c => c.topic_id === matchedTopic.id);
      return `${greeting}**${matchedTopic.title}** (${matchedTopic.outline_skill}):\n\n${relatedCard?.back || 'Foundational Azure concept tested on the AZ-900 exam.'}\n\n${relatedCard?.african_analogy ? `**Analogy**: "${relatedCard.african_analogy}"\n\n` : ''}For the exam, make sure you understand the official Microsoft definition and how it compares to alternative services.`;
    }

    // General friendly fallback
    return `${greeting}That's a great question on Microsoft Azure Fundamentals!\n\nIn AZ-900, remember the 3 core pillars:\n1. **Cloud Concepts (25-30%)**: Benefits (scalability, elasticity, agility, HA, disaster recovery), CapEx vs OpEx, and cloud service types (IaaS, PaaS, SaaS).\n2. **Architecture & Services (35-40%)**: Regions, Availability Zones, Subscriptions, Resource Groups, Compute (VMs, Containers, Functions), Storage (Blob, Disk, Files), and Networking (VNet, VPN, ExpressRoute).\n3. **Management & Governance (30-35%)**: Azure Policy, RBAC, Locks, Cost Management, Microsoft Defender for Cloud, and Azure Monitor.\n\nAsk me about any specific Azure service or scenario!`;
  };

  const handleSendMessage = (contentToSend?: string) => {
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

    // Realistic typing delay for natural interaction
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
    }, 700);
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
      <div className="bg-surface border border-surface-border rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sunset-500 to-amber-500 flex items-center justify-center text-white shadow-glow-orange">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-bold text-white">Rafiki AI Study Buddy</h2>
              <span className="text-[10px] font-semibold bg-sunset-500/20 text-sunset-400 px-1.5 py-0.2 rounded border border-sunset-500/30">
                Grounded
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Contextual AZ-900 tutor with African analogies</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language selector */}
          <div className="flex items-center space-x-1 bg-surface-light border border-surface-border px-2 py-1 rounded-xl text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="English" className="bg-surface text-slate-200">English</option>
              <option value="Kiswahili" className="bg-surface text-slate-200">Kiswahili</option>
              <option value="Sheng" className="bg-surface text-slate-200">Sheng</option>
              <option value="Nigerian Pidgin" className="bg-surface text-slate-200">Nigerian Pidgin</option>
            </select>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-light"
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
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-gradient-to-br from-sunset-500 to-amber-600 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-sunset-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-surface border border-surface-border text-slate-200 rounded-tl-none shadow-sm space-y-2'
                }`}
              >
                <div className="whitespace-pre-line font-normal">
                  {msg.content}
                </div>

                {!isUser && (
                  <div className="flex items-center justify-between pt-2 border-t border-surface-border/60 text-[10px] text-slate-400">
                    <span className="text-[10px] text-slate-500">
                      AZ-900 Grounded Tutor
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-sunset-400 transition-colors flex items-center space-x-1"
                        title="Read aloud"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3 h-3 text-sunset-400" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                      </button>
                      <button
                        onClick={() => setReportMsgId(msg.id)}
                        className="hover:text-amber-400 transition-colors p-0.5"
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
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sunset-500 to-amber-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-surface border border-surface-border rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sunset-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-sunset-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-sunset-400 animate-bounce [animation-delay:0.4s]" />
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
            className="px-3 py-1.5 rounded-full bg-surface border border-surface-border hover:border-sunset-500/50 hover:bg-surface-light text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-all flex items-center space-x-1 flex-shrink-0 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-sunset-400" />
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
          className="w-full bg-surface border border-surface-border focus:border-sunset-500 rounded-2xl px-4 py-3 pr-12 text-xs text-white placeholder-slate-500 focus:outline-none shadow-lg transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 p-2 rounded-xl bg-sunset-600 hover:bg-sunset-500 disabled:opacity-40 text-white transition-all shadow-glow-orange disabled:shadow-none"
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
