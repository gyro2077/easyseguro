import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { ok: false, error: 'No se recibió la imagen' },
        { status: 400 },
      );
    }

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      maxTokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Eres un extractor de datos de cédulas ecuatorianas. Analiza la imagen y extrae SOLO estos campos en JSON (sin markdown):

{
  "cedula": "número de 10 dígitos",
  "nombres": "nombres completos",
  "apellidos": "apellidos completos"
}

Reglas:
- Cédula: exactamente 10 dígitos.
- Nombres y apellidos: conviértelos a formato título (primera letra mayúscula, resto minúscula).
- Responde ÚNICAMENTE con el JSON, sin texto adicional.`,
            },
            { type: 'image', image: new URL(image) },
          ],
        },
      ],
    });

    const text = result.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { ok: false, error: 'No se pudo extraer la información de la imagen' },
        { status: 422 },
      );
    }

    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    console.error('OCR error:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Error al procesar la imagen' },
      { status: 500 },
    );
  }
}
