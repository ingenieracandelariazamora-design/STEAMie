import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import BottomNav from "@/components/BottomNav";
import AIChatbot from "@/components/AIChatbot";
import Landing from "./pages/Landing";
import CreateAvatar from "./pages/CreateAvatar";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import Badges from "./pages/Badges";
import Profile from "./pages/Profile";
import StoryMission from "./pages/StoryMission";
import PhishingGame from "./pages/PhishingGame";
import ComicStories from "./pages/ComicStories";
import FamilyGuide from "./pages/FamilyGuide";
import EmabotChat from "./pages/EmabotChat";
import SafeOrNotGame from "./pages/SafeOrNotGame";
import MiniGames from "./pages/MiniGames";
import DetectiveGame from "./pages/DetectiveGame";
import ProtectInfoGame from "./pages/ProtectInfoGame";
import CommunityStories from "./pages/CommunityStories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PAGES_WITH_NAV = ['/dashboard', '/missions', '/badges', '/profile', '/story', '/game-phishing', '/comics', '/emabot-chat', '/game-safe-or-not', '/mini-games', '/game-detective', '/game-protect-info', '/community-stories'];

const AppContent = () => {
  const location = useLocation();
  const showNav = PAGES_WITH_NAV.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create-avatar" element={<CreateAvatar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/story" element={<StoryMission />} />
        <Route path="/game-phishing" element={<PhishingGame />} />
        <Route path="/comics" element={<ComicStories />} />
        <Route path="/emabot-chat" element={<EmabotChat />} />
        <Route path="/family-guide" element={<FamilyGuide />} />
        <Route path="/game-safe-or-not" element={<SafeOrNotGame />} />
        <Route path="/mini-games" element={<MiniGames />} />
        <Route path="/game-detective" element={<DetectiveGame />} />
        <Route path="/game-protect-info" element={<ProtectInfoGame />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNav && <BottomNav />}
      {showNav && <AIChatbot />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
