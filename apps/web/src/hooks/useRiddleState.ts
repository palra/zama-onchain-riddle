import { activityFeedReducerAtom } from "@/lib/atoms/activity-feed";
import { submissionsAtom } from "@/lib/atoms/submissions";
import { OnchainRiddle } from "@/lib/contracts";
import { RiddleGameState } from "@/lib/domain";
import { useSetAtom } from "jotai";
import { useRef } from "react";
import { isAddressEqual, zeroAddress } from "viem";
import { useReadContracts, useWatchContractEvent } from "wagmi";

export function useRiddleState() {
  const dispatch = useSetAtom(submissionsAtom);
  const feedDispatch = useSetAtom(activityFeedReducerAtom);

  const contractState = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        ...OnchainRiddle,
        functionName: 'riddle'
      },
      {
        ...OnchainRiddle,
        functionName: 'isActive'
      },
      {
        ...OnchainRiddle,
        functionName: 'winner'
      }
    ],
    query: {
      select([riddle, isActive, winner]): RiddleGameState {
        if (isActive) {
          return { status: 'guess', riddle };
        }

        if (isAddressEqual(winner, zeroAddress)) {
          return { status: 'waitingForRiddle' };
        }

        return { status: 'solved', riddle, winner }
      }
    }
  });

  // Process events
  const idempotencySet = useRef(new Set<string>())
  useWatchContractEvent({
    ...OnchainRiddle,
    onLogs(logs) {
      for (const log of logs) {
        const logTag = `${log.transactionHash}-${log.logIndex}`;
        if (idempotencySet.current.has(logTag)) continue;

        console.debug("OnchainRiddle new contract log", log);

        // For now, handling game state with the same handler used for initial fetching.
        contractState.refetch();

        switch (log.eventName) {
          case 'RiddleSet':
            feedDispatch({ type: 'pushEvent', event: { type: 'newRiddle', riddle: log.args.riddle! } });
            dispatch({ type: 'reset' });
            break;
          case 'AnswerAttempt':
            feedDispatch({
              type: 'pushEvent',
              event: {
                type: 'guess',
                from: log.args.user!,
                isValid: log.args.correct!,
                submission: log.args.answer!
              }
            });
            dispatch({
              type: 'setSubmissionValidityFromTx',
              transactionHash: log.transactionHash,
              isValid: log.args.correct!,
              submission: log.args.answer!,
            });
            break;
          case 'Winner':
            feedDispatch({ type: 'pushEvent', event: { type: 'winner', winner: log.args.user!, answer: log.args.answer! } });
            break;
        }

        idempotencySet.current.add(logTag);
      }
    }
  })

  return {
    ...contractState,
  }
}
