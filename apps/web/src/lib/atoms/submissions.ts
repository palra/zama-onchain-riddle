import { Submission } from '@/lib/domain';
import { produce } from 'immer';
import { atom } from 'jotai';
import { atomWithReducer } from 'jotai/utils';
import { match } from 'ts-pattern';
import { encodePacked, keccak256 } from 'viem';

// --- Types ---
type SubmissionMap = Map<string, Submission>;
type TxDataMap = Map<`0x${string}`, { submission?: string; isValid?: boolean }>;

type State = {
  submissions: SubmissionMap;
  txData: TxDataMap;
  winningSubmission?: string;
};

type Action =
  | { type: 'addSubmission'; submission: string }
  | { type: 'setSubmissionTxHash'; submission: string; transactionHash: `0x${string}` }
  | { type: 'setSubmissionValidityFromTx'; transactionHash: `0x${string}`; isValid: boolean; submission: string }
  | { type: 'removeSubmission'; submission: string }
  | { type: 'reset' };

function newSubmission(submission: string): Submission {
  return {
    submission,
    isPending: true,
    hash: keccak256(encodePacked(['string'], [submission])),
  }
}


const reducer = produce((draft: State, action: Action) => {
  match(action)
    .with({ type: 'addSubmission' }, ({ submission }) => {
      if (draft.submissions.has(submission)) return;
      draft.submissions.set(submission, newSubmission(submission));
    })
    .with({ type: 'setSubmissionTxHash' }, ({ submission, transactionHash }) => {
      const sub = draft.submissions.get(submission);
      if (sub) {
        sub.receipt = {
          ...(sub.receipt ?? {}),
          transactionHash,
        };
      }
    })
    .with({ type: 'setSubmissionValidityFromTx' }, ({ transactionHash, isValid, submission }) => {
      if (!draft.submissions.has(submission)) {
        draft.submissions.set(submission, newSubmission(submission));
      }

      const sub = draft.submissions.get(submission)!;

      sub.submission = submission;
      sub.isPending = false;
      sub.receipt = {
        transactionHash,
        isValid,
      };

      if (isValid) {
        draft.winningSubmission = submission;
      }
    })
    .with({ type: 'removeSubmission' }, ({ submission }) => {
      draft.submissions.delete(submission);
    })
    .with({ type: 'reset' }, () => {
      draft.submissions = new Map();
      draft.txData = new Map();
      draft.winningSubmission = undefined;
    })
    .exhaustive();
});

// --- Atom with Immer Reducer ---
const initialState: State = {
  submissions: new Map(),
  txData: new Map(),
  winningSubmission: undefined
};

export const submissionsAtom = atomWithReducer(initialState, reducer);
export const winningSubmissionAtom = atom((get) => get(submissionsAtom).winningSubmission);

// --- Selectors ---
export const getSubmissionValidityAtom = atom(
  (get) => (submission: string) =>
    get(submissionsAtom).submissions.get(submission)?.receipt?.isValid
);

export const isSubmittedAtom = atom(
  (get) => (submission: string) => (get(submissionsAtom) as State).submissions.has(submission)
);

export const submissionsSizeAtom = atom(
  (get) => (get(submissionsAtom) as State).submissions.size
);

