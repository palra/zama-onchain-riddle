import { useRiddleGame } from "@/hooks/useRiddleGame";
import { match } from "ts-pattern";
import { GuessRiddle } from "./states/guess-riddle";
import { SolvedRiddle } from "./states/solved-riddle";
import { WaitingRiddle } from "./states/waiting-riddle";

export function Riddle() {
  const gameState = useRiddleGame();

  return match(gameState)
    .with({ status: "waitingForRiddle" }, () => <WaitingRiddle />)
    .with(
      { status: "guess" },
      ({ riddle, submissions, submit, isSubmitted }) => (
        <GuessRiddle {...{ riddle, submissions, submit, isSubmitted }} />
      )
    )
    .with({ status: "solved" }, ({ riddle, winner, solution }) => (
      <SolvedRiddle {...{ riddle, winner, solution }} />
    ))
    .exhaustive();
}
