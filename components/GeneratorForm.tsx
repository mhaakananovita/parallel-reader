type GeneratorFormProps = {
  sourceLanguage: string;
  translationLanguage: string;
  topic: string;
  level: string;
  loading: boolean;
  onSourceLanguageChange: (value: string) => void;
  onTranslationLanguageChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

import styles from "./GeneratorForm.module.css";

export default function GeneratorForm({
  sourceLanguage,
  translationLanguage,
  topic,
  level,
  loading,
  onSourceLanguageChange,
  onTranslationLanguageChange,
  onTopicChange,
  onLevelChange,
  onSubmit,
}: GeneratorFormProps) {
  return (
<form onSubmit={onSubmit} className={styles.form}>
  <div className={styles.field}>
    <label>
      Source language
      <input
        value={sourceLanguage}
        onChange={(event) =>
          onSourceLanguageChange(event.target.value)
        }
      />
    </label>
  </div>

  <div className={styles.field}>
    <label>
      Translation language
      <input
        value={translationLanguage}
        onChange={(event) =>
          onTranslationLanguageChange(event.target.value)
        }
      />
    </label>
  </div>

<div className={styles.field}>
  <label>
    Topic
    <select
      value={topic}
      onChange={(event) => onTopicChange(event.target.value)}
    >
      <option value="Everyday life">Everyday life</option>
      <option value="History">History</option>
      <option value="Society">Society</option>
      <option value="Food & drink">Food & drink</option>
      <option value="Travel">Travel</option>
      <option value="Work">Work</option>
      <option value="Culture">Culture</option>
      <option value="Nature">Nature</option>
      <option value="Science & technology">
        Science & technology
      </option>
      <option value="Sports">Sports</option>
      <option value="People & relationships">
        People & relationships
      </option>
      <option value="Mystery / unusual events">
        Mystery / unusual events
      </option>
    </select>
  </label>
</div>
<div className={styles.field}>
  <label>
    Level
    <select
      value={level}
      onChange={(event) =>
        onLevelChange(event.target.value)
      }
    >
      <option value="">--</option>
      <option value="A1">A1</option>
      <option value="A2">A2</option>
      <option value="B1">B1</option>
      <option value="B2">B2</option>
      <option value="C1">C1</option>
      <option value="C2">C2</option>
    </select>
  </label>
</div>

  <div className={styles.buttonRow}>
    <button
      className={styles.button}
      type="submit"
      disabled={loading}
    >
      {loading ? "Generating..." : "Generate"}
    </button>
  </div>
</form>  );
}