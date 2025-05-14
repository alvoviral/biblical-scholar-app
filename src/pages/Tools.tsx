
import React from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BarChart, Clock, Calendar, Book, Users } from 'lucide-react';

const ToolCard = ({ 
  title, 
  description, 
  icon: Icon, 
  comingSoon = false 
}: { 
  title: string; 
  description: string; 
  icon: React.FC<any>; 
  comingSoon?: boolean;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      {comingSoon && (
        <div className="bg-muted rounded-md p-4 text-center">
          <p className="font-semibold">Em breve</p>
          <p className="text-sm text-muted-foreground">Esta ferramenta está em desenvolvimento.</p>
        </div>
      )}
    </CardContent>
    <CardFooter>
      <Button className="w-full" disabled={comingSoon}>
        {comingSoon ? 'Em breve' : 'Acessar'}
      </Button>
    </CardFooter>
  </Card>
);

const Tools = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  
  // Verificar se o usuário pode acessar este recurso premium
  const canUseFeature = user && tier === 'premium';

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 app-container flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Recurso Protegido</CardTitle>
              <CardDescription>
                Faça login para acessar as ferramentas.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to="/auth?redirect=/ferramentas" className="w-full">
                <Button className="w-full">Fazer Login</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  if (!canUseFeature) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 app-container flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Recurso Premium</CardTitle>
              <CardDescription>
                As ferramentas estão disponíveis apenas para assinantes do plano Premium.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to="/planos" className="w-full">
                <Button className="w-full">Ver Planos</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 app-container">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart className="mr-2" /> Ferramentas para Culto
          </h1>
          <p className="text-muted-foreground">
            Ferramentas para auxiliar na organização e condução dos cultos
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ToolCard 
            title="Cronômetro" 
            description="Controle o tempo das pregações e atividades do culto"
            icon={Clock}
          />
          
          <ToolCard 
            title="Planejador de Culto" 
            description="Organize a ordem do culto e os participantes"
            icon={Calendar}
          />
          
          <ToolCard 
            title="Projetor de Letras" 
            description="Projete letras de músicas e versículos para o culto"
            icon={Book}
            comingSoon
          />
          
          <ToolCard 
            title="Escala de Serviço" 
            description="Organize escalas para ministérios da igreja"
            icon={Users}
            comingSoon
          />
        </div>
      </main>
    </div>
  );
};

export default Tools;
