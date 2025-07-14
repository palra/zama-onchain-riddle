import React from "react";
import { cn } from "@/lib/utils";

interface EventNumberPillProps {
  eventsNum: number;
  className?: string;
  position?: "top-right" | "top-left" | "inline";
}

export function EventNumberPill({
  eventsNum,
  className = "",
  position = "top-right",
}: EventNumberPillProps) {
  if (eventsNum <= 0) return null;

  let positionClass = "";
  if (position === "top-right") {
    positionClass = "absolute -top-2 -right-2";
  } else if (position === "top-left") {
    positionClass = "absolute -top-2 -left-2";
  } else if (position === "inline") {
    positionClass = "ml-2";
  }

  return (
    <span
      className={cn(
        positionClass,
        "bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium",
        className
      )}
    >
      {eventsNum > 9 ? "9+" : eventsNum}
    </span>
  );
}
