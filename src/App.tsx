import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import Landing from "./pages/Landing";
import CreateAvatar from "./pages/CreateAvatar";
import Dashboard from "./pages/Dashboard";
import StoryMission from "./pages/StoryMission";
import PhishingGame from "./pages/PhishingGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create-avatar" element={<CreateAvatar />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/story" element={<StoryMission />} />
            <Route path="/game-phishing" element={<PhishingGame />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
