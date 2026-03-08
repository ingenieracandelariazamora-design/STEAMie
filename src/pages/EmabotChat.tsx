import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, Volume2, VolumeX, Mic, MicOff, Shield, Lock, MessageSquare, Gamepad2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import emabotMascot from '@/assets/emabot-mascot.png';

interface QuickButton {
  label: string;
  emoji: string;
  message: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  buttons?: QuickButton[];
  typing?: boolean;
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

const QUICK_ACTIONS: QuickButton[] = [
  { label: 'Jugar un juego de seguridad', emoji: '🎮', message: '¡Quiero jugar un juego de seguridad!' },
  { label: '¿Qué es información privada?', emoji: '🔒', message: '¿Qué es la información privada?' },
  { label: '¿Qué hago si alguien me escribe?', emoji: '💬', message: '¿Qué hago si alguien desconocido me escribe?' },
];

const INTRO_SEQUENCE: ChatMessage[] = [
  { role: 'assistant', content: '¡Hola Emma! 👋 Soy Emabot, tu guía digital. Estoy aquí para ayudarte a aprender cómo estar segura en internet.' },
  { role: 'user', content: '¡Hola Emabot! ¿Qué podemos hacer?' },
  { role: 'assistant', content: 'Podemos aprender a proteger tu información y estar seguras en internet. ¡Será muy divertido! 🌟', buttons: QUICK_ACTIONS },
];

const EmabotChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Animated intro sequence
  useEffect(() => {
    if (introStep >= INTRO_SEQUENCE.length) {
      setIntroComplete(true);
      return;
    }

    const delay = introStep === 0 ? 600 : 1200;
    const timer = setTimeout(() => {
      const msg = INTRO_SEQUENCE[introStep];
      setMessages(prev => [...prev, msg]);
      if (msg.role === 'assistant' && ttsEnabled) speak(msg.content);
      setIntroStep(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [introStep, ttsEnabled]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
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

  const sendMessage = async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: msgText };
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
      if (ttsEnabled) speak(reply);
    } catch (e) {
      console.error('Chat error:', e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ups, algo salió mal. Intenta de nuevo. 😅' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5 font-body">
      {/* Header */}
      <header className="relative flex items-center gap-3 px-4 py-3 bg-card/80 backdrop-blur-md border-b border-border shadow-sm z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        <div className="relative h-11 w-11 rounded-full border-2 border-primary/40 overflow-hidden bg-primary/10 flex-shrink-0">
          <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-foreground text-base leading-tight">Emabot</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-secondary" /> Tu guía digital segura
          </p>
        </div>

        {/* Floating holographic icons */}
        <div className="flex items-center gap-2 mr-1">
          <Lock className="h-4 w-4 text-primary/50 animate-float" style={{ animationDelay: '0s' }} />
          <Shield className="h-4 w-4 text-accent/50 animate-float" style={{ animationDelay: '0.4s' }} />
          <MessageSquare className="h-4 w-4 text-teal/50 animate-float" style={{ animationDelay: '0.8s' }} />
        </div>

        <button
          onClick={() => { setTtsEnabled(!ttsEnabled); if (ttsEnabled) speechSynthesis.cancel(); }}
          className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
          title={ttsEnabled ? 'Silenciar voz' : 'Activar voz'}
        >
          {ttsEnabled ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
        </button>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-2 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/30 mt-1 shadow-md">
                  <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
                </div>
              )}

              <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <span className="text-[10px] font-medium text-muted-foreground px-1">
                  {msg.role === 'assistant' ? 'Emabot' : 'Emma'}
                </span>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card border border-border/80 text-foreground rounded-bl-md'
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
              </div>

              {msg.role === 'user' && (
                <div className="h-9 w-9 rounded-full flex-shrink-0 mt-1 bg-secondary/30 border-2 border-secondary/50 flex items-center justify-center shadow-md">
                  <span className="text-sm">👧</span>
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            {msg.role === 'assistant' && msg.buttons && introComplete && !loading && (
              <div className="pl-12 pr-4 flex flex-col gap-2 pt-1">
                {msg.buttons.map((btn, j) => (
                  <button
                    key={j}
                    onClick={() => sendMessage(btn.message)}
                    className="group flex items-center gap-3 rounded-2xl border-2 border-primary/20 bg-card px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-primary/10 hover:border-primary/40 hover:shadow-md transition-all active:scale-[0.97] shadow-sm"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{btn.emoji}</span>
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2.5 justify-start animate-slide-up">
            <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/30 shadow-md">
              <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
            </div>
            <div className="bg-card border border-border/80 rounded-2xl rounded-bl-md px-5 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2.5 w-2.5 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2.5 w-2.5 rounded-full bg-secondary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-card/90 backdrop-blur-md p-3 safe-area-bottom">
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2 max-w-lg mx-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            disabled={loading || !introComplete}
          />
          {SpeechRecognition && (
            <Button
              type="button"
              size="icon"
              variant={listening ? 'destructive' : 'outline'}
              onClick={listening ? stopListening : startListening}
              className="rounded-2xl h-11 w-11 flex-shrink-0"
              disabled={loading || !introComplete}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || loading || !introComplete}
            className="rounded-2xl h-11 w-11 flex-shrink-0 bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmabotChat;
