import { cn } from "@/lib/utils";

export function WaitingRiddle() {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <h1 className={cn("text-xl md:text-2xl font-semibold text-center mb-2 animate-pulse")}>
        waiting for a new riddle ...
      </h1>
    </div>
  );
} 