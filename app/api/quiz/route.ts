import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sourceLanguage = body.sourceLanguage;
    const level = body.level;
    const blocks = body.blocks;

    if (!sourceLanguage) {
      return Response.json(
        { error: "Source language is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(blocks) || blocks.length === 0) {
      return Response.json(
        { error: "Reading text is required." },
        { status: 400 }
      );
    }

    const sourceText = blocks
      .map((block: { source?: string }) => block.source)
      .filter(Boolean)
      .join("\n\n");

    if (!sourceText.trim()) {
      return Response.json(
        { error: "Reading text is required." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-6-luna",

      input: [
        {
          role: "developer",
          content: `
You create short reading-comprehension quizzes for language learners.

Create exactly five multiple-choice questions based only on the content of the supplied reading.

Rules:
- Test comprehension of the story or text only.
- Do not test grammar.
- Do not test vocabulary definitions.
- Do not ask for translations.
- Write every question in the source language.
- Write every answer option in the source language.
- Give exactly three answer options per question.
- Exactly one option must be correct.
- The two wrong options must be plausible but clearly contradicted by, or unsupported by, the reading.
- Questions must be answerable from the reading alone.
- Cover different parts or ideas from the reading rather than asking five versions of the same question.
- Keep the language appropriate for the learner's stated level.
          `.trim(),
        },
        {
          role: "user",
          content: `
Source language: ${sourceLanguage}
Learner level: ${level || "not specified"}

Reading:

${sourceText}
          `.trim(),
        },
      ],

      text: {
        format: {
          type: "json_schema",
          name: "reading_quiz",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              questions: {
                type: "array",
                minItems: 5,
                maxItems: 5,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    question: {
                      type: "string",
                    },
                    options: {
                      type: "array",
                      minItems: 3,
                      maxItems: 3,
                      items: {
                        type: "string",
                      },
                    },
                    correctIndex: {
                      type: "integer",
                      enum: [0, 1, 2],
                    },
                  },
                  required: [
                    "question",
                    "options",
                    "correctIndex",
                  ],
                },
              },
            },
            required: ["questions"],
          },
        },
      },
    });

    const quiz = JSON.parse(response.output_text);

    return Response.json(quiz);
  } catch (error) {
    console.error("Failed to generate quiz:", error);

    return Response.json(
      { error: "Failed to generate quiz." },
      { status: 500 }
    );
  }
}