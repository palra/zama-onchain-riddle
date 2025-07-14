/* eslint-disable react/no-children-prop */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubmitAnswer } from "@/hooks/useSubmitAnswer";
import { isSubmittedAtom, submissionsSizeAtom } from "@/lib/atoms/submissions";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { animate } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { custom, minLength, pipe, strictObject, string, trim } from "valibot";
import { RiddleSubmissions } from "../riddle-submissions";

interface GuessRiddleProps {
  riddle: string;
}

export function GuessRiddle({ riddle }: GuessRiddleProps) {
  const [submissionsSize] = useAtom(submissionsSizeAtom);
  const [isSubmitted] = useAtom(isSubmittedAtom);
  const { submit } = useSubmitAnswer();

  // Define the schema with valibot
  const answerSchema = strictObject({
    answer: pipe(
      string(),
      trim(),
      minLength(1, "Please enter an answer."),
      custom(
        (val) => !isSubmitted(val + ""),
        "This answer has already been submitted.",
      ),
    ),
  });

  const form = useForm({
    defaultValues: { answer: "" },
    validators: {
      onChange: answerSchema,
    },
    onSubmit: async ({ value }) => {
      await submit({ submission: value.answer.trim() });
      form.reset();
    },
  });

  // When we have a new submission, scroll down the submission container
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    animate(ref.scrollTop, ref.scrollHeight, {
      duration: 0.125,
      onUpdate: (latest) => {
        ref.scrollTop = latest;
      },
    });
  }, [submissionsSize]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col items-center gap-6 w-full max-w-md"
    >
      <h1 className={cn("text-2xl font-semibold text-center mb-2")}>
        {riddle}
      </h1>

      <form.Field name="answer">
        {(field) => (
          <div className="flex w-full gap-2 justify-center flex-col items-center">
            <div className="flex w-full gap-2 justify-center">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <div className="flex flex-col gap-2 sm:flex-row w-full">
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="flex-1"
                      placeholder="Enter your answer..."
                      autoFocus
                      disabled={isSubmitting}
                    />
                    <Button
                      type="submit"
                      className="px-6"
                      disabled={!canSubmit || isSubmitting}
                    >
                      send
                    </Button>
                  </div>
                )}
              />
            </div>
            {field.state.meta.errors.length > 0 ? (
              <div className="text-destructive text-xs mt-1 text-center w-full">
                {field.state.meta.errors
                  .map((err: { message?: string } | undefined) => err?.message)
                  .filter(Boolean)
                  .join(" - ")}
              </div>
            ) : (
              <>&#8203;</>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.values.answer.trim(), state.isSubmitting] as const}
        children={([currentSubmission, isSubmitting]) => (
          <RiddleSubmissions
            currentSubmission={isSubmitting ? undefined : currentSubmission}
            scrollRef={scrollRef}
          />
        )}
      />
    </form>
  );
}

export function GuessRiddleLoading() {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="w-full">
        <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
      </div>
      <div className="flex w-full gap-2 justify-center flex-col items-center">
        <div className="flex w-full gap-2 justify-center">
          <Skeleton className="h-10 flex-1 min-w-0" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
      <div className="w-full mt-4 space-y-2">
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>
    </div>
  );
}
