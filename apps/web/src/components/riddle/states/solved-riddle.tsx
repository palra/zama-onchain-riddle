import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SolvedRiddleProps {
  riddle: string;
  winner: string;
  solution: string;
}

export function SolvedRiddle({ riddle, winner, solution }: SolvedRiddleProps) {
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
        
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
          <div className="text-green-800 font-medium mb-2">🎉 Riddle Solved!</div>
          <div className="text-sm text-green-700">
            <div><strong>Winner:</strong> {winner}</div>
            <div><strong>Solution:</strong> {solution}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 