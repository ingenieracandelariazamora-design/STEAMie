import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Send, BookOpen, Gamepad2, MessageSquare, Shield, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import emabotMascot from '@/assets/emabot-mascot.png';

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'online games': { label: 'Juegos en línea', icon: <Gamepad2 className="h-3 w-3" />, color: 'bg-secondary text-secondary-foreground' },
  'messages': { label: 'Mensajes', icon: <MessageSquare className="h-3 w-3" />, color: 'bg-accent text-accent-foreground' },
  'social media': { label: 'Redes sociales', icon: <Heart className="h-3 w-3" />, color: 'bg-primary text-primary-foreground' },
  'privacy': { label: 'Privacidad', icon: <Shield className="h-3 w-3" />, color: 'bg-teal text-teal-foreground' },
};

const EMABOT_TIPS = [
  "Hablar con tu hijo/a sobre sus experiencias en línea ayuda a mantenerlos seguros.",
  "Establecer reglas claras sobre el uso de internet es clave para la seguridad digital.",
  "Los niños aprenden del ejemplo: muestra buenos hábitos digitales.",
  "Crear un ambiente de confianza hace que los niños compartan cuando algo les preocupa.",
  "Revisar juntos las apps y juegos antes de descargarlos es una excelente práctica.",
  "Nunca es demasiado temprano para hablar de seguridad en internet.",
];

interface Story {
  id: string;
  title: string;
  story: string;
  lesson: string;
  advice: string | null;
  category: string;
  author_name: string;
  created_at: string;
}

const CommunityStories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    story: '',
    lesson: '',
    advice: '',
    category: 'privacy',
    author_name: '',
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('community_stories')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStories(data as Story[]);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.story.trim() || !form.lesson.trim()) {
      toast({ title: 'Campos requeridos', description: 'Por favor completa el título, la historia y la lección.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('community_stories').insert({
      title: form.title.trim(),
      story: form.story.trim(),
      lesson: form.lesson.trim(),
      advice: form.advice.trim() || null,
      category: form.category,
      author_name: form.author_name.trim() || 'Anónimo',
    });

    if (error) {
      toast({ title: 'Error', description: 'No se pudo enviar tu historia.', variant: 'destructive' });
    } else {
      toast({ title: '¡Gracias por compartir! 💜', description: 'Tu historia ayudará a otras familias.' });
      setForm({ title: '', story: '', lesson: '', advice: '', category: 'privacy', author_name: '' });
      setShowForm(false);
      fetchStories();
    }
    setSubmitting(false);
  };

  const filtered = filter ? stories.filter(s => s.category === filter) : stories;

  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container flex items-center gap-3 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">Historias de la Comunidad</h1>
            <p className="text-xs text-muted-foreground">Experiencias reales de familias</p>
          </div>
        </div>
      </header>

      <div className="container max-w-lg py-4 space-y-4">
        {/* Emabot intro */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-[hsl(var(--pink-light))] to-[hsl(var(--purple-light))]">
          <CardContent className="flex items-start gap-3 p-4">
            <img src={emabotMascot} alt="Emabot" className="h-14 w-14 rounded-full border-2 border-primary shadow-md" />
            <div>
              <p className="font-display text-sm font-bold text-foreground">Emabot dice:</p>
              <p className="mt-1 text-sm text-foreground/80">
                "Aquí puedes leer historias de otras familias y aprender juntos cómo estar seguros en internet. 💜 ¡También puedes compartir tu experiencia!"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <Badge
            className={`cursor-pointer transition-all ${!filter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            onClick={() => setFilter(null)}
          >
            Todas
          </Badge>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <Badge
              key={key}
              className={`cursor-pointer transition-all flex items-center gap-1 ${filter === key ? cfg.color : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              onClick={() => setFilter(filter === key ? null : key)}
            >
              {cfg.icon} {cfg.label}
            </Badge>
          ))}
        </div>

        {/* Share button */}
        <Button
          className="w-full gap-2 text-base font-display font-bold shadow-md"
          size="lg"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {showForm ? 'Cancelar' : 'Comparte tu Historia'}
        </Button>

        {/* Submit form */}
        {showForm && (
          <Card className="border-2 border-accent/30 animate-in fade-in slide-in-from-top-2 duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Tu Historia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Tu nombre (opcional)"
                value={form.author_name}
                onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                maxLength={50}
              />
              <Input
                placeholder="Título de tu historia *"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                maxLength={100}
              />
              <Textarea
                placeholder="¿Qué pasó? Cuéntanos tu experiencia *"
                value={form.story}
                onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                maxLength={1000}
                className="min-h-[80px]"
              />
              <Textarea
                placeholder="¿Qué aprendieron? *"
                value={form.lesson}
                onChange={e => setForm(f => ({ ...f, lesson: e.target.value }))}
                maxLength={500}
                className="min-h-[60px]"
              />
              <Textarea
                placeholder="Consejo para otras familias (opcional)"
                value={form.advice}
                onChange={e => setForm(f => ({ ...f, advice: e.target.value }))}
                maxLength={500}
                className="min-h-[60px]"
              />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                    <Badge
                      key={key}
                      className={`cursor-pointer flex items-center gap-1 ${form.category === key ? cfg.color : 'bg-muted text-muted-foreground'}`}
                      onClick={() => setForm(f => ({ ...f, category: key }))}
                    >
                      {cfg.icon} {cfg.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full gap-2 font-display font-bold" onClick={handleSubmit} disabled={submitting}>
                <Send className="h-4 w-4" />
                {submitting ? 'Enviando...' : 'Enviar Historia'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stories feed */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando historias...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No hay historias en esta categoría aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((s, i) => {
              const cat = CATEGORY_CONFIG[s.category] || CATEGORY_CONFIG['privacy'];
              const tip = EMABOT_TIPS[i % EMABOT_TIPS.length];
              return (
                <Card key={s.id} className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-bold text-foreground leading-tight">{s.title}</h3>
                      <Badge className={`${cat.color} shrink-0 flex items-center gap-1 text-[10px]`}>
                        {cat.icon} {cat.label}
                      </Badge>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed">{s.story}</p>

                    <div className="rounded-lg bg-[hsl(var(--success)/0.1)] p-3">
                      <p className="text-xs font-bold text-[hsl(var(--success))] mb-1">💡 Lección aprendida</p>
                      <p className="text-sm text-foreground/80">{s.lesson}</p>
                    </div>

                    {s.advice && (
                      <div className="rounded-lg bg-[hsl(var(--warning)/0.15)] p-3">
                        <p className="text-xs font-bold text-[hsl(var(--warning))] mb-1">💬 Consejo para familias</p>
                        <p className="text-sm text-foreground/80">{s.advice}</p>
                      </div>
                    )}

                    <p className="text-[11px] text-muted-foreground">— {s.author_name}</p>

                    {/* Emabot tip */}
                    <div className="flex items-start gap-2 rounded-lg bg-[hsl(var(--purple-light))] p-2.5">
                      <img src={emabotMascot} alt="Emabot" className="h-8 w-8 rounded-full border border-primary/30" />
                      <p className="text-xs text-foreground/70 italic">🤖 Emabot: "{tip}"</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityStories;
