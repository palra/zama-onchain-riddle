import { useState } from "react";

type RiddleGameState = {
  // riddle?: string;
  contractAddress: string;
} & (
  | { status: "waitingForRiddle" }
  | { status: "guess"; riddle: string }
  | { status: "solved"; riddle: string; winner: string; solution: string }
);

export function useRiddleGame(): RiddleGameState & {
  submissions: string[];
  isSubmitted: (submission: string) => boolean;
  submit: (submission: string) => void;
} {
  const state: RiddleGameState = {
    contractAddress: "",
    riddle: "what is the name of the only son of Bob's father?",
    // status: "waitingForRiddle",
    status: "guess",
    // status: "solved",
    // winner: "test",
    // solution: "bob",
  };

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
