import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Reading } from "@/lib/types";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const readings = data.map((row) => ({
      id: row.id,
      title: row.title,
      sourceLanguage: row.source_language,
      translationLanguage: row.translation_language,
      stage: row.stage,
      notes: row.notes,
      blocks: row.blocks,
    }));

    return NextResponse.json(readings);
  } catch (error) {
    console.error("Failed to load readings:", error);

    return NextResponse.json(
      { error: "Failed to load readings." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const reading = (await request.json()) as Reading;

    const { data, error } = await supabase
      .from("readings")
      .insert({
        id: reading.id,
        user_id: user.id,
        title: reading.title,
        source_language: reading.sourceLanguage,
        translation_language: reading.translationLanguage,
        stage: reading.stage,
        notes: reading.notes,
        blocks: reading.blocks,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Failed to save reading:", error);

    return NextResponse.json(
      { error: "Failed to save reading." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { id, stage, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Reading id is required." },
        { status: 400 }
      );
    }

    const updates: {
      stage?: string;
      notes?: string;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (stage !== undefined) {
      updates.stage = stage;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from("readings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update reading:", error);

    return NextResponse.json(
      { error: "Failed to update reading." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Reading id is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
  .from("readings")
  .delete()
  .eq("id", id)
  .select("id");

    if (error) {
      throw error;
    }

if (!data || data.length === 0) {
  return NextResponse.json(
    { error: "Reading not found or not permitted." },
    { status: 404 }
  );
}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete reading:", error);

    return NextResponse.json(
      { error: "Failed to delete reading." },
      { status: 500 }
    );
  }
}