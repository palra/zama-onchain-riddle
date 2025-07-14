import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { match } from "ts-pattern";
import { useAccount } from "wagmi";

interface SolvedRiddleProps {
  riddle: string;
  winner: string;
}

export function SolvedRiddle({ riddle, winner }: SolvedRiddleProps) {
  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className={cn("text-xl md:text-2xl font-semibold text-center mb-4")}>
          {riddle}
        </h1>

        <div className="bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-700 rounded-lg p-4 mb-4">
          <div className="text-green-800 dark:text-green-200 font-medium mb-2">🎉 Riddle Solved!</div>
          <div className="text-sm text-green-700 dark:text-green-100">
            <div>
              {match(winner)
                .with(address!, () => <strong>You are the winner!</strong>)
                .otherwise(() => <><strong>Winner:</strong> {winner}</>)
              }
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
