'use client';

/**
 * Wave AI — Frequency Wave's ElevenLabs conversational concierge.
 * Compact landing (no FAQ scroll, no gradient chrome); chat still scrolls.
 * Connects through a signed URL minted server-side so the API key never
 * reaches the browser.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const PUBLIC_AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

interface Message {
  role: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

type ConversationSession = {
  endSession: () => Promise<void>;
  sendUserMessage: (text: string) => void;
  sendContextualUpdate?: (text: string) => void;
};

type SessionConfig = { signedUrl: string } | { agentId: string };

type WidgetState = 'closed' | 'landing' | 'chat';
type InputMode = 'text' | 'voice';

const FAQS = [
  'When is the next event?',
  'What is Frequency Wave?',
  'How do I get an invite?',
  'How can I sponsor an event?',
  'Can I perform or speak at an event?',
];

function cleanAgentTranscript(text: string) {
  return text
    .replace(/^\s*(\[[a-z][a-z\s_-]{1,32}\]\s*)+/gi, '')
    .replace(/\s+\[[a-z][a-z\s_-]{1,32}\](?=\s|$)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export default function AiConcierge() {
  const pathname = usePathname();
  const [state, setState] = useState<WidgetState>('closed');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<ConversationSession | null>(null);
  const visitorIdRef = useRef<string>('');
  const externalIdRef = useRef<string | null>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const ensureVisitorId = useCallback(() => {
    if (!visitorIdRef.current) {
      visitorIdRef.current =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `widget-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    return visitorIdRef.current;
  }, []);

  // Nudge tooltip after the visitor scrolls 30% down
  useEffect(() => {
    if (tooltipDismissed || state !== 'closed') return;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.3) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 6000);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [tooltipDismissed, state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const persistConversation = useCallback(
    async (status: 'active' | 'ended', snapshot: Message[]) => {
      if (!visitorIdRef.current || snapshot.length === 0) return;
      try {
        await fetch('/api/ai/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: visitorIdRef.current,
            externalId: externalIdRef.current,
            mode: inputMode,
            status,
            messages: snapshot.map((m) => ({
              role: m.role,
              text: m.text,
              timestamp: m.timestamp.toISOString(),
            })),
          }),
        });
      } catch {
        // transcript persistence is best-effort
      }
    },
    [inputMode],
  );

  useEffect(() => {
    if (state !== 'chat' || messages.length === 0) return;
    const t = window.setTimeout(() => {
      persistConversation('active', messagesRef.current);
    }, 600);
    return () => window.clearTimeout(t);
  }, [state, messages, persistConversation]);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (
        last &&
        last.role === message.role &&
        last.text === message.text &&
        message.timestamp.getTime() - last.timestamp.getTime() < 3000
      ) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  const getSessionConfig = useCallback(async (): Promise<SessionConfig> => {
    try {
      const res = await fetch('/api/elevenlabs/signed-url');
      if (res.ok) {
        const data = await res.json();
        if (typeof data.signedUrl === 'string' && data.signedUrl) {
          return { signedUrl: data.signedUrl };
        }
      }
    } catch {
      // fall through to the public agent id
    }
    if (!PUBLIC_AGENT_ID) throw new Error('ElevenLabs is not configured');
    return { agentId: PUBLIC_AGENT_ID };
  }, []);

  const connect = useCallback(
    async (mode: InputMode) => {
      if (conversationRef.current) return true;
      try {
        setIsLoading(true);
        ensureVisitorId();
        const { Conversation } = await import('@elevenlabs/client');
        const sessionConfig = await getSessionConfig();

        const conversation = await Conversation.startSession({
          ...sessionConfig,
          connectionType: 'websocket',
          textOnly: mode === 'text',
          userId: visitorIdRef.current,
          dynamicVariables: {
            input_mode: mode,
            page: window.location.pathname,
          },
          onModeChange: ({ mode: m }: { mode: string }) => {
            setIsListening(m === 'listening');
            setIsSpeaking(m === 'speaking');
          },
          onMessage: (props: { message: string; source: string }) => {
            const text =
              props.source === 'ai'
                ? cleanAgentTranscript(props.message)
                : props.message.trim();
            if (!text) return;
            appendMessage({
              role: props.source === 'user' ? 'user' : 'agent',
              text,
              timestamp: new Date(),
            });
            if (props.source === 'ai') setIsTyping(false);
          },
          onConnect: ({ conversationId }: { conversationId?: string }) => {
            if (conversationId) externalIdRef.current = conversationId;
            setIsConnected(true);
            setIsLoading(false);
          },
          onDisconnect: () => {
            setIsConnected(false);
            setIsListening(false);
            setIsSpeaking(false);
            setIsTyping(false);
          },
          onError: () => {
            setIsLoading(false);
            setIsTyping(false);
          },
        } as Parameters<typeof Conversation.startSession>[0]);

        conversationRef.current = conversation as ConversationSession;
        return true;
      } catch {
        setIsLoading(false);
        setIsConnected(false);
        setIsTyping(false);
        appendMessage({
          role: 'agent',
          text: "I'm not live just yet — the team is plugging me in. Meanwhile, drop your question in the contact form below or email frequencywave101@gmail.com.",
          timestamp: new Date(),
        });
        return false;
      }
    },
    [appendMessage, ensureVisitorId, getSessionConfig],
  );

  const startConversation = useCallback(
    async (mode: InputMode, initialMessage?: string) => {
      const ok = await connect(mode);
      if (initialMessage && ok && conversationRef.current) {
        appendMessage({
          role: 'user',
          text: initialMessage,
          timestamp: new Date(),
        });
        setIsTyping(true);
        conversationRef.current.sendUserMessage(initialMessage);
      }
    },
    [appendMessage, connect],
  );

  const endConversation = useCallback(async () => {
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
      } catch {
        // already closed
      }
      conversationRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  const handleStartChat = async (mode: InputMode, faqText?: string) => {
    ensureVisitorId();
    setInputMode(mode);
    setState('chat');
    await startConversation(mode, faqText);
    if (mode === 'text') setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleClose = () => {
    persistConversation('ended', messagesRef.current);
    endConversation();
    setState('closed');
    setMessages([]);
    setInputText('');
    visitorIdRef.current = '';
    externalIdRef.current = null;
  };

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;
    const text = inputText.trim();
    setInputText('');
    if (conversationRef.current) {
      appendMessage({ role: 'user', text, timestamp: new Date() });
      setIsTyping(true);
      conversationRef.current.sendUserMessage(text);
    } else {
      startConversation(inputMode, text);
    }
  };

  const toggleVoice = async () => {
    const next: InputMode = inputMode === 'voice' ? 'text' : 'voice';
    await endConversation();
    setInputMode(next);
    const ok = await connect(next);
    if (ok && next === 'text') setTimeout(() => inputRef.current?.focus(), 100);
    if (!ok && next === 'voice') {
      setInputMode('text');
      await connect('text');
    }
  };

  if (pathname?.startsWith('/admin')) return null;

  const statusLabel = isLoading
    ? 'Connecting…'
    : isListening
      ? 'Listening…'
      : isSpeaking
        ? 'Speaking…'
        : isConnected
          ? 'Online'
          : 'Event guide';

  return (
    <>
      {/* Floating trigger */}
      {state === 'closed' && (
        <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-[70] flex items-end gap-3">
          {showTooltip && (
            <div className="relative hidden max-w-[210px] rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-md sm:block">
              <button
                onClick={() => {
                  setShowTooltip(false);
                  setTooltipDismissed(true);
                }}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[#040B24]/80 text-[10px] text-white/50 backdrop-blur-md hover:text-white"
                aria-label="Dismiss"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-2.5 w-2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
              <p className="mb-1 text-xs font-semibold text-white">
                Questions about our events?
              </p>
              <p className="text-[10px] leading-relaxed text-white/50">
                Talk to Abby about dates, invites, sponsorship & more.
              </p>
              <div className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t border-white/15 bg-white/[0.08]" />
            </div>
          )}

          <button
            onClick={() => {
              setShowTooltip(false);
              setTooltipDismissed(true);
              setState('landing');
            }}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#040B24]/90 text-2xl backdrop-blur-md transition-transform hover:scale-110"
            aria-label="Chat with Abby"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6 text-white" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 13a8 8 0 1 1 16 0m-16 0v3a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H5m15 2v3a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2" /></svg>
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#040B24] bg-white" />
          </button>
        </div>
      )}

      {/* Panel */}
      {state !== 'closed' && (
        <div
          className={`fixed inset-x-3 bottom-3 z-[70] flex w-auto flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[#040B24]/92 shadow-2xl shadow-black/50 backdrop-blur-md sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[380px] sm:rounded-[40px] ${
            state === 'chat'
              ? 'h-[min(520px,calc(100dvh-1.5rem))]'
              : ''
          }`}
        >
          {/* Header */}
          <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 text-white" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 13a8 8 0 1 1 16 0m-16 0v3a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H5m15 2v3a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2" /></svg>
                  </div>
                  {isConnected && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#040B24] bg-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold italic leading-none text-white sm:text-lg">
                    Abby
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/45">
                    {statusLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Landing */}
          {state === 'landing' && (
            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs leading-relaxed text-white/50">
                Ask about events, invites, sponsorship, and performing.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStartChat('text')}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 text-white/80" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75H12m9 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  <span className="text-[11px] font-semibold text-white">
                    Start with Text
                  </span>
                </button>
                <button
                  onClick={() => handleStartChat('voice')}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 text-white/80" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3z" /></svg>
                  <span className="text-[11px] font-semibold text-white">
                    Start with Voice
                  </span>
                </button>
              </div>

              <p className="mb-2 mt-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
                Frequently Asked
              </p>
              <div className="space-y-1.5">
                {FAQS.map((faq) => (
                  <button
                    key={faq}
                    onClick={() => handleStartChat('text', faq)}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-left text-xs text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <span className="pr-2">{faq}</span>
                    <span className="shrink-0 text-white/35">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          {state === 'chat' && (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 && !isLoading && (
                  <p className="py-8 text-center text-xs text-white/30">
                    {inputMode === 'voice'
                      ? 'Speak to start…'
                      : 'Type a message to begin…'}
                  </p>
                )}

                {isLoading && messages.length === 0 && (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan [animation-delay:300ms]" />
                    <span className="text-xs text-white/40">Connecting…</span>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'agent' && (
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3.5 w-3.5 text-white" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 13a8 8 0 1 1 16 0m-16 0v3a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H5m15 2v3a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2" /></svg>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-md border border-blue/30 bg-blue/20 text-white'
                          : 'rounded-bl-md border border-white/[0.06] bg-white/[0.04] text-white/80'
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`mt-1.5 font-mono text-[9px] ${msg.role === 'user' ? 'text-cyan/50' : 'text-white/25'}`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan/70" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan/70 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan/70 [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Voice indicator */}
              {inputMode === 'voice' && (isListening || isSpeaking) && (
                <div className="border-t border-white/[0.04] px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2, 3, 4].map((bar) => (
                        <span
                          key={bar}
                          className={`w-1 rounded-full ${isListening ? 'bg-cyan' : 'bg-violet'} animate-pulse`}
                          style={{
                            height: `${8 + ((bar * 7) % 12)}px`,
                            animationDelay: `${bar * 120}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {isListening ? 'Listening…' : 'Speaking…'}
                    </span>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleVoice}
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                      inputMode === 'voice'
                        ? 'border-cyan/40 bg-cyan/15 text-cyan'
                        : 'border-white/15 text-white/40 hover:border-cyan/30 hover:text-cyan'
                    }`}
                    title={
                      inputMode === 'voice'
                        ? 'Switch to text'
                        : 'Switch to voice'
                    }
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3z" /></svg>
                  </button>
                  <div className="flex min-w-0 flex-1 items-center rounded-full border border-white/15 bg-white/[0.06] transition-colors focus-within:border-cyan/40">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={
                        inputMode === 'voice'
                          ? 'Or type a message…'
                          : 'Type a message…'
                      }
                      className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white outline-none placeholder:text-white/25"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim() || isTyping}
                      className="px-4 py-2.5 text-white/40 transition-colors hover:text-cyan disabled:opacity-30"
                      aria-label="Send"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.27 3.126A59.77 59.77 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L6 12zm0 0h7.5" /></svg>
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-center text-[9px] text-white/20">
                  Abby · Frequency Wave AI
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
