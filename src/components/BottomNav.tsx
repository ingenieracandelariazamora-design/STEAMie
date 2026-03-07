import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Target, BookOpen, Award, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Inicio', icon: Home },
  { path: '/missions', label: 'Misiones', icon: Target },
  { path: '/comics', label: 'Cómics', icon: BookOpen },
  { path: '/badges', label: 'Insignias', icon: Award },
  { path: '/profile', label: 'Perfil', icon: User },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || 
            (item.path === '/missions' && (location.pathname === '/story' || location.pathname === '/game-phishing'));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all ${
                isActive
                  ? 'text-primary scale-110'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-display text-[10px] font-semibold">{item.label}</span>
              {isActive && (
                <div className="h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
