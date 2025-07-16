import { Address } from "@/components/ui/address";
import { winningSubmissionAtom } from "@/lib/atoms/submissions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { match } from "ts-pattern";
import { useAccount } from "wagmi";

interface SolvedRiddleProps {
  riddle: string;
  winner: `0x${string}`;
}

export function SolvedRiddle({ riddle, winner }: SolvedRiddleProps) {
  const { address } = useAccount();
  const winningSubmission = useAtomValue(winningSubmissionAtom);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1
          className={cn("text-xl md:text-2xl font-semibold text-center mb-4")}
        >
          {riddle}
        </h1>

        <div className="bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-700 rounded-lg p-4 mb-4">
          <div className="text-green-800 dark:text-green-200 font-medium mb-2">
            🎉 Riddle Solved!
          </div>
          {winningSubmission && (
            <div className="text-green-700 dark:text-green-100 mb-4">
              <div className="text-md">Solution:</div>
              <div className="font-semibold text-xl">{winningSubmission}</div>
            </div>
          )}
          <div className="text-sm text-green-700 dark:text-green-100">
            <div>
              {match(winner)
                .with(address!, () => <strong>You are the winner!</strong>)
                .otherwise(() => (
                  <>
                    <strong>Winner:</strong>{" "}
                    <Address address={winner} className="font-mono" />
                  </>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
