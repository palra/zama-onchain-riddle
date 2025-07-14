import { Button } from "@/components/ui/button";
import {
  activityFeedCollapsedAtom,
  unseenEventsAtom,
} from "@/lib/atoms/activity-feed";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GreenPulse } from "./green-pulse";
import { cn } from "@/lib/utils";
import { EventNumberPill } from "./event-number-pill";

export function DesktopButton() {
  const [eventsNum] = useAtom(unseenEventsAtom);
  const [isCollapsed, toggleCollapse] = useAtom(activityFeedCollapsedAtom);

  return (
    <Button
      variant="outline"
      onClick={() => toggleCollapse()}
      className="rounded-s-lg rounded-e-none shadow-lg hover:shadow-xl transition-all duration-200 relative border-r-0"
      title={isCollapsed ? "Show activity feed" : "Hide activity feed"}
    >
      <span
        className={cn(
          "transition-all duration-300 inline-flex flex-row gap-1 items-center",
          isCollapsed
            ? "opacity-100 max-w-xs ml-0"
            : "opacity-0 max-w-0 ml-0 overflow-hidden -mx-1", // compensate gap
        )}
      >
        <GreenPulse className="inline-block" />
        Live Activity
      </span>
      {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
      <EventNumberPill eventsNum={eventsNum} position="top-left" />
    </Button>
  );
}
