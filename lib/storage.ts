import type { Reading, ReadingStage } from "@/lib/types";

const STORAGE_KEY = "parallel-reader-readings";

export function deleteReading(id: string) {
  const readings = getSavedReadings();

  const updated = readings.filter(
    (reading) => reading.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}

export function getSavedReadings(): Reading[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  const readings = JSON.parse(stored) as Reading[];

  return readings.map((reading) => ({
  ...reading,
  level: reading.level ?? "",
  stage: reading.stage ?? "new",
  notes: reading.notes ?? "",
}));
}

export function saveReading(reading: Reading) {
  const readings = getSavedReadings();

  const updated = [reading, ...readings];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateReadingNotes(
  id: string,
  notes: string
) {
  const readings = getSavedReadings();

  const updated = readings.map((reading) =>
    reading.id === id
      ? { ...reading, notes }
      : reading
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateReadingStage(
  id: string,
  stage: ReadingStage
) {
  const readings = getSavedReadings();

  const updated = readings.map((reading) =>
    reading.id === id
      ? { ...reading, stage }
      : reading
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}