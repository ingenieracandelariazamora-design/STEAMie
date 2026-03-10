import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Volume2, VolumeX, Mic, MicOff, Shield, Lock, MessageSquare, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useGame } from '@/contexts/GameContext';
import ReactMarkdown from 'react-markdown';
import emabotMascot from '@/assets/emabot-mascot.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  buttons?: QuickButton[];
}

interface QuickButton {
  label: string;
  emoji: string;
  message: string;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  utterance.pitch = 1.2;
  speechSynthesis.speak(utterance);
};

const getGreeting = (name?: string) => {
  const displayName = name || 'amiga';
  return `¡Hola ${displayName}! 👋 Soy Emabot, tu guía digital. Estoy aquí para ayudarte a aprender cómo estar segura en internet. ¿Qué te gustaría hacer hoy?`;
};

const INITIAL_BUTTONS: QuickButton[] = [
  { label: 'Jugar un juego de seguridad', emoji: '🎮', message: '¡Quiero jugar un juego de seguridad!' },
  { label: 'Información privada', emoji: '🔒', message: '¿Qué es la información privada?' },
  { label: 'Si alguien me escribe', emoji: '💬', message: '¿Qué hago si alguien desconocido me escribe?' },
];

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING, buttons: INITIAL_BUTTONS },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listen for highlight event from Dashboard
  useEffect(() => {
    const handler = () => {
      setHighlighted(true);
      setTimeout(() => setHighlighted(false), 4000);
    };
    window.addEventListener('highlight-emabot-bubble', handler);
    return () => window.removeEventListener('highlight-emabot-bubble', handler);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const texto = event.results[0][0].transcript;
      setInput(texto);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewAssistantMessage = useCallback((text: string) => {
    if (ttsEnabled) speak(text);
  }, [ttsEnabled]);

  const sendMessage = async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;

    const userMsg: Message = { role: 'user', content: msgText };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-safety-chat', {
        body: { messages: allMessages.map(m => ({ role: m.role, content: m.content })) },
      });

      if (error) throw error;

      const reply = data?.reply || 'No pude responder. Intenta de nuevo. 😊';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      handleNewAssistantMessage(reply);
    } catch (e) {
      console.error('Chat error:', e);
      const errMsg = 'Ups, algo salió mal. Intenta de nuevo. 😅';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickButton = (btn: QuickButton) => {
    sendMessage(btn.message);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`fixed bottom-20 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-all overflow-hidden border-2 border-primary-foreground/20 ${
            highlighted
              ? 'scale-125 ring-4 ring-primary/50 ring-offset-2 ring-offset-background animate-wiggle'
              : 'hover:scale-110 animate-pulse-glow'
          }`}
        >
          <img src={emabotMascot} alt="Emabot" className="h-12 w-12 object-cover rounded-full" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-2 left-2 z-50 mx-auto max-w-sm animate-slide-up">
          <div className="flex flex-col rounded-3xl border-2 border-primary/30 bg-card shadow-2xl overflow-hidden" style={{ height: '480px' }}>
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/20 px-4 py-3">
              {/* Holographic icons */}
              <div className="absolute top-1 right-16 flex gap-1.5 opacity-40">
                <Lock className="h-3 w-3 text-primary animate-float" style={{ animationDelay: '0s' }} />
                <Shield className="h-3 w-3 text-accent animate-float" style={{ animationDelay: '0.3s' }} />
                <MessageSquare className="h-3 w-3 text-teal animate-float" style={{ animationDelay: '0.6s' }} />
              </div>

              <div className="relative h-10 w-10 rounded-full border-2 border-primary/40 overflow-hidden bg-primary/10 flex-shrink-0">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-display font-bold text-foreground text-sm block">Emabot</span>
                <span className="text-xs text-muted-foreground">Tu guía digital 🌟</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setTtsEnabled(!ttsEnabled); if (ttsEnabled) speechSynthesis.cancel(); }}
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                  title={ttsEnabled ? 'Silenciar voz' : 'Activar voz'}
                >
                  {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => { setOpen(false); speechSynthesis.cancel(); }}
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-background to-muted/20">
              {messages.map((msg, i) => (
                <div key={i} className="space-y-2">
                  <div className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="h-7 w-7 rounded-full overflow-hidden flex-shrink-0 border border-primary/30 mt-1">
                        <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md shadow-md'
                          : 'bg-card border border-border rounded-bl-md shadow-sm'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none text-foreground [&>p]:m-0">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => speak(msg.content)}
                        className="self-end text-muted-foreground hover:text-primary p-1 transition-colors"
                        title="Escuchar"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Quick action buttons */}
                  {msg.role === 'assistant' && msg.buttons && !loading && (
                    <div className="pl-9 flex flex-col gap-1.5">
                      {msg.buttons.map((btn, j) => (
                        <button
                          key={j}
                          onClick={() => handleQuickButton(btn)}
                          className="flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-primary/5 px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all active:scale-95"
                        >
                          <span className="text-base">{btn.emoji}</span>
                          <span>{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="h-7 w-7 rounded-full overflow-hidden flex-shrink-0 border border-primary/30">
                    <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card/80 backdrop-blur-sm p-2.5">
              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  disabled={loading}
                />
                {SpeechRecognition && (
                  <Button
                    type="button"
                    size="sm"
                    variant={listening ? 'destructive' : 'outline'}
                    onClick={listening ? stopListening : startListening}
                    className="rounded-xl h-10 w-10 p-0"
                    disabled={loading}
                  >
                    {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || loading}
                  className="rounded-xl h-10 w-10 p-0 bg-primary text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
