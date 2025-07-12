import { OnchainRiddle } from "@/lib/contracts";
import { RiddleGameState } from "@/lib/domain";
import { isAddressEqual, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

export function useRiddleState() {
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
        if (
          !isActive &&
          !isAddressEqual(winner, zeroAddress)
        ) {
          return { status: 'solved', riddle, winner }
        }

        if (isActive) {
          return { status: 'guess', riddle };
        }

        return { status: 'waitingForRiddle' };
      }
    }
  });

  return {
    ...contractState,
  }
}