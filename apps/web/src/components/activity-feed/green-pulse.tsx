import { cn } from "@/lib/utils";

export function GreenPulse({ className }: { className?: string }) {
  return (
    <div className={cn("w-2 h-2 bg-green-500 rounded-full animate-pulse", className)} />
  );
}
