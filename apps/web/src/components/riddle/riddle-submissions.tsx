import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { match } from "ts-pattern";

interface RiddleSubmissionsProps {
  submissions: string[];
  currentSubmission?: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function RiddleSubmissions({ 
  submissions, 
  currentSubmission, 
  scrollRef 
}: RiddleSubmissionsProps) {
  return (
    <div className="text-sm text-muted-foreground mt-4 text-center w-full flex flex-col gap-2">
      {match(submissions)
        .with([], () => <>no submissions yet</>)
        .otherwise((values) => (
          <>
            <div>previously submitted answers:</div>
            <div className="max-h-20 overflow-scroll" ref={scrollRef}> 
              <AnimatePresence initial={false}>
                {values.map((submission) => (
                  <SubmissionTag
                    key={submission}
                    submission={submission}
                    isCurrentSubmission={currentSubmission === submission}
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
  submission: string;
  isCurrentSubmission?: boolean;
}

export function SubmissionTag({ submission, isCurrentSubmission = false }: SubmissionTagProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: 0.125 }}
      className={cn(
        "inline-block mr-2 last:mr-0 my-0.5 px-2 py-1 bg-slate-300 rounded-full whitespace-pre-wrap",
        isCurrentSubmission && "bg-red-400 text-white"
      )}
    >
      {submission}
    </motion.span>
  );
} 