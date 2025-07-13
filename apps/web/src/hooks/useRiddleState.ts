import { pushEventAtom } from "@/lib/atoms/activity-feed";
import { resetSubmissionsAtom, setSubmissionValidityByTxAtom } from "@/lib/atoms/submissions";
import { OnchainRiddle } from "@/lib/contracts";
import { RiddleGameState } from "@/lib/domain";
import { useAtom } from "jotai";
import { useRef } from "react";
import { isAddressEqual, zeroAddress } from "viem";
import { useReadContracts, useWatchContractEvent } from "wagmi";

export function useRiddleState() {
  const [, resetSubmissions] = useAtom(resetSubmissionsAtom);
  const [, setSubmissionValidityByTx] = useAtom(setSubmissionValidityByTxAtom);

  const [, pushEvent] = useAtom(pushEventAtom);

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

        console.info("OnchainRiddle new contract log", log);

        // For now, handling game state with the same handler used for initial fetching.
        contractState.refetch();

        switch (log.eventName) {
          case 'RiddleSet':
            pushEvent({ type: 'newRiddle', riddle: log.args.riddle! });
            resetSubmissions();
            break;
          case 'AnswerAttempt':
            pushEvent({ type: 'guess', from: log.args.user!, isValid: log.args.correct! });
            if (typeof log.args.correct !== "undefined") {
              setSubmissionValidityByTx({
                transactionHash: log.transactionHash,
                isValid: log.args.correct
              })
            }
            break;
          case 'Winner':
            pushEvent({ type: 'winner', winner: log.args.user! })
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