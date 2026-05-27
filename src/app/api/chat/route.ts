import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);
    const recentMessages = modelMessages.slice(-6);

    const result = streamText({
      model: google('gemini-2.5-flash'),
      maxOutputTokens: 800,
      system: `Eres EASY Assist, el asistente de Seguros Pichincha en EASYSEGURO. Sé amable, directo y MUY breve (1 párrafo).

REGLAS:
1. SOLO responde sobre seguros, la app, coberturas y siniestros.
2. Si preguntan sobre otros temas, niégate cortésmente y listo.
3. Ve directo al grano, no te disculpes en cada mensaje.

FAQ COMPRIMIDO:
- Reportar siniestro: "Reportar" en inicio o línea 24/7.
- Renovación: Automática cada mes. Aviso 3 días antes.
- Cambiar plan: Desde "Mi seguro" o contactando a EASY Assist.
- Carnet digital: En "Mi seguro", descargar o compartir.
- Cancelar/Contacto: 1800 400 400, WhatsApp 0999 667 779.`,
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
