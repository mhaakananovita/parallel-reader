import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const text = body.text?.trim();

    if (!text) {
      return Response.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "coral",
      input: text,
      instructions: "Read clearly and naturally at a calm pace.",
    });

    const audioBuffer = await speech.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Failed to generate speech:", error);

    return Response.json(
      { error: "Failed to generate speech." },
      { status: 500 }
    );
  }
}