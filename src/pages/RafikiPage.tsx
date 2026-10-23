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
  Copy,
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { RafikiEngine } from '../lib/rafiki-engine';
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
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [reportMsgId, setReportMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const initialHandledRef = useRef(false);

  // Handle incoming initial question prompt immediately
  useEffect(() => {
    if (initialQuestion && !initialHandledRef.current) {
      initialHandledRef.current = true;
      const qPrompt = `Please explain this AZ-900 exam question and why the right answer is correct:\n\n"${initialQuestion.stem}"\n\nOptions:\n${initialQuestion.options.map((o, i) => `${i + 1}. ${o}`).join('\n')}`;
      handleSendMessage(qPrompt);
    }
  }, [initialQuestion]);

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

    // Give immediate, grounded responses first (120-200ms natural conversational feel)
    // Avoids long loading spinners, network timeouts, or cold-boot serverless delays
    const typingDelay = initialQuestion ? 120 : 200;

    setTimeout(() => {
      const contextData = initialQuestion
        ? {
            stem: initialQuestion.stem,
            options: initialQuestion.options,
            correct: initialQuestion.correct,
            explanation: initialQuestion.explanation,
            outline_skill: initialQuestion.outline_skill,
            wrong_option_notes: initialQuestion.wrong_option_notes,
          }
        : undefined;

      const responseText = RafikiEngine.generateResponse(text, language, contextData);

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
    }, typingDelay);
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

  // Copy message to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
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

  // Safe and clean markdown rendering for chat messages
  const renderFormattedMessage = (content: string) => {
    const isOutOfScopeAlert = content.includes('Information Outside AZ-900 Scope');

    return (
      <div
        className={`space-y-2 text-xs leading-relaxed ${
          isOutOfScopeAlert
            ? 'p-3 rounded-xl bg-amber-500/10 border border-amber-500/30'
            : ''
        }`}
      >
        {content.split('\n\n').map((block, bIdx) => {
          // Bullet list block
          if (
            block.includes('\n- ') ||
            block.startsWith('- ') ||
            block.includes('\n* ') ||
            block.startsWith('* ')
          ) {
            const lines = block.split('\n');
            return (
              <div key={bIdx} className="space-y-1 my-1.5">
                {lines.map((line, lIdx) => {
                  if (line.startsWith('- ') || line.startsWith('* ')) {
                    const itemText = line.slice(2);
                    return (
                      <div key={lIdx} className="flex items-start space-x-2 pl-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        <span
                          className="flex-1"
                          dangerouslySetInnerHTML={{
                            __html: itemText.replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>'
                            ),
                          }}
                        />
                      </div>
                    );
                  }
                  return (
                    <p
                      key={lIdx}
                      className="font-semibold text-slate-800 dark:text-slate-200"
                      dangerouslySetInnerHTML={{
                        __html: line.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>'
                        ),
                      }}
                    />
                  );
                })}
              </div>
            );
          }

          // Regular paragraph with bolding
          return (
            <p
              key={bIdx}
              dangerouslySetInnerHTML={{
                __html: block.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>'
                ),
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-130px)] sm:h-[calc(100vh-140px)] max-w-3xl mx-auto space-y-3 sm:space-y-4">
      {/* Top Banner: Language Selector & Controls */}
      <div className="glass border border-slate-200/90 dark:border-slate-800 rounded-3xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Rafiki AI Study Buddy</h2>
              <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                AZ-900
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">Contextual Azure tutor with African analogies</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language selector */}
          <div className="flex items-center space-x-1 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-xl text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="English" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">English</option>
              <option value="Kiswahili" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Kiswahili</option>
              <option value="Sheng" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Sheng</option>
              <option value="Nigerian Pidgin" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Nigerian Pidgin</option>
            </select>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-all active:scale-90"
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
          const isCopied = copiedMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
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
                    : 'glass border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm space-y-2'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-line font-normal">{msg.content}</div>
                ) : (
                  renderFormattedMessage(msg.content)
                )}

                {!isUser && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    <span className="text-[10px] text-slate-400">
                      AZ-900 Grounded Tutor
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-blue-600 dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 transition-colors flex items-center space-x-1"
                        title="Copy answer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-blue-700 dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 transition-colors flex items-center space-x-1"
                        title="Read aloud"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3 h-3 text-blue-600 dark:text-blue-400" />
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
            <div className="glass border border-slate-200/90 dark:border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none text-xs -mx-1 px-1 touch-pan-x overscroll-contain">
        {PRESET_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-3.5 py-1.5 rounded-full glass hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 text-[11px] whitespace-nowrap transition-all flex items-center space-x-1.5 flex-shrink-0 shadow-sm active:scale-[0.97]"
          >
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
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
          className="w-full glass focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-2xl px-4 py-3 pr-12 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-sm transition-all"
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
