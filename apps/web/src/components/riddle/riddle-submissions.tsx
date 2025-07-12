"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { submissionsAtom } from "@/lib/atoms/submissions";
import { Submission } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { match } from "ts-pattern";

interface RiddleSubmissionsProps {
  currentSubmission?: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function RiddleSubmissions({
  currentSubmission,
  scrollRef,
}: RiddleSubmissionsProps) {
  const [submissions] = useAtom(submissionsAtom);

  return (
    <div className="text-sm text-muted-foreground mt-4 text-center w-full flex flex-col gap-2">
      {match(submissions.size)
        .with(0, () => <>no submissions yet</>)
        .otherwise(() => (
          <>
            <div>previously submitted answers:</div>
            <div className="max-h-20 overflow-scroll" ref={scrollRef}>
              <AnimatePresence initial={false}>
                {submissions.values().map((submission) => (
                  <SubmissionTag
                    key={submission.submission}
                    submission={submission}
                    isCurrentSubmission={
                      currentSubmission === submission.submission
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        ))}
    </div>
  );
}

interface SubmissionTagProps {
  submission: Submission;
  isCurrentSubmission?: boolean;
}

export function SubmissionTag({
  submission: { submission, hash, isPending, receipt },
  isCurrentSubmission = false,
}: SubmissionTagProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: 0.125 }}
      className={cn(
        "inline-block mr-2 last:mr-0 my-0.5 px-2 py-1 bg-slate-400 text-slate-900 rounded-full whitespace-pre-wrap",
        isPending && "animate-pulse",
        receipt?.isValid === true && "bg-green-400 text-white",
        receipt?.isValid === false && "bg-slate-200",
        isCurrentSubmission && !isPending && "bg-red-400 text-white",
      )}
    >
      <Tooltip>
        <TooltipTrigger>
          <span className={cn(receipt?.isValid === false && "line-through")}>
            {submission}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <table className="text-xs border-separate border-spacing-0">
            <tbody>
              <tr className="border-b border-slate-200 last:border-b-0">
                <td className="font-semibold pr-2 text-right border-r border-slate-200">Text hash</td>
                <td className="break-all font-mono pl-2">{hash}</td>
              </tr>
              {receipt?.transactionHash && (
                <tr className="border-b border-slate-200 last:border-b-0">
                  <td className="font-semibold pr-2 text-right border-r border-slate-200">Tx</td>
                  <td className="break-all font-mono pl-2">{receipt.transactionHash}</td>
                </tr>
              )}
            </tbody>
          </table>
        </TooltipContent>
      </Tooltip>
    </motion.span>
  );
}
