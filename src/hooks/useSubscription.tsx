
import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define os níveis de assinatura disponíveis
export type SubscriptionTier = 'free' | 'basic' | 'premium';

// Interface para o estado da assinatura
interface SubscriptionState {
  isLoading: boolean;
  isSubscribed: boolean;
  tier: SubscriptionTier;
  expiresAt: Date | null;
  
  // Ações
  subscribe: (tier: SubscriptionTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  createCheckoutSession: (plan: 'basic' | 'premium') => Promise<boolean>;
}

// Cria um store Zustand para gerenciar o estado da assinatura
export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isLoading: false,
  isSubscribed: false,
  tier: 'free',
  expiresAt: null,
  
  subscribe: async (tier) => {
    set({ isLoading: true });
    
    try {
      // Check if we are using Supabase
      if (supabase) {
        const user = supabase.auth.user();
        if (user) {
          // Set expiry date (30 days from now)
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          
          // In a real implementation, this would communicate with the backend
          // For now, we'll just simulate a successful update
        }
      }
      
      // Define data de expiração (30 dias a partir de hoje)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // Atualiza o estado da assinatura
      set({
        isSubscribed: true,
        tier,
        expiresAt,
        isLoading: false
      });
      
      // Salva na localStorage para persistência
      localStorage.setItem('app-subscription', JSON.stringify({
        isSubscribed: true,
        tier,
        expiresAt: expiresAt.toISOString()
      }));
      
      toast.success(`Assinatura ${tier} ativada com sucesso!`);
    } catch (error) {
      set({ isLoading: false });
      console.error('Erro ao processar assinatura:', error);
      toast.error('Não foi possível processar sua assinatura. Tente novamente.');
    }
  },
  
  cancelSubscription: async () => {
    set({ isLoading: true });
    
    try {
      // Simula uma chamada à API para cancelar a assinatura
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualiza o estado da assinatura
      set({
        isSubscribed: false,
        tier: 'free',
        expiresAt: null,
        isLoading: false
      });
      
      // Atualiza localStorage
      localStorage.setItem('app-subscription', JSON.stringify({
        isSubscribed: false,
        tier: 'free',
        expiresAt: null
      }));
      
      toast.success('Sua assinatura foi cancelada.');
    } catch (error) {
      set({ isLoading: false });
      console.error('Erro ao cancelar assinatura:', error);
      toast.error('Não foi possível cancelar sua assinatura. Tente novamente.');
    }
  },
  
  checkSubscription: async () => {
    set({ isLoading: true });
    
    try {
      // Verifica se há dados salvos no localStorage
      const savedData = localStorage.getItem('app-subscription');
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Verifica se a assinatura expirou
        const expiresAt = parsed.expiresAt ? new Date(parsed.expiresAt) : null;
        const isExpired = expiresAt ? new Date() > expiresAt : true;
        
        if (isExpired && parsed.isSubscribed) {
          // Assinatura expirada
          set({
            isSubscribed: false,
            tier: 'free',
            expiresAt: null,
            isLoading: false
          });
          
          // Atualiza localStorage
          localStorage.setItem('app-subscription', JSON.stringify({
            isSubscribed: false,
            tier: 'free',
            expiresAt: null
          }));
          
          toast.error('Sua assinatura expirou.');
        } else {
          // Atualiza com os dados salvos
          set({
            isSubscribed: parsed.isSubscribed,
            tier: parsed.tier as SubscriptionTier || 'free',
            expiresAt: expiresAt,
            isLoading: false
          });
        }
      } else {
        // Sem dados salvos, define como não assinante
        set({
          isSubscribed: false,
          tier: 'free',
          expiresAt: null,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      set({
        isLoading: false,
        isSubscribed: false,
        tier: 'free',
        expiresAt: null
      });
    }
  },
  
  createCheckoutSession: async (plan: 'basic' | 'premium') => {
    try {
      const user = supabase?.auth?.user();
      
      if (!user) {
        toast.error('Você precisa estar logado para assinar um plano');
        return false;
      }
      
      set({ isLoading: true });
      
      // In a production environment, this would call your backend payment endpoint
      // For now, we'll just simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set expiry date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // Update subscription state
      set({
        isSubscribed: true,
        tier: plan,
        expiresAt,
        isLoading: false
      });
      
      // Save to localStorage
      localStorage.setItem('app-subscription', JSON.stringify({
        isSubscribed: true,
        tier: plan,
        expiresAt: expiresAt.toISOString()
      }));
      
      return true;
    } catch (error) {
      set({ isLoading: false });
      console.error('Error processing payment:', error);
      return false;
    }
  }
}));

// Hook React para usar o estado da assinatura em componentes
export const useSubscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    isLoading,
    isSubscribed,
    tier,
    expiresAt,
    subscribe,
    cancelSubscription,
    checkSubscription,
    createCheckoutSession
  } = useSubscriptionStore();
  
  const [initialized, setInitialized] = useState(false);
  
  // Verificar assinatura quando o componente monta ou o usuário muda
  useEffect(() => {
    if (!initialized) {
      checkSubscription();
      setInitialized(true);
    }
  }, [initialized, checkSubscription]);
  
  // Função para assinar com verificação de login
  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!user) {
      toast.error('Faça login para assinar um plano');
      navigate('/auth?redirect=/planos');
      return;
    }
    
    await subscribe(tier);
  };
  
  return {
    isLoading,
    isSubscribed,
    tier,
    subscription: {
      subscribed: isSubscribed,
      subscription_tier: tier
    },
    expiresAt,
    subscribe: handleSubscribe,
    cancelSubscription,
    checkSubscription,
    createCheckoutSession
  };
};

// Para acesso fora de componentes React
useSubscription.getState = useSubscriptionStore.getState;
