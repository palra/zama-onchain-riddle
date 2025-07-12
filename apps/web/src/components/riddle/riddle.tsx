import { useRiddleState } from "@/hooks/useRiddleState";
import { useSubmissions } from "@/hooks/useSubmissions";
import { match } from "ts-pattern";
import { GuessRiddle, GuessRiddleLoading } from "./states/guess-riddle";
import { SolvedRiddle } from "./states/solved-riddle";
import { WaitingRiddle } from "./states/waiting-riddle";

export function Riddle() {
  const { submit, isSubmitted, submissions } = useSubmissions();
  const gameState = useRiddleState();

  return match(gameState)
    .with({ isSuccess: true }, ({ data: gameState }) =>
      match(gameState)
        .with({ status: "waitingForRiddle" }, () => <WaitingRiddle />)
        .with({ status: "guess" }, ({ riddle }) => (
          <GuessRiddle {...{ riddle, submissions, submit, isSubmitted }} />
        ))
        .with({ status: "solved" }, ({ riddle, winner, solution }) => (
          <SolvedRiddle {...{ riddle, winner, solution }} />
        ))
        .exhaustive()
    )
    .with({ isLoading: true }, () => <GuessRiddleLoading />)
    .otherwise(() => (
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="text-center text-red-500 font-semibold text-lg">
          An error occurred while loading the riddle. <br/>
          Please try again later.
        </div>
      </div>
    ));
}
