
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Plans = () => {
  const { user } = useAuth();
  const { isSubscribed, tier, subscribe, isLoading } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  // Handle payment return from Mercado Pago
  useEffect(() => {
    const handlePaymentReturn = async () => {
      const searchParams = new URLSearchParams(location.search);
      const status = searchParams.get('status');
      const plan = searchParams.get('plan');
      const userId = searchParams.get('user');
      
      if (status && plan && userId && status === 'success') {
        try {
          // Call the handle-subscription function
          const response = await fetch(
            'https://oregxnkiwqaojyxervir.supabase.co/functions/v1/handle-subscription',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${supabase.auth.session()?.access_token || ''}`,
              },
              body: JSON.stringify({
                user_id: userId,
                plan: plan,
                status: status,
              }),
            }
          );
          
          const result = await response.json();
          
          if (response.ok) {
            // Activate the subscription in the frontend
            await subscribe(plan as any);
            toast.success(`Assinatura ${plan === 'basic' ? 'Básica' : 'Premium'} ativada com sucesso!`);
            navigate("/");
          } else {
            toast.error("Erro ao ativar assinatura: " + result.error);
          }
        } catch (error) {
          console.error("Erro ao processar retorno do pagamento:", error);
          toast.error("Erro ao processar pagamento. Tente novamente.");
        }
        
        // Clear URL parameters
        navigate('/planos', { replace: true });
      } else if (status === 'failure') {
        toast.error("O pagamento não foi concluído. Tente novamente.");
        navigate('/planos', { replace: true });
      } else if (status === 'pending') {
        toast.info("Pagamento pendente. Você receberá uma confirmação quando for aprovado.");
        navigate('/planos', { replace: true });
      }
    };
    
    if (location.search) {
      handlePaymentReturn();
    }
  }, [location.search, navigate, subscribe]);

  const handleSubscription = async (plan: 'basic' | 'premium') => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar um plano");
      navigate("/auth?redirect=/planos");
      return;
    }

    try {
      setProcessingPlan(plan);
      
      // Call Mercado Pago integration function
      const response = await fetch(
        'https://oregxnkiwqaojyxervir.supabase.co/functions/v1/create-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: plan,
            userId: user.id,
            returnUrl: `${window.location.origin}/planos`,
          }),
        }
      );
      
      const result = await response.json();
      
      if (response.ok && result.init_point) {
        // Redirect to Mercado Pago checkout
        window.location.href = result.init_point;
      } else {
        toast.error("Erro ao processar pagamento: " + (result.error || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro ao processar assinatura:", error);
      toast.error("Ocorreu um erro ao processar sua assinatura. Tente novamente mais tarde.");
    } finally {
      setProcessingPlan(null);
    }
  };

  const isBasicPlan = tier === 'basic';
  const isPremiumPlan = tier === 'premium';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 app-container py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Planos de Assinatura</h1>
        <p className="text-center mb-8 text-muted-foreground">
          Escolha o plano que melhor se adapta às suas necessidades de estudo bíblico
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="border-bible-primary/20">
            <CardHeader>
              <CardTitle>Plano Gratuito</CardTitle>
              <CardDescription>Recursos básicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold">R$0</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Leitura da Bíblia (ARA)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Harpa Cristã (visualização)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Pão Diário (devocional do dia)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>IA Teológica (5 perguntas/dia)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Plano Atual
              </Button>
            </CardFooter>
          </Card>

          {/* Basic Plan */}
          <Card className={`${isBasicPlan ? 'border-2 border-bible-primary' : 'border-bible-primary/20'}`}>
            <CardHeader className="relative">
              {isBasicPlan && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-bible-primary text-white text-xs px-3 py-1 rounded-full">
                  Seu Plano
                </span>
              )}
              <CardTitle>Plano Básico</CardTitle>
              <CardDescription>Para estudo pessoal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold">R$5<span className="text-sm font-normal">/mês</span></p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>IA Teológica (20 perguntas/dia)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Anotações com categorização</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Todas as versões bíblicas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Comparação de versões</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isBasicPlan ? (
                <Button variant="outline" className="w-full" disabled>
                  Plano Atual
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  className="w-full" 
                  disabled={isLoading || processingPlan === 'basic'}
                  onClick={() => handleSubscription('basic')}
                >
                  {processingPlan === 'basic' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Carregando...' : 'Assinar Plano Básico'}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className={`${isPremiumPlan ? 'border-2 border-bible-secondary' : ''} relative`}>
            {!isPremiumPlan && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-bible-secondary text-xs px-2 py-0.5 rounded-full text-black">
                Recomendado
              </span>
            )}
            {isPremiumPlan && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-bible-secondary text-xs px-3 py-1 rounded-full text-black">
                Seu Plano
              </span>
            )}
            <CardHeader>
              <CardTitle>Plano Premium</CardTitle>
              <CardDescription>Acesso completo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold">R$15<span className="text-sm font-normal">/mês</span></p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Tudo do Plano Básico</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>IA Teológica ilimitada (GPT-4 Turbo)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Criação de Pregações</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Comunidade Cristã</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Ferramentas para Culto</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isPremiumPlan ? (
                <Button variant="outline" className="w-full" disabled>
                  Plano Atual
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  className="w-full bg-bible-secondary text-black hover:bg-bible-secondary/90" 
                  disabled={isLoading || processingPlan === 'premium'}
                  onClick={() => handleSubscription('premium')}
                >
                  {processingPlan === 'premium' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Carregando...' : 'Assinar Plano Premium'}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Ao assinar, você aceita nossos Termos de Serviço e Política de Privacidade.</p>
          <p className="mt-2">Você pode cancelar sua assinatura a qualquer momento.</p>
        </div>
      </main>
    </div>
  );
};

export default Plans;
