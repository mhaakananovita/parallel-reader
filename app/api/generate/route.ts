import { NextResponse } from "next/server";
import { generateReading } from "@/lib/generate-reading";
import type { GenerateReadingRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateReadingRequest;

    if (
      !body.sourceLanguage?.trim() ||
      !body.translationLanguage?.trim() ||
      !body.topic?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "sourceLanguage, translationLanguage, and topic are required.",
        },
        {
          status: 400,
        }
      );
    }

    const reading = await generateReading(body);

    return NextResponse.json(reading);
  } catch (error) {
    console.error("Failed to generate reading:", error);

    return NextResponse.json(
      {
        error: "Failed to generate reading.",
      },
      {
        status: 500,
      }
    );
  }
}