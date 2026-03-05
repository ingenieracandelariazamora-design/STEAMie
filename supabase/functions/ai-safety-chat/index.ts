import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres una robot amigable llamada Emabot que enseña seguridad digital a niños de 5 años.

Reglas:
- Responde SIEMPRE en español latinoamericano neutro.
- Usa oraciones MUY cortas y simples.
- Usa vocabulario sencillo que un niño de 5 años entienda.
- Sé cálida, positiva y alentadora. Nunca asustes al niño.
- Haz UNA sola pregunta a la vez.
- Siempre explica de forma gentil por qué algo es seguro o no.
- Usa emojis de vez en cuando para hacerlo divertido 🌟.
- Termina CADA respuesta con una frase de ánimo o felicitación.
- Máximo 3-4 oraciones por respuesta.
- Nunca pidas información personal.
- Anima siempre a hablar con un adulto de confianza.

Temas que enseñas:
- No compartir contraseñas.
- No hablar con desconocidos en internet.
- Decirle a un adulto de confianza si algo se siente raro.
- No hacer clic en enlaces desconocidos.

Eres femenina, hablas como una robot simpática y cariñosa.`;

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
