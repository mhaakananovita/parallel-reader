import { openai } from "@/lib/openai";
import type {
  GenerateReadingRequest,
  Reading,
} from "@/lib/types";

export async function generateReading(
  request: GenerateReadingRequest
): Promise<Reading> {
  const response = await openai.responses.create({
    model: "gpt-6-luna",

    instructions: `
You create short parallel-reading texts for language learners.

Return ONLY valid JSON in this exact shape:

{
  "title": "A title",
  "blocks": [
    {
      "source": "Source-language text",
      "translation": "Matching translation"
    }
  ]
}

Do not return Markdown, code fences, headings, tables, or prose outside the JSON.

Create a coherent text in the requested source language and a faithful
translation in the requested translation language.

Divide both versions into matching blocks.
Each source block must correspond exactly to the translation block
at the same position.

Vary the form and setting of the readings.

Most readings can be narrative prose, but where natural, use dialogue,
conversation, letters, diary entries, interviews, short scenes, or other
simple forms.

Do not make every text resemble a school textbook or informational article.

Prefer concrete situations, people, events, and small stories.

The selected topic is a broad theme, not a required essay subject.

Do not add vocabulary notes, explanations, exercises, pronunciation
guides, quizzes, or teaching commentary.
`,

    input: `
Source language: ${request.sourceLanguage}
Translation language: ${request.translationLanguage}
Topic: ${request.topic}
Level: ${request.level ?? "intermediate"}

Create a short reading of approximately 6 to 10 blocks.
`,
  });

  const generated = JSON.parse(response.output_text) as {
    title: string;
    blocks: Reading["blocks"];
  };

return {
  id: crypto.randomUUID(),
  title: generated.title,
  sourceLanguage: request.sourceLanguage,
  translationLanguage: request.translationLanguage,
  level: request.level ?? "",
  stage: "new",
  notes: "",
  blocks: generated.blocks,
};

}