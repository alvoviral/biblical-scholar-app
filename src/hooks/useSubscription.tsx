
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface Subscription {
  subscribed: boolean;
  subscription_tier: SubscriptionTier;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSubscription = async (): Promise<Subscription | null> => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      // In a real app, this would call an edge function to check with payment provider
      // For now, we'll just check the database
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      if (data) {
        const subscriptionData: Subscription = {
          subscribed: data.subscribed,
          subscription_tier: data.subscription_tier || 'free',
          subscription_end: data.subscription_end,
        };
        setSubscription(subscriptionData);
        return subscriptionData;
      }
      
      return null;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async (plan: 'basic' | 'premium'): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      
      // In a real app, this would call an edge function to create a checkout session
      // For now, we'll simulate a subscription by updating the database directly
      
      // This is a placeholder - in a real app, this would be replaced with actual payment processing
      toast.info("Em breve disponível. Estamos em desenvolvimento!");
      
      // For demo purposes, let's simulate a successful subscription
      // In production, you would integrate with Mercado Pago or Stripe
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email,
          subscribed: true,
          subscription_tier: plan,
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error creating subscription:', error);
        return false;
      }
      
      // Refresh subscription data
      await checkSubscription();
      return true;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const manageSubscription = async (): Promise<boolean> => {
    // In a real app, this would open a customer portal session
    toast.info("Gerenciamento de assinaturas em breve disponível!");
    return true;
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    subscription,
    isLoading,
    checkSubscription,
    createCheckoutSession,
    manageSubscription,
  };
};
