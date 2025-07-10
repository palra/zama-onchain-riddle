import { useState } from "react";

type RiddleGameState = {
  riddle?: string;
  contractAddress: string;
} & (
  | { status: "waitingForRiddle" }
  | { status: "guess"; riddle: string }
  | { status: "solved"; riddle: string; winner: string; solution: string }
);

export function useRiddleGame() {
  const state: RiddleGameState = {
    contractAddress: "",
    riddle: "what is the name of the only son of Bob's father?",
    status: "waitingForRiddle",
  } as RiddleGameState;

  const [submittedSet, setSubmittedSet] = useState<Set<string>>(
    () => new Set([])
  );

  const isSubmitted = (submission: string) => {
    return Array.from(submittedSet).some((s) => s === submission);
  };

  const submit = (submission: string) => {
    if (!isSubmitted(submission)) {
      setSubmittedSet((prev) => new Set([...prev, submission]));
    }
  };

  return {
    ...state,
    submissions: Array.from(submittedSet),
    submit,
    isSubmitted,
  };
}
