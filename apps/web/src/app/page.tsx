"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { match } from "ts-pattern";
import { custom, minLength, pipe, strictObject, string, trim } from "valibot";
import { useRiddleGame } from "../hooks/useRiddleGame";
import { AnimatePresence, motion, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function Home() {
  const { riddle, submissions, submit, isSubmitted } = useRiddleGame();

  // Define the schema with valibot
  const answerSchema = strictObject({
    answer: pipe(
      string(),
      trim(),
      minLength(1, "Please enter an answer."),
      custom(
        (val) => !isSubmitted(val + ""),
        "This answer has already been submitted."
      )
    ),
  });

  const form = useForm({
    defaultValues: { answer: "" },
    validators: {
      onChange: answerSchema,
    },
    onSubmit: async ({ value }) => {
      submit(value.answer);
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
  }, [submissions.length]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col items-center gap-6 w-full max-w-md"
      >
        <h1
          className={cn(
            "text-xl md:text-2xl font-semibold text-center mb-2",
            !riddle && "opacity-45 font-normal"
          )}
        >
          {riddle ?? "waiting for a new riddle ..."}
        </h1>
        <form.Field name="answer">
          {(field) => (
            <div className="flex w-full gap-2 justify-center flex-col items-center">
              <div className="flex w-full gap-2 justify-center">
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex-1"
                  placeholder="Enter your answer..."
                  autoFocus
                />
                <Button
                  type="submit"
                  className="px-6"
                  disabled={!form.state.isValid}
                >
                  send
                </Button>
              </div>
              {field.state.meta.errors.length > 0 ? (
                <div className="text-red-500 text-xs mt-1 text-center w-full">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(" - ")}
                </div>
              ) : (
                <>&#8203;</>
              )}
            </div>
          )}
        </form.Field>
        <div className="text-sm text-muted-foreground mt-4 text-center w-full flex flex-col gap-2">
          {match(submissions)
            .with([], () => <>no submissions yet</>)
            .otherwise((values) => (
              <>
                <div>previously submitted answers:</div>
                <div className="max-h-20 overflow-scroll" ref={scrollRef}>
                  <form.Subscribe
                    selector={(state) => state.values.answer}
                    // eslint-disable-next-line react/no-children-prop
                    children={(currentSubmission) => (
                      <AnimatePresence initial={false}>
                        {values.map((submission) => (
                          <motion.span
                            key={submission}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: 0.125 }} // delay accounting for scroll down
                            className={cn(
                              "inline-block mr-2 last:mr-0 my-0.5 px-2 py-1 bg-slate-300 rounded-full",
                              currentSubmission === submission &&
                                "bg-red-400 text-white"
                            )}
                          >
                            {submission}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    )}
                  />
                </div>
              </>
            ))}
        </div>
      </form>
    </div>
  );
}
