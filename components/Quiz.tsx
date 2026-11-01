"use client";

import { useEffect, useState } from "react";
import type { Quiz as QuizType } from "@/lib/types";
import styles from "./Quiz.module.css";

type QuizProps = {
  quiz: QuizType;
  onTryAnother: () => void;
  loading: boolean;
};

export default function Quiz({
  quiz,
  onTryAnother,
  loading,
}: QuizProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(quiz.questions.length).fill(null)
  );

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAnswers(
      Array(quiz.questions.length).fill(null)
    );
    setChecked(false);
  }, [quiz]);

  const allAnswered = answers.every(
    (answer) => answer !== null
  );

  const score = quiz.questions.reduce(
    (total, question, index) =>
      answers[index] === question.correctIndex
        ? total + 1
        : total,
    0
  );

  function chooseAnswer(
    questionIndex: number,
    optionIndex: number
  ) {
    if (checked) {
      return;
    }

    setAnswers((current) => {
      const updated = [...current];
      updated[questionIndex] = optionIndex;
      return updated;
    });
  }

  return (
    <section className={styles.quiz}>
      <div className={styles.header}>
        <h3>Quiz</h3>

        {!checked && (
          <p>
            Answer all five questions, then check your answers.
          </p>
        )}

        {checked && (
          <p className={styles.score}>
            {score} / {quiz.questions.length} correct
          </p>
        )}
      </div>

      <div className={styles.questions}>
        {quiz.questions.map((question, questionIndex) => {
          const selectedAnswer = answers[questionIndex];

          return (
            <div
              className={styles.question}
              key={questionIndex}
            >
              <p className={styles.questionText}>
                <strong>{questionIndex + 1}.</strong>{" "}
                {question.question}
              </p>

              <div className={styles.options}>
                {question.options.map(
                  (option, optionIndex) => {
                    const isSelected =
                      selectedAnswer === optionIndex;

                    const isCorrect =
                      question.correctIndex === optionIndex;

                    const showCorrect =
                      checked && isCorrect;

                    const showIncorrect =
                      checked &&
                      isSelected &&
                      !isCorrect;

                    const optionClassName = [
                      styles.option,
                      showCorrect ? styles.correct : "",
                      showIncorrect
                        ? styles.incorrect
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <label
                        className={optionClassName}
                        key={optionIndex}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={isSelected}
                          disabled={checked}
                          onChange={() =>
                            chooseAnswer(
                              questionIndex,
                              optionIndex
                            )
                          }
                        />

                        <span>{option}</span>
                      </label>
                    );
                  }
                )}
              </div>

              {checked &&
                selectedAnswer !==
                  question.correctIndex && (
                  <p className={styles.feedback}>
                    Correct answer:{" "}
                    {
                      question.options[
                        question.correctIndex
                      ]
                    }
                  </p>
                )}
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        {!checked && (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => setChecked(true)}
          >
            Check answers
          </button>
        )}

        {checked && (
          <button
            type="button"
            onClick={onTryAnother}
            disabled={loading}
          >
            {loading
              ? "Generating new quiz..."
              : "Try another quiz"}
          </button>
        )}
      </div>
    </section>
  );
}