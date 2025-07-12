import { useState } from "react";

export function useSubmissions() {
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
    submissions: Array.from(submittedSet),
    submit,
    isSubmitted,
  };
}
