import { useTimeAgo } from "@/hooks/useTimeAgo";
import { ActivityFeedEventItem } from "@/lib/atoms/activity-feed";
import { ActivityFeedEvent } from "@/lib/domain";
import { motion } from "framer-motion";
import { Puzzle, CheckCircle, XCircle, Trophy, User, Clock } from "lucide-react";
import { Address } from "../ui/address";

function EventIcon({ event }: { event: ActivityFeedEvent }) {
  switch (event.type) {
    case "newRiddle":
      return <Puzzle className="w-4 h-4 text-blue-500" />;
    case "guess":
      return event.isValid ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      );
    case "winner":
      return <Trophy className="w-4 h-4 text-yellow-500" />;
    default:
      return <User className="w-4 h-4 text-gray-500" />;
  }
}

function EventMessage({
  event,
  currentUserAddress,
}: {
  event: ActivityFeedEvent;
  currentUserAddress?: `0x${string}`;
}) {
  switch (event.type) {
    case "newRiddle":
      return (
        <span>
          <span className="font-medium text-blue-600 dark:text-blue-400">
            New riddle
          </span>{" "}
          posted
        </span>
      );
    case "guess":
      return (
        <span>
          <Address
            address={event.from}
            className="font-medium text-gray-700 dark:text-gray-300"
            currentUserAddress={currentUserAddress}
          />{" "}
          {event.isValid ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              solved
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400 font-medium">
              attempted
            </span>
          )}{" "}
          the riddle
        </span>
      );
    case "winner":
      return (
        <span>
          <Address
            address={event.winner}
            className="font-medium text-yellow-600 dark:text-yellow-400"
            currentUserAddress={currentUserAddress}
          />{" "}
          won the riddle! 🎉
        </span>
      );
    default:
      return null;
  }
}

export function ActivityFeedItem({
  event,
  index,
  currentUserAddress,
}: {
  event: ActivityFeedEventItem;
  index: number;
  currentUserAddress?: `0x${string}`;
}) {
  const timeAgo = useTimeAgo(event.at);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-shrink-0 mt-0.5">
        <EventIcon event={event} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          <EventMessage event={event} currentUserAddress={currentUserAddress} />
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>
    </motion.div>
  );
}