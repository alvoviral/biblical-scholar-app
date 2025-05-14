
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface PaymentRequest {
  plan: 'basic' | 'premium';
  userId: string;
  returnUrl: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { plan, userId, returnUrl } = await req.json() as PaymentRequest;

    if (!plan || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Set plan amount based on selection
    const amount = plan === 'basic' ? 5 : 15;
    const planTitle = plan === 'basic' ? 'Plano Básico' : 'Plano Premium';

    // Create Mercado Pago preference
    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          items: [
            {
              id: `bible-app-${plan}-subscription`,
              title: `Assinatura ${planTitle} - Bíblia App`,
              quantity: 1,
              unit_price: amount,
              currency_id: "BRL",
            },
          ],
          back_urls: {
            success: `${returnUrl}?status=success&plan=${plan}&user=${userId}`,
            failure: `${returnUrl}?status=failure`,
            pending: `${returnUrl}?status=pending`,
          },
          auto_return: "approved",
          external_reference: userId,
          metadata: {
            user_id: userId,
            subscription_plan: plan,
          },
        }),
      }
    );

    const preference = await response.json();

    // If everything is successful
    return new Response(JSON.stringify(preference), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating payment:", error);

    return new Response(
      JSON.stringify({ error: "Failed to create payment" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
