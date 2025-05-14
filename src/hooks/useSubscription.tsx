
import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Define os níveis de assinatura disponíveis
export type SubscriptionTier = 'free' | 'basic' | 'premium';

// Interface para o estado da assinatura
interface SubscriptionState {
  isLoading: boolean;
  isSubscribed: boolean;
  tier: SubscriptionTier;
  expiresAt: Date | null;
  subscription_tier?: SubscriptionTier; // For backward compatibility
  
  // Ações
  subscribe: (tier: SubscriptionTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  createCheckoutSession?: (plan: 'basic' | 'premium') => Promise<boolean>;
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
      // Simula uma chamada à API para processar a assinatura
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Define data de expiração (30 dias a partir de hoje)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // Atualiza o estado da assinatura
      set({
        isSubscribed: true,
        tier,
        subscription_tier: tier, // Add for backward compatibility
        expiresAt,
        isLoading: false
      });
      
      // Salva na localStorage para persistência
      localStorage.setItem('app-subscription', JSON.stringify({
        isSubscribed: true,
        tier,
        subscription_tier: tier, // Add for backward compatibility
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
        subscription_tier: 'free', // Add for backward compatibility
        expiresAt: null,
        isLoading: false
      });
      
      // Atualiza localStorage
      localStorage.setItem('app-subscription', JSON.stringify({
        isSubscribed: false,
        tier: 'free',
        subscription_tier: 'free', // Add for backward compatibility
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
            subscription_tier: 'free', // Add for backward compatibility
            expiresAt: null,
            isLoading: false
          });
          
          // Atualiza localStorage
          localStorage.setItem('app-subscription', JSON.stringify({
            isSubscribed: false,
            tier: 'free',
            subscription_tier: 'free', // Add for backward compatibility
            expiresAt: null
          }));
          
          toast.error('Sua assinatura expirou.');
        } else {
          // Atualiza com os dados salvos
          set({
            isSubscribed: parsed.isSubscribed,
            tier: parsed.tier as SubscriptionTier || 'free',
            subscription_tier: parsed.tier as SubscriptionTier || 'free', // Add for backward compatibility
            expiresAt: expiresAt,
            isLoading: false
          });
        }
      } else {
        // Sem dados salvos, define como não assinante
        set({
          isSubscribed: false,
          tier: 'free',
          subscription_tier: 'free', // Add for backward compatibility
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
        subscription_tier: 'free', // Add for backward compatibility
        expiresAt: null
      });
    }
  }
}));

// Add a mock implementation for createCheckoutSession
useSubscriptionStore.setState({
  createCheckoutSession: async (plan: 'basic' | 'premium') => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update subscription based on the plan
      const tier = plan as SubscriptionTier;
      
      // Set expiry date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      useSubscriptionStore.setState({
        isSubscribed: true,
        tier,
        subscription_tier: tier,
        expiresAt,
        isLoading: false
      });
      
      // Save to localStorage
      localStorage.setItem('app-subscription', JSON.stringify({
        isSubscribed: true,
        tier,
        subscription_tier: tier,
        expiresAt: expiresAt.toISOString()
      }));
      
      return true;
    } catch (error) {
      console.error('Error processing checkout:', error);
      return false;
    }
  }
});

// Hook React para usar o estado da assinatura em componentes
export const useSubscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    isLoading,
    isSubscribed,
    tier,
    subscription_tier,
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
      subscription_tier: subscription_tier || tier
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
