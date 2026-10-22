"use client";

"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";
import type { Reading } from "@/lib/types";
import { deleteReading, getSavedReadings, saveReading, updateReadingNotes, updateReadingStage, } from "@/lib/storage";
import GeneratorForm from "@/components/GeneratorForm";
import Library from "@/components/Library";
import Reader from "@/components/Reader";

type View = "home" | "library" | "new" | "reader";

export default function Home() {
  const [sourceLanguage, setSourceLanguage] = useState("French");
  const [translationLanguage, setTranslationLanguage] = useState("Swedish");
  const [level, setLevel] = useState("");
const [view, setView] = useState<View>("home");

  const [reading, setReading] = useState<Reading | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const [audioUrl, setAudioUrl] = useState<string | null>(null);
const [audioLoading, setAudioLoading] = useState(false);
const [savedReadings, setSavedReadings] = useState<Reading[]>([]);
const [topic, setTopic] = useState("Everyday life");

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

function removeReading(id: string) {
  deleteReading(id);
  setSavedReadings(getSavedReadings());

  if (reading?.id === id) {
    setReading(null);
    setView("library");
  }
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
    {/* This branding appears on every view */}
    <header className={styles.brand}>
      <p className={styles.eyebrow}>
        Language learning, stripped down
      </p>
      <h1>EchoText</h1>
    </header>

    <nav className={styles.nav}>
      <button
        className={view === "home" ? styles.activeNav : ""}
        onClick={() => setView("home")}
      >
        Home
      </button>

      <button
        className={view === "library" ? styles.activeNav : ""}
        onClick={() => setView("library")}
      >
        Library
      </button>

      <button
        className={view === "new" ? styles.activeNav : ""}
        onClick={() => {
          setTopic("Everyday life");
          setLevel("");
          setView("new");
        }}
      >
        New reading
      </button>
    </nav>

    {/* Everything below here appears ONLY on Home */}
    {view === "home" && (
      <section className={styles.home}>
        <div className={styles.hero}>
          <p className={styles.lead}>
            Read a text. Compare it with a translation. Listen to it.
            Come back to it a few times. That&apos;s basically the idea.
          </p>

          <p>
            EchoText is a deliberately simple tool for learning languages
            through reading, listening and repetition — without turning
            every sentence into a quiz.
          </p>
        </div>

        <div className={styles.homeActions}>
          <button
            className={styles.primaryButton}
            onClick={() => {
              setTopic("");
              setLevel("");
              setView("new");
            }}
          >
            New reading
          </button>

          <button
            className={styles.secondaryButton}
            onClick={() => setView("library")}
          >
            Library
          </button>
        </div>

        <div className={styles.features}>
          <h2>What it does</h2>

          <ul>
            <li>Creates short texts at roughly the level you choose.</li>
            <li>Shows source text and translation side by side.</li>
            <li>Generates audio for listening and shadowing.</li>
            <li>Saves readings so you can return to them later.</li>
            <li>
              Lets you keep simple notes and track where you are with a text.
            </li>
          </ul>
        </div>

        <div className={styles.faq}>
          <h2>Small FAQ</h2>

          <details>
            <summary>Is this another language-learning course?</summary>
            <p>
              No. It does not teach a fixed curriculum. Think of it more
              as a reading and listening workbench.
            </p>
          </details>

          <details>
            <summary>Does it explain every word?</summary>
            <p>
              Nope. The translation is there when you need it, but the
              point is to spend time with the text rather than click every
              unfamiliar word.
            </p>
          </details>

          <details>
            <summary>Are there quizzes, streaks and points?</summary>
            <p>
              Not at the moment, and that is fairly intentional. Reading
              a decent story is allowed to be enough.
            </p>
          </details>

          <details>
            <summary>Is the translation always perfect?</summary>
            <p>
              No. The texts and translations are AI-generated, so
              occasional oddities are possible. Treat them as learning
              material, not sacred scripture.
            </p>
          </details>

          <details>
            <summary>What is it actually good for?</summary>
            <p>
              Repeated reading, listening, shadowing and getting comfortable
              with real sentences in context — especially when used alongside
              grammars, exercise books and other less glamorous but useful
              things.
            </p>
          </details>
        </div>
      </section>
    )}

    {view === "library" && (
      <Library
        readings={savedReadings}
        onSelect={(selectedReading) => {
          setReading(selectedReading);
          setView("reader");
        }}
        onDelete={removeReading}
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
        onDelete={removeReading}
      />
    )}
  </main>
)}