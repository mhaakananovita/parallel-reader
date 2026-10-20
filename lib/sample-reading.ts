import { Reading } from "./types";

export const sampleReading: Reading = {
  id: "sample-1",
  title: "A Train Journey",
  sourceLanguage: "French",
  translationLanguage: "Swedish",
  blocks: [
    {
      source: "Le train quitte lentement la gare.",
      translation: "Tåget lämnar långsamt stationen.",
    },
    {
      source: "La pluie frappe les fenêtres.",
      translation: "Regnet slår mot fönstren.",
    },
  ],
};