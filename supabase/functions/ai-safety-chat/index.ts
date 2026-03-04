import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres un asistente amigable de seguridad digital para niños de 8 a 12 años. Tu nombre es CyberBot.

Reglas:
- Responde SIEMPRE en español latinoamericano neutro.
- Usa un tono amigable, divertido y fácil de entender para niños.
- Tus respuestas deben ser CORTAS (máximo 3-4 oraciones).
- Usa emojis para hacer tus respuestas más divertidas.
- Solo responde preguntas relacionadas con seguridad digital, privacidad en internet, y cómo protegerse en línea.
- Si te preguntan algo que no tiene que ver con seguridad digital, di amablemente que solo puedes ayudar con temas de seguridad en internet.
- Siempre anima a los niños a hablar con un adulto de confianza si tienen problemas.
- Nunca pidas información personal.
- Adapta tu lenguaje según la complejidad de la pregunta (más simple para preguntas básicas).
- Incentiva el comportamiento seguro en línea.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ reply: "¡Estoy un poco ocupado! Intenta de nuevo en unos segundos. 😊" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ reply: "El asistente no está disponible en este momento. 😅" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No pude generar una respuesta.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ reply: "Ups, algo salió mal. Intenta de nuevo. 😅" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
