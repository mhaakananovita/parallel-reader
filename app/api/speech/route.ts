import { openai } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const text = body.text?.trim();
    const readingId = body.readingId;

    if (!text) {
      return Response.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    if (!readingId) {
      return Response.json(
        { error: "Reading ID is required." },
        { status: 400 }
      );
    }

    // Connect to Supabase
    const supabase = await createClient();

    // Find the currently signed-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    // Generate the audio with OpenAI
    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "coral",
      input: text,
      instructions: "Read clearly and naturally at a calm pace.",
    });

    const audioBuffer = await speech.arrayBuffer();

    // Each user gets their own folder.
    // Each reading gets one MP3 file.
    const audioPath = `${user.id}/${readingId}.mp3`;

    // Save the MP3 in Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("reading-audio")
      .upload(audioPath, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
  console.error("Failed to upload audio:", uploadError);

  return Response.json(
    {
      error: uploadError.message,
      details: uploadError,
    },
    { status: 500 }
  );
}

    // Save the Storage path on the reading record
    const { error: updateError } = await supabase
      .from("readings")
      .update({
        audio_path: audioPath,
      })
      .eq("id", readingId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error(
        "Failed to attach audio to reading:",
        updateError
      );

      return Response.json(
        { error: "Failed to attach audio to reading." },
        { status: 500 }
      );
    }

    // Tell the browser where the saved audio belongs
    return Response.json({
      audioPath,
    });
  } catch (error) {
    console.error("Failed to generate speech:", error);

    return Response.json(
      { error: "Failed to generate speech." },
      { status: 500 }
    );
  }
}