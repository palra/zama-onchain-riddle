import riddles from "./riddles.json";

export function randomRiddle(): {
  question: string; answer: string;
} {
  const idx = Math.floor(Math.random() * riddles.length);
  return riddles[idx]!;
}