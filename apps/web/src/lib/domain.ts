export type RiddleGameState =
    | { status: "waitingForRiddle" }
    | { status: "guess"; riddle: string }
    | { status: "solved"; riddle: string; winner: `0x${string}`; solution?: string }
    ;