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
      <input
        value={topic}
        onChange={(event) =>
          onTopicChange(event.target.value)
        }
      />
    </label>
  </div>

  <div className={styles.field}>
    <label>
      Level
      <input
        value={level}
        onChange={(event) =>
          onLevelChange(event.target.value)
        }
      />
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