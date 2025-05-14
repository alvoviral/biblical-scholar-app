
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Bible from "./pages/Bible";
import Harpa from "./pages/Harpa";
import AITheology from "./pages/AITheology";
import DailyBread from "./pages/DailyBread";
import AuthPage from "./pages/AuthPage";
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";
import Notes from "./pages/Notes";
import Tools from "./pages/Tools";
import Sermons from "./pages/Sermons";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/biblia" element={<Bible />} />
            <Route path="/harpa" element={<Harpa />} />
            <Route path="/ia-teologica" element={<AITheology />} />
            <Route path="/pao-diario" element={<DailyBread />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/planos" element={<Plans />} />
            <Route path="/anotacoes" element={<Notes />} />
            <Route path="/ferramentas" element={<Tools />} />
            <Route path="/pregacoes" element={<Sermons />} />
            <Route path="/comunidade" element={<Community />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
