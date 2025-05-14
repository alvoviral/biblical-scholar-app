import React from 'react';
import Header from '@/components/Header';
import FeatureIcon from '@/components/FeatureIcon';
import { toast } from "sonner";
import { 
  Book, 
  MessageCircle, 
  FileType, 
  CalendarDays, 
  Music, 
  Users, 
  BarChart, 
  BookOpen,
  Download
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';

const DailyVerse = () => {
  return (
    <Card className="mb-6 border-bible-primary/20 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-bible-primary dark:text-bible-secondary flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Versículo do Dia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">
          "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
        </p>
        <p className="text-right text-sm text-muted-foreground mt-2">João 3:16</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto text-xs"
          onClick={() => toast.success("Versículo copiado para a área de transferência.")}
        >
          Compartilhar
        </Button>
      </CardFooter>
    </Card>
  );
};

const AppPromoBanner = () => {
  return (
    <Card className="bg-gradient-to-r from-bible-primary to-blue-700 text-white mb-6 animate-slide-up">
      <CardContent className="flex items-center space-x-4 p-4">
        <Download className="h-10 w-10 flex-shrink-0" />
        <div>
          <h3 className="font-bold">Acesse offline!</h3>
          <p className="text-sm opacity-90">Baixe o app para acesso completo mesmo sem internet.</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 app-container">
        <AppPromoBanner />
        
        <DailyVerse />
        
        <section className="my-6">
          <h2 className="section-title">Recursos</h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
            <FeatureIcon 
              icon={Book} 
              title="Bíblia" 
              to="/biblia" 
            />
            <FeatureIcon 
              icon={MessageCircle} 
              title="IA Teológica" 
              to="/ia-teologica"
              basic={true}
            />
            <FeatureIcon 
              icon={FileType} 
              title="Pregações" 
              to="/pregacoes"
              premium={true} 
            />
            <FeatureIcon 
              icon={CalendarDays} 
              title="Pão Diário" 
              to="/pao-diario" 
            />
            <FeatureIcon 
              icon={Music} 
              title="Harpa Cristã" 
              to="/harpa" 
            />
            <FeatureIcon 
              icon={Users} 
              title="Comunidade" 
              to="/comunidade"
              premium={true} 
            />
            <FeatureIcon 
              icon={BarChart} 
              title="Ferramentas" 
              to="/ferramentas"
              premium={true} 
            />
            <FeatureIcon 
              icon={BookOpen} 
              title="Anotações" 
              to="/anotacoes"
              basic={true}
            />
          </div>
        </section>
        
        {!user && (
          <section className="my-6">
            <Card>
              <CardHeader>
                <CardTitle>Desbloqueie recursos premium</CardTitle>
                <CardDescription>
                  Acesse recursos avançados com a assinatura Básica ou Premium.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap">
                  <div className="border rounded p-4 flex-1 min-w-[250px]">
                    <h3 className="font-bold mb-2">Plano Básico</h3>
                    <p className="text-2xl font-bold mb-4">R$5<span className="text-sm font-normal">/mês</span></p>
                    <ul className="text-sm space-y-1 mb-4">
                      <li>• IA Teológica (20 perguntas/dia)</li>
                      <li>• Anotações com categorização</li>
                      <li>• Todas as versões bíblicas</li>
                      <li>• Comparação de versões</li>
                    </ul>
                  </div>
                  <div className="border-2 border-bible-secondary rounded p-4 flex-1 min-w-[250px] relative">
                    <span className="absolute -top-3 bg-bible-secondary text-xs px-2 py-0.5 rounded-full text-black">Recomendado</span>
                    <h3 className="font-bold mb-2">Plano Premium</h3>
                    <p className="text-2xl font-bold mb-4">R$15<span className="text-sm font-normal">/mês</span></p>
                    <ul className="text-sm space-y-1 mb-4">
                      <li>• Tudo do Plano Básico</li>
                      <li>• IA Teológica ilimitada (GPT-4 Turbo)</li>
                      <li>• Criação de Pregações</li>
                      <li>• Comunidade Cristã</li>
                      <li>• Ferramentas para Culto</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/planos" className="w-full">
                  <Button variant="default" className="w-full">
                    Ver Assinaturas
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </section>
        )}

        {user && !isSubscribed && (
          <section className="my-6">
            <Card>
              <CardHeader>
                <CardTitle>Desbloqueie recursos premium</CardTitle>
                <CardDescription>
                  Acesse recursos avançados com a assinatura Básica ou Premium.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to="/planos" className="w-full">
                  <Button variant="default" className="w-full">
                    Ver Assinaturas
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
