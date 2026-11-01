import type { Quiz as QuizType, Reading } from "@/lib/types";
import styles from "./Reader.module.css";
import { useState } from "react";
import Quiz from "@/components/Quiz";

type ReaderProps = {
  reading: Reading;
  audioUrl: string | null;
  audioLoading: boolean;
  quiz: QuizType | null;
  quizLoading: boolean;
  onGenerateAudio: () => void;
  onGenerateQuiz: () => void;
  onStageChange: (stage: Reading["stage"]) => void;
  onNotesChange: (notes: string) => void;
};

export default function Reader({
  reading,
  audioUrl,
  audioLoading,
  quiz,
  quizLoading,
  onGenerateAudio,
  onGenerateQuiz,
  onStageChange,
  onNotesChange,
}: ReaderProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);

  return (
    <section className={styles.reader}>
      <h2 className={styles.title}>{reading.title}</h2>

      <div className={styles.meta}>
        <div className={styles.field}>
          <label>Stage</label>

          <select
            value={reading.stage}
            onChange={(event) =>
              onStageChange(event.target.value as Reading["stage"])
            }
          >
            <option value="new">New</option>
            <option value="shadowing">Shadowing</option>
            <option value="parallel-reading">
              Parallel reading
            </option>
            <option value="analysis">Analysis</option>
            <option value="scriptorium">Scriptorium</option>
            <option value="review">Review</option>
          </select>
        </div>
      </div>

      <button
        className={styles.notesButton}
        onClick={() => setNotesOpen(true)}
        type="button"
      >
        Notes
      </button>

      {notesOpen && (
        <div className={styles.notesPanel}>
          <div className={styles.notesPanelHeader}>
            <h3>Notes</h3>

            <button
              className={styles.closeButton}
              type="button"
              onClick={() => setNotesOpen(false)}
            >
              Close
            </button>
          </div>

          <textarea
            value={reading.notes ?? ""}
            onChange={(event) =>
              onNotesChange(event.target.value)
            }
            rows={12}
            placeholder="Add notes about this reading..."
          />
        </div>
      )}

      <div className={styles.audio}>
        {!audioUrl && (
          <button
            type="button"
            onClick={onGenerateAudio}
            disabled={audioLoading}
          >
            {audioLoading
              ? "Generating audio..."
              : `Generate ${reading.sourceLanguage} audio`}
          </button>
        )}

        {audioUrl && (
          <audio
            controls
            preload="metadata"
            src={audioUrl}
          >
            Your browser does not support audio playback.
          </audio>
        )}
      </div>

      <button
        className={styles.translationButton}
        type="button"
        onClick={() =>
          setShowTranslation((current) => !current)
        }
      >
        {showTranslation
          ? "Hide translation"
          : "Show translation"}
      </button>

      <div className={styles.languageHeaders}>
        <strong>{reading.sourceLanguage}</strong>

        {showTranslation && (
          <strong>{reading.translationLanguage}</strong>
        )}
      </div>

      <div className={styles.reading}>
        {reading.blocks.map((block, index) => (
          <div
            className={`${styles.block} ${
              !showTranslation ? styles.sourceOnly : ""
            }`}
            key={index}
          >
            <p>{block.source}</p>

            {showTranslation && (
              <p>{block.translation}</p>
            )}
          </div>
        ))}
      </div>

      <div className={styles.quizArea}>
        {!quiz && (
          <button 
  className={styles.quizButton}
            type="button"
            onClick={onGenerateQuiz}
            disabled={quizLoading}
          >
            {quizLoading
              ? "Generating quiz..."
              : "Quiz this reading"}
          </button>
        )}

        {quiz && (
          <Quiz
            quiz={quiz}
            onTryAnother={onGenerateQuiz}
            loading={quizLoading}
          />
        )}
      </div>
    </section>
  );
}