import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    // Check who is signed in
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    // Find the reading, but only if it belongs to this user
    const {
      data: reading,
      error: readingError,
    } = await supabase
      .from("readings")
      .select("audio_path")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (readingError || !reading?.audio_path) {
      console.error(
        "Could not find audio path:",
        readingError
      );

      return new Response("Audio not found", {
        status: 404,
      });
    }

    // Download the actual MP3 from the private Storage bucket
    const {
      data: audio,
      error: audioError,
    } = await supabase.storage
      .from("reading-audio")
      .download(reading.audio_path);

    if (audioError || !audio) {
      console.error(
        "Could not download audio:",
        audioError
      );

      return new Response("Audio not found", {
        status: 404,
      });
    }

    // Send the MP3 to the browser's audio player
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to serve audio:", error);

    return new Response("Failed to serve audio", {
      status: 500,
    });
  }
}