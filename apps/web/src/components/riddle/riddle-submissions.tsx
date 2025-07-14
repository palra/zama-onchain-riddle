"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSubmissionValidityAtom, submissionsAtom } from "@/lib/atoms/submissions";
import { Submission } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { match } from "ts-pattern";

interface RiddleSubmissionsProps {
  currentSubmission?: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function RiddleSubmissions({
  currentSubmission,
  scrollRef,
}: RiddleSubmissionsProps) {
  const { submissions } = useAtomValue(submissionsAtom);

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
  submission: { submission, hash, transactionHash },
  isCurrentSubmission = false,
}: SubmissionTagProps) {
  const [getSubmissionValidity] = useAtom(getSubmissionValidityAtom);
  const isValid = getSubmissionValidity(submission);
  const isPending = typeof isValid === "undefined";

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: 0.125 }}
      className={cn(
        "inline-block mr-2 last:mr-0 my-0.5 px-2 py-1 bg-muted text-foreground rounded-full whitespace-pre-wrap",
        isPending && "animate-pulse",
        isValid === true && "bg-green-400 text-white dark:bg-green-700 dark:text-green-100",
        isValid === false && "bg-muted text-muted-foreground",
        isCurrentSubmission && !isPending && "bg-destructive text-white dark:text-red-50",
      )}
    >
      <Tooltip>
        <TooltipTrigger>
          <span className={cn(isValid === false && "line-through")}>{submission}</span>
        </TooltipTrigger>
        <TooltipContent>
          <table className="text-xs border-separate border-spacing-0">
            <tbody>
              <tr className="border-b border-slate-200 last:border-b-0">
                <td className="font-semibold pr-2 text-right border-r border-slate-200">Text hash</td>
                <td className="break-all font-mono pl-2">{hash}</td>
              </tr>
              {transactionHash && (
                <tr className="border-b border-slate-200 last:border-b-0">
                  <td className="font-semibold pr-2 text-right border-r border-slate-200">Tx</td>
                  <td className="break-all font-mono pl-2">{transactionHash}</td>
                </tr>
              )}
            </tbody>
          </table>
        </TooltipContent>
      </Tooltip>
    </motion.span>
  );
}
