import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! 👋 Soy tu asistente de seguridad digital. Puedes preguntarme lo que quieras sobre cómo estar seguro en internet. ¿En qué te puedo ayudar?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

      const reply = data?.reply || 'Lo siento, no pude responder. Intenta de nuevo.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      console.error('Chat error:', e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ups, hubo un error. Intenta de nuevo en un momento. 😅' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-110 animate-pulse-glow"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-2 left-2 z-50 mx-auto max-w-sm animate-slide-up">
          <div className="flex flex-col rounded-2xl border-2 border-border bg-card shadow-2xl overflow-hidden" style={{ height: '420px' }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-primary/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="font-display font-bold text-foreground text-sm">Asistente de seguridad</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
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
              <form
                onSubmit={e => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || loading}
                  className="rounded-xl bg-primary text-primary-foreground"
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
