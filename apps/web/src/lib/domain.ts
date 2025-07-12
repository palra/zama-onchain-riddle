export type Submission = {
  submission: string;
  isPending: boolean;
  hash: string;
  receipt?: {
    transactionHash: `0x${string}`
    isValid?: boolean;
  }
}
export type RiddleGameState =
    | { status: "waitingForRiddle" }
    | { status: "guess"; riddle: string }
    | { status: "solved"; riddle: string; winner: `0x${string}`; solution?: string }
    ;