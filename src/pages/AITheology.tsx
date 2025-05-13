
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Send, Bot, User, Crown, Lock } from 'lucide-react';

// Types for chat messages
type MessageType = 'user' | 'ai';
interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

// Suggested questions
const suggestedQuestions = [
  "O que a Bíblia ensina sobre graça?",
  "Explique a doutrina da Trindade.",
  "Qual o significado da ressurreição de Cristo?",
  "O que são os dons do Espírito Santo?",
  "Explique o livro de Apocalipse.",
];

// Expert levels (for Premium users)
type ExpertLevel = 'leigo' | 'estudante' | 'bacharel' | 'doutor';

const AITheology = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expertLevel, setExpertLevel] = useState<ExpertLevel>('leigo');
  const [remainingQuestions, setRemainingQuestions] = useState(user?.subscriptionType === 'free' ? 5 : user?.subscriptionType === 'basic' ? 20 : Infinity);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Initial greeting message
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: 'initial',
      type: 'ai',
      content: 'Olá! Sou sua IA Teológica. Como posso ajudá-lo hoje com questões bíblicas ou teológicas?',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    if (remainingQuestions <= 0) {
      toast.error('Você atingiu o limite de perguntas para hoje. Considere uma assinatura para continuar.');
      return;
    }
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // In a real app, this would be an API request
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample responses based on expert level
      let aiResponse = '';
      
      // In a real app, we'd be sending the prompt and expert level to the OpenAI API
      switch (expertLevel) {
        case 'doutor':
          aiResponse = 'Esta é uma resposta detalhada e acadêmica com referências extensas... (Modo Doutor em Teologia)';
          break;
        case 'bacharel':
          aiResponse = 'Esta é uma resposta mais técnica com terminologia teológica... (Modo Bacharel em Teologia)';
          break;
        case 'estudante':
          aiResponse = 'Esta é uma resposta moderadamente detalhada... (Modo Estudante de Teologia)';
          break;
        default:
          aiResponse = 'Esta é uma resposta simples e acessível sobre a sua pergunta teológica, explicada de forma que qualquer pessoa possa entender.';
      }
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update remaining questions
      if (remainingQuestions !== Infinity) {
        setRemainingQuestions(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Erro ao obter resposta da IA. Tente novamente.');
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };
  
  const isPremiumFeature = (level: ExpertLevel) => {
    if (level === 'leigo') return false;
    if (level === 'estudante' && user?.subscriptionType !== 'free') return false;
    if (user?.subscriptionType === 'premium') return false;
    return true;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 app-container flex flex-col relative pb-24">
        {/* Subscription Status */}
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-bible-primary dark:text-bible-secondary flex items-center">
            <Bot className="mr-2" /> IA Teológica
          </h1>
          
          <div className="flex items-center gap-2">
            {user?.subscriptionType !== 'premium' && (
              <Badge variant="outline" className="mr-2">
                {remainingQuestions} perguntas restantes
              </Badge>
            )}
            
            <Select value={expertLevel} onValueChange={(value) => setExpertLevel(value as ExpertLevel)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Nível do especialista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leigo">Leigo</SelectItem>
                <SelectItem value="estudante" disabled={isPremiumFeature('estudante')}>
                  Estudante {isPremiumFeature('estudante') && <Lock className="w-3 h-3 ml-1 inline" />}
                </SelectItem>
                <SelectItem value="bacharel" disabled={isPremiumFeature('bacharel')}>
                  Bacharel {isPremiumFeature('bacharel') && <Lock className="w-3 h-3 ml-1 inline" />}
                </SelectItem>
                <SelectItem value="doutor" disabled={isPremiumFeature('doutor')}>
                  Doutor {isPremiumFeature('doutor') && <Crown className="w-3 h-3 ml-1 inline text-bible-secondary" />}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Premium Notice for non-premium users */}
        {user?.subscriptionType !== 'premium' && (
          <Card className="p-3 mb-4 bg-gradient-to-r from-bible-primary/10 to-bible-secondary/10 border border-bible-secondary/20">
            <div className="flex gap-3 items-center">
              <Crown className="h-6 w-6 text-bible-secondary flex-shrink-0" />
              <div>
                <p className="text-sm">
                  <span className="font-bold">Assine o Premium</span> para acessar consultas com especialistas teológicos e perguntas ilimitadas.
                </p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-bible-primary text-white'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.type === 'ai' ? (
                      <Bot className="h-4 w-4 mr-2" />
                    ) : (
                      <User className="h-4 w-4 mr-2" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    <span className="text-xs opacity-70">Digitando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Suggested Questions */}
        <div className="my-4 flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <Badge
              key={question}
              variant="outline"
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleSuggestedQuestion(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
        
        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta teológica..."
              className="resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button className="h-auto" onClick={handleSendMessage} disabled={isTyping || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AITheology;
