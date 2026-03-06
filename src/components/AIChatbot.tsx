import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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

const GREETING = '¡Hola! 🤖💖 Soy Emabot, tu amiga robot. Te voy a enseñar cómo estar seguro en internet. ¿Estás listo para aprender conmigo?';

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
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

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-110 animate-pulse-glow"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 right-2 left-2 z-50 mx-auto max-w-sm animate-slide-up">
          <div className="flex flex-col rounded-2xl border-2 border-border bg-card shadow-2xl overflow-hidden" style={{ height: '420px' }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-primary/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖💖</span>
                <span className="font-display font-bold text-foreground text-sm">Emabot</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setTtsEnabled(!ttsEnabled); if (ttsEnabled) speechSynthesis.cancel(); }}
                  className="text-muted-foreground hover:text-foreground p-1"
                  title={ttsEnabled ? 'Silenciar voz' : 'Activar voz'}
                >
                  {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button onClick={() => { setOpen(false); speechSynthesis.cancel(); }} className="text-muted-foreground hover:text-foreground p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speak(msg.content)}
                      className="ml-1 self-end text-muted-foreground hover:text-foreground p-1"
                      title="Escuchar"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-2xl rounded-bl-md px-3 py-2 text-sm">
                    Pensando... 🤔
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-2">
              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Escribe o habla..."
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={loading}
                />
                {SpeechRecognition && (
                  <Button
                    type="button"
                    size="sm"
                    variant={listening ? 'destructive' : 'outline'}
                    onClick={listening ? stopListening : startListening}
                    className="rounded-xl"
                    disabled={loading}
                  >
                    {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Button type="submit" size="sm" disabled={!input.trim() || loading} className="rounded-xl bg-primary text-primary-foreground">
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
