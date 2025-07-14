import { atom } from 'jotai';
import { atomWithReducer } from 'jotai/utils';
import { produce } from 'immer';
import { encodePacked, keccak256 } from 'viem';
import { Submission } from '@/lib/domain';
import { match } from 'ts-pattern';

// --- Types ---
type SubmissionMap = Map<string, Submission>;
type TxDataMap = Map<`0x${string}`, { submission?: string; isValid?: boolean }>;

type State = {
  submissions: SubmissionMap;
  txData: TxDataMap;
};

type Action =
  | { type: 'addSubmission'; submission: string }
  | { type: 'setSubmissionTxHash'; submission: string; transactionHash: `0x${string}` }
  | { type: 'setSubmissionValidityByTx'; transactionHash: `0x${string}`; isValid: boolean }
  | { type: 'removeSubmission'; submission: string }
  | { type: 'reset' };


const reducer = produce((draft: State, action: Action) => {
  match(action)
    .with({ type: 'addSubmission' }, ({ submission }) => {
      if (draft.submissions.has(submission)) return;
      draft.submissions.set(submission, {
        submission,
        isPending: true,
        hash: keccak256(encodePacked(['string'], [submission])),
      });
    })
    .with({ type: 'setSubmissionTxHash' }, ({ submission, transactionHash }) => {
      const sub = draft.submissions.get(submission);
      if (sub) {
        sub.transactionHash = transactionHash;
      }

      const tx = draft.txData.get(transactionHash) || {};
      draft.txData.set(transactionHash, { ...tx, submission });
    })
    .with({ type: 'setSubmissionValidityByTx' }, ({ transactionHash, isValid }) => {
      const txData = draft.txData.get(transactionHash) || {};
      draft.txData.set(transactionHash, { ...txData, isValid });

      if (!txData.submission) return;

      const sub = draft.submissions.get(txData.submission);
      if (!sub) return;

      sub.isPending = false;
      sub.receipt = {
        transactionHash,
        isValid,
      };
    })
    .with({ type: 'removeSubmission' }, ({ submission }) => {
      draft.submissions.delete(submission);
    })
    .with({ type: 'reset' }, () => {
      draft.submissions = new Map();
      draft.txData = new Map();
    })
    .exhaustive();
});

// --- Atom with Immer Reducer ---
const initialState: State = {
  submissions: new Map(),
  txData: new Map(),
};

export const submissionsAtom = atomWithReducer(initialState, reducer);

// --- Selectors ---
export const getSubmissionValidityAtom = atom(
  (get) => (submission: string) => {
    const { submissions, txData } = get(submissionsAtom) as State;
    const sub = submissions.get(submission);
    if (!sub || !sub.transactionHash) return undefined;
    return txData.get(sub.transactionHash)?.isValid;
  }
);

export const getValidityByTxAtom = atom(
  (get) => (transactionHash: `0x${string}`) => {
    const { txData } = get(submissionsAtom) as State;
    return txData.get(transactionHash)?.isValid;
  }
);

export const isSubmittedAtom = atom(
  (get) => (submission: string) => (get(submissionsAtom) as State).submissions.has(submission)
);

export const submissionsSizeAtom = atom(
  (get) => (get(submissionsAtom) as State).submissions.size
);

