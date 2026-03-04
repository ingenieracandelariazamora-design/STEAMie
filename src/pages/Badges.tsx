import { useGame } from '@/contexts/GameContext';

const badgeLabels: Record<string, { name: string; description: string }> = {
  'first-mission': { name: 'Primeros pasos', description: 'Completa tu primera misión' },
  'phishing-pro': { name: 'Experto en Phishing', description: 'Detecta todos los mensajes falsos' },
  'story-master': { name: 'Maestro de Historias', description: 'Completa una historia interactiva' },
  'cyber-defender': { name: 'Ciber Defensor', description: 'Alcanza 100 puntos' },
  'perfect-score': { name: 'Puntaje Perfecto', description: 'Obtén puntaje perfecto en cualquier juego' },
};

const Badges = () => {
  const { badges } = useGame();
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      <div className="container pt-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Insignias</h1>
        <p className="text-muted-foreground mb-6">
          Ganadas: {earnedCount}/{badges.length}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {badges.map(badge => {
            const label = badgeLabels[badge.id];
            return (
              <div
                key={badge.id}
                className={`card-playful flex items-center gap-4 ${
                  badge.earned
                    ? 'border-gold bg-gold/10'
                    : 'opacity-50 grayscale'
                }`}
              >
                <span className="text-4xl">{badge.icon}</span>
                <div>
                  <p className="font-display font-semibold text-foreground">{label?.name || badge.name}</p>
                  <p className="text-sm text-muted-foreground">{label?.description || badge.description}</p>
                </div>
                {badge.earned && <span className="ml-auto text-2xl">✅</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Badges;
