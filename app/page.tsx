"use client";

"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";
import type { Reading } from "@/lib/types";
import { getSavedReadings, saveReading, updateReadingNotes, updateReadingStage, } from "@/lib/storage";
import GeneratorForm from "@/components/GeneratorForm";
import Library from "@/components/Library";
import Reader from "@/components/Reader";

type View = "library" | "new" | "reader";

export default function Home() {
  const [sourceLanguage, setSourceLanguage] = useState("French");
  const [translationLanguage, setTranslationLanguage] = useState("Swedish");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("B1");
const [view, setView] = useState<View>("library");

  const [reading, setReading] = useState<Reading | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const [audioUrl, setAudioUrl] = useState<string | null>(null);
const [audioLoading, setAudioLoading] = useState(false);
const [savedReadings, setSavedReadings] = useState<Reading[]>([]);

useEffect(() => {
  setSavedReadings(getSavedReadings());
}, []);
useEffect(() => {
  setAudioUrl(null);
}, [reading?.id]);
useEffect(() => {
  return () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };
}, [audioUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setReading(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLanguage,
          translationLanguage,
          topic,
          level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setReading(data);
saveReading(data);
setSavedReadings(getSavedReadings());
setView("reader");

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }
async function generateAudio() {
  if (!reading) {
    return;
  }

  setAudioLoading(true);
  setError("");

  try {
    const sourceText = reading.blocks
      .map((block) => block.source)
      .join("\n\n");

    const response = await fetch("/api/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: sourceText,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate audio.");
    }

    const audioBlob = await response.blob();
    const url = URL.createObjectURL(audioBlob);

    setAudioUrl(url);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Something went wrong.");
    }
  } finally {
    setAudioLoading(false);
  }
}

function changeNotes(notes: string) {
  if (!reading) {
    return;
  }

  const updatedReading = {
    ...reading,
    notes,
  };

  setReading(updatedReading);
  updateReadingNotes(reading.id, notes);
  setSavedReadings(getSavedReadings());
}

function changeStage(stage: Reading["stage"]) {
  if (!reading) {
    return;
  }

  const updatedReading = {
    ...reading,
    stage,
  };

  setReading(updatedReading);
  updateReadingStage(reading.id, stage);
  setSavedReadings(getSavedReadings());
}

  return (
    <main className={styles.page}>
<nav className={styles.nav}>
  <button
    className={view === "library" ? styles.activeNav : ""}
    onClick={() => setView("library")}
  >
    Library
  </button>

  <button
    className={view === "new" ? styles.activeNav : ""}
    onClick={() => setView("new")}
  >
    New reading
  </button>
</nav>
      <h1>Parallel Reader</h1>

{view === "library" && (
  <Library
    readings={savedReadings}
    onSelect={(selectedReading) => {
      setReading(selectedReading);
      setView("reader");
    }}
  />
)}

{view === "new" && (
  <GeneratorForm
    sourceLanguage={sourceLanguage}
    translationLanguage={translationLanguage}
    topic={topic}
    level={level}
    loading={loading}
    onSourceLanguageChange={setSourceLanguage}
    onTranslationLanguageChange={setTranslationLanguage}
    onTopicChange={setTopic}
    onLevelChange={setLevel}
    onSubmit={handleSubmit}
  />
)}

{view === "reader" && reading && (
  <Reader
    reading={reading}
    audioUrl={audioUrl}
    audioLoading={audioLoading}
    onGenerateAudio={generateAudio}
    onStageChange={changeStage}
    onNotesChange={changeNotes}
  />
)}
{view === "reader" && !reading && (
  <Library
    readings={savedReadings}
    onSelect={(selectedReading) => {
      setReading(selectedReading);
      setView("reader");
    }}
  />
)}
    </main>
  );
}