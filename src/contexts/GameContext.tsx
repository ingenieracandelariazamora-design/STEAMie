import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type AgeGroup = '5-7' | '8-12' | 'teens' | 'adults' | null;

export interface Avatar {
  name: string;
  hairStyle: number;
  hairColor: string;
  skinColor: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

export type Level = 'Beginner' | 'Digital Defender' | 'Cyber Hero';

interface GameState {
  ageGroup: AgeGroup;
  avatar: Avatar | null;
  points: number;
  level: Level;
  badges: Badge[];
  completedMissions: string[];
  hasStarted: boolean;
}

interface GameContextType extends GameState {
  setAgeGroup: (age: AgeGroup) => void;
  setAvatar: (avatar: Avatar) => void;
  addPoints: (amount: number) => void;
  completeMission: (missionId: string) => void;
  earnBadge: (badgeId: string) => void;
  startGame: () => void;
  pointsAnimation: boolean;
}

const defaultBadges: Badge[] = [
  { id: 'first-mission', name: 'First Steps', icon: '🌟', description: 'Complete your first mission', earned: false },
  { id: 'phishing-pro', name: 'Phishing Pro', icon: '🎣', description: 'Spot all fake messages', earned: false },
  { id: 'story-master', name: 'Story Master', icon: '📖', description: 'Complete an interactive story', earned: false },
  { id: 'cyber-defender', name: 'Cyber Defender', icon: '🛡️', description: 'Reach 100 points', earned: false },
  { id: 'perfect-score', name: 'Perfect Score', icon: '💎', description: 'Get a perfect score in any game', earned: false },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

function getLevel(points: number): Level {
  if (points >= 200) return 'Cyber Hero';
  if (points >= 100) return 'Digital Defender';
  return 'Beginner';
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    ageGroup: null,
    avatar: null,
    points: 0,
    level: 'Beginner',
    badges: defaultBadges,
    completedMissions: [],
    hasStarted: false,
  });
  const [pointsAnimation, setPointsAnimation] = useState(false);

  const setAgeGroup = useCallback((ageGroup: AgeGroup) => {
    setState(prev => ({ ...prev, ageGroup }));
  }, []);

  const setAvatar = useCallback((avatar: Avatar) => {
    setState(prev => ({ ...prev, avatar }));
  }, []);

  const addPoints = useCallback((amount: number) => {
    setPointsAnimation(true);
    setTimeout(() => setPointsAnimation(false), 500);
    setState(prev => {
      const newPoints = prev.points + amount;
      const newLevel = getLevel(newPoints);
      let newBadges = [...prev.badges];
      if (newPoints >= 100) {
        newBadges = newBadges.map(b => b.id === 'cyber-defender' ? { ...b, earned: true } : b);
      }
      return { ...prev, points: newPoints, level: newLevel, badges: newBadges };
    });
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setState(prev => {
      if (prev.completedMissions.includes(missionId)) return prev;
      const newCompleted = [...prev.completedMissions, missionId];
      let newBadges = [...prev.badges];
      if (newCompleted.length === 1) {
        newBadges = newBadges.map(b => b.id === 'first-mission' ? { ...b, earned: true } : b);
      }
      return { ...prev, completedMissions: newCompleted, badges: newBadges };
    });
  }, []);

  const earnBadge = useCallback((badgeId: string) => {
    setState(prev => ({
      ...prev,
      badges: prev.badges.map(b => b.id === badgeId ? { ...b, earned: true } : b),
    }));
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({ ...prev, hasStarted: true }));
  }, []);

  return (
    <GameContext.Provider value={{ ...state, setAgeGroup, setAvatar, addPoints, completeMission, earnBadge, startGame, pointsAnimation }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}
