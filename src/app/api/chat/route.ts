import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

// Permitir que Vercel espere hasta 60 segundos antes de cancelar la petición
export const maxDuration = 60;

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const modelMessages = await convertToModelMessages(messages);

    const recentMessages = modelMessages.slice(-6);

    const result = streamText({
      model: openrouter('deepseek/deepseek-v4-flash:free'),
      maxOutputTokens: 800,
      system: `Eres el Asistente de Seguros Pichincha en EASYSEGURO. Sé amable, directo y MUY breve (1 párrafo).

REGLAS:
1. SOLO responde sobre seguros, la app, coberturas y siniestros.
2. Si preguntan sobre otros temas, niégate cortésmente y listo.
3. Ve directo al grano, no te disculpes en cada mensaje.

FAQ COMPRIMIDO:
- Reportar siniestro: "Reportar" en inicio o línea 24/7.
- Renovación: Automática cada mes. Aviso 3 días antes.
- Cambiar plan: Desde "Mi seguro" o contactando al asistente.
- Carnet digital: En "Mi seguro", descargar o compartir.
- Cancelar/Contacto: 1800 400 400, WhatsApp 0999 667 779 (Lu-Vie 08:30-17:30). Trámite personal del titular.`,
      messages: recentMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
