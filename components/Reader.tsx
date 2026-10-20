import type { Reading } from "@/lib/types";
import styles from "./Reader.module.css";

type ReaderProps = {
  reading: Reading;
  audioUrl: string | null;
  audioLoading: boolean;
  onGenerateAudio: () => void;
  onStageChange: (stage: Reading["stage"]) => void;
  onNotesChange: (notes: string) => void;
};

export default function Reader({
  reading,
  audioUrl,
  audioLoading,
  onGenerateAudio,
  onStageChange,
  onNotesChange,
}: ReaderProps) {
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
            <option value="parallel-reading">Parallel reading</option>
            <option value="analysis">Analysis</option>
            <option value="review">Review</option>
          </select>
        </div>
      </div>

      <div className={styles.notes}>
        <label>Notes</label>

        <textarea
          value={reading.notes}
          onChange={(event) => onNotesChange(event.target.value)}
          rows={5}
          placeholder="Add notes about this reading..."
        />
      </div>

      <div className={styles.audio}>
        <button onClick={onGenerateAudio} disabled={audioLoading}>
          {audioLoading
            ? "Generating audio..."
            : `Generate ${reading.sourceLanguage} audio`}
        </button>

        {audioUrl && (
          <audio controls src={audioUrl}>
            Your browser does not support audio playback.
          </audio>
        )}
      </div>

      <div className={styles.languageHeaders}>
        <strong>{reading.sourceLanguage}</strong>
        <strong>{reading.translationLanguage}</strong>
      </div>

      <div className={styles.reading}>
        {reading.blocks.map((block, index) => (
          <div className={styles.block} key={index}>
            <p>{block.source}</p>
            <p>{block.translation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}