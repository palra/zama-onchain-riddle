"use client";

import {
  activityFeedCollapsedAtom,
  activityFeedEventsAtom,
} from "@/lib/atoms/activity-feed";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { Puzzle, X } from "lucide-react";
import { useRef } from "react";
import { useAccount } from "wagmi";
import { ActivityFeedItem } from "./activity-feed-item";

interface ActivityFeedProps {
  className?: string;
  variant?: "sidebar" | "overlay";
}

export function ActivityFeed({
  className,
  variant = "sidebar",
}: ActivityFeedProps) {
  const events = useAtomValue(activityFeedEventsAtom);
  const [isCollapsed, toggleCollapsed] = useAtom(activityFeedCollapsedAtom);
  const { address: currentUserAddress } = useAccount();

  const isOverlay = variant === "overlay";

  // Virtualization setup
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
    overscan: 20,
    getItemKey: (index) => events[index].id,
  });

  const items = rowVirtualizer.getVirtualItems();

  return (
    <div className={cn("h-full flex", className)}>
      {/* Expanded state */}
      <AnimatePresence>
        {(!isCollapsed || isOverlay) && (
          <motion.div
            initial={isOverlay ? { opacity: 1 } : { width: 0, opacity: 0 }}
            animate={isOverlay ? { opacity: 1 } : { width: 320, opacity: 1 }}
            exit={isOverlay ? { opacity: 0 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden",
              isOverlay
                ? "w-full h-full rounded-lg shadow-xl"
                : "w-80 border-l border-gray-200 dark:border-gray-700",
            )}
          >
            {/* Header - only show for sidebar variant */}
            {!isOverlay && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live Activity
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Real-time events from the blockchain
                  </p>
                </div>
                <button
                  onClick={() => toggleCollapsed(true)}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  title="Collapse activity feed"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}

            <div
              ref={parentRef}
              className="flex-1 p-4 overflow-y-auto relative w-full"
              style={{
                height: rowVirtualizer.getTotalSize(),
              }}
            >
                {events.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <Puzzle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activity yet</p>
                    <p className="text-xs mt-1">
                      Events will appear here as they happen
                    </p>
                  </motion.div>
                ) : (
                  <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                      transform: `translateY(${items[0]?.start ?? 0}px)`
                    }}
                  >
                    {items.map((virtualRow) => {
                      const event = events[virtualRow.index];
                      return (
                        <ActivityFeedItem
                          key={virtualRow.key}
                          index={virtualRow.index}
                          ref={rowVirtualizer.measureElement}
                          event={event}
                          currentUserAddress={currentUserAddress}
                          className="my-3 last:mb-0 mx-3"
                        />
                      );
                    })}
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
