import { Submission } from '@/lib/domain';
import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { keccak256, encodePacked } from 'viem';

// --- Atoms ---
export const submissionsAtom = atomWithImmer<Map<string, Submission>>(new Map());
export const winningSubmissionAtom = atom<string | undefined>(undefined);

// --- Helpers ---
function newSubmission(submission: string): Submission {
  return {
    submission,
    isPending: true,
    hash: keccak256(encodePacked(['string'], [submission])),
  };
}

// --- Actions as atom updaters ---
export const addSubmissionAtom = atom(null, (get, set, submission: string) => {
  set(submissionsAtom, (draft) => {
    if (draft.has(submission)) return;
    draft.set(submission, newSubmission(submission));
  });
});

export const setSubmissionTxHashAtom = atom(
  null,
  (get, set, { submission, transactionHash }: { submission: string; transactionHash: `0x${string}` }) => {
    set(submissionsAtom, (draft) => {
      const sub = draft.get(submission);
      if (sub) {
        sub.receipt = { ...(sub.receipt ?? {}), transactionHash };
      }
    });
  }
);

export const setSubmissionValidityFromTxAtom = atom(
  null,
  (get, set, { submission, transactionHash, isValid }: { submission: string; transactionHash: `0x${string}`; isValid: boolean }) => {
    set(submissionsAtom, (draft) => {
      let sub = draft.get(submission);
      if (!sub) {
        sub = newSubmission(submission);
        draft.set(submission, sub);
      }
      sub.isPending = false;
      sub.receipt = { transactionHash, isValid };
    });
    if (isValid) {
      set(winningSubmissionAtom, submission);
    }
  }
);

export const removeSubmissionAtom = atom(
  null,
  (get, set, submission: string) => {
    set(submissionsAtom, (draft) => {
      draft.delete(submission);
    });
  }
);

export const resetSubmissionsAtom = atom(null, (get, set) => {
  set(submissionsAtom, (draft) => {
    draft.clear();
  });
  set(winningSubmissionAtom, undefined);
});

// --- Selectors ---
export const isSubmittedAtom = atom(
  (get) => (submission: string) => get(submissionsAtom).has(submission)
);

export const submissionsSizeAtom = atom(
  (get) => get(submissionsAtom).size
);

