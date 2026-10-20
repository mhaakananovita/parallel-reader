"use client";

import { useState } from "react";
import type { Reading } from "@/lib/types";
import styles from "./Library.module.css";

type LibraryProps = {
  readings: Reading[];
  onSelect: (reading: Reading) => void;
  onDelete: (id: string) => void;
};

export default function Library({
  readings,
  onSelect,
  onDelete,
}: LibraryProps) {
  const [languageFilter, setLanguageFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  const sourceLanguages = Array.from(
    new Set(readings.map((reading) => reading.sourceLanguage))
  ).sort();

  const filteredReadings = readings.filter((reading) => {
    const matchesLanguage =
      languageFilter === "all" ||
      reading.sourceLanguage === languageFilter;

    const matchesStage =
      stageFilter === "all" ||
      reading.stage === stageFilter;

    return matchesLanguage && matchesStage;
  });

  return (
    <section className={styles.library}>
      <h2>Library</h2>

      <div className={styles.filters}>
        <label>
          Source language
          <select
            value={languageFilter}
            onChange={(event) =>
              setLanguageFilter(event.target.value)
            }
          >
            <option value="all">All languages</option>

            {sourceLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>

        <label>
          Stage
          <select
            value={stageFilter}
            onChange={(event) =>
              setStageFilter(event.target.value)
            }
          >
            <option value="all">All stages</option>
            <option value="new">New</option>
            <option value="shadowing">Shadowing</option>
            <option value="parallel-reading">
              Parallel reading
            </option>
            <option value="analysis">Analysis</option>
            <option value="review">Review</option>
          </select>
        </label>
      </div>

      {readings.length === 0 ? (
        <p>No saved readings yet.</p>
      ) : filteredReadings.length === 0 ? (
        <p>No readings match these filters.</p>
      ) : (
        <div className={styles.list}>
          {filteredReadings.map((reading) => (
            <div className={styles.item} key={reading.id}>
              <button
                className={styles.titleButton}
                onClick={() => onSelect(reading)}
              >
                {reading.title}
                {reading.level && ` (${reading.level})`}{" "}
                <span className={styles.stage}>
                  — {reading.stage}
                </span>
              </button>

              <button
                className={styles.deleteButton}
                onClick={() => {
                  const confirmed = window.confirm(
                    `Delete "${reading.title}"?`
                  );

                  if (confirmed) {
                    onDelete(reading.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}