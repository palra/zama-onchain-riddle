import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { activityFeedCollapsedAtom, unseenEventsAtom } from "@/lib/atoms/activity-feed";
import { useAtom } from "jotai";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { ActivityFeed } from "./activity-feed";
import { GreenPulse } from "./green-pulse";

export function MobileActivityDrawer() {
    const [eventsNum] = useAtom(unseenEventsAtom);
    const [isCollapsed, setIsCollapsed] = useAtom(activityFeedCollapsedAtom);

  return (
    <Drawer onOpenChange={(open) => setIsCollapsed(!open)}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 relative"
        >
          <GreenPulse />
          Live Activity
          {isCollapsed ? <ChevronDown /> : <ChevronUp />}
          {eventsNum > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {eventsNum > 9 ? "9+" : eventsNum}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Activity
              {eventsNum > 0 && (
                <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {eventsNum} event{eventsNum !== 1 ? "s" : ""}
                </span>
              )}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">
          <ActivityFeed variant="overlay" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
