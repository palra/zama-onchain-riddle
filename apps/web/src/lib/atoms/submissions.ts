import { Submission } from '@/lib/domain';
import { atom } from 'jotai';
import { encodePacked, keccak256 } from 'viem';

export const submissionsAtom = atom(new Map<string, Submission>());
export const submissionsByTxHashAtom = atom(new Map<`0x${string}`, string>());

export const addSubmissionAtom = atom(
  null,
  (get, set, { submission }: { submission: string }) => {
    const current = get(submissionsAtom);
    if (!current.has(submission)) {
      set(
        submissionsAtom,
        new Map(current)
          .set(submission, {
            submission,
            isPending: true,
            hash: keccak256(encodePacked(['string'], [submission]))
          })
      );
    }
  }
);

export const setSubmissionConfirmedAtom = atom(
  null,
  (get, set, { submission, transactionHash }: { submission: string; transactionHash: `0x${string}` }) => {
    const current = get(submissionsAtom);
    if (!current.has(submission)) {
      return;
    }

    const updated = new Map(current);
    const existing = updated.get(submission)!;
    updated.set(submission, { ...existing, isPending: false, receipt: { transactionHash }});
    
    const txHashMap = get(submissionsByTxHashAtom);
    set(submissionsByTxHashAtom, new Map(txHashMap).set(transactionHash, submission));
    set(submissionsAtom, updated);
  }
);

export const setSubmissionValidityByTxAtom = atom(
  null,
  (get, set, { transactionHash, isValid }: { transactionHash: `0x${string}`; isValid: boolean }) => {
    const txHashMap = get(submissionsByTxHashAtom);
    const submission = txHashMap.get(transactionHash);
    if (!submission) return;

    const current = get(submissionsAtom);
    if (!current.has(submission)) return;

    const updated = new Map(current);
    const existing = updated.get(submission);
    if (!existing) return;
    updated.set(submission, {
      ...existing,
      receipt: {
        transactionHash,
        isValid,
      },
    });

    set(submissionsAtom, updated);
  }
)

export const removeSubmissionAtom = atom(
  null,
  (get, set, { submission }: { submission: string }) => {
    const updated = new Map(get(submissionsAtom));
    const existed = updated.delete(submission);

    set(submissionsAtom, updated);
    return existed;
  }
)

export const resetSubmissionsAtom = atom(
  null,
  (get, set) => {
    set(submissionsAtom, new Map());
    set(submissionsByTxHashAtom, new Map());
  }
);

export const isSubmittedAtom = atom(
  (get) => (submission: string) => get(submissionsAtom).has(submission)
); 

export const submissionsSizeAtom = atom((get) => get(submissionsAtom).size);

