import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { custom, minLength, pipe, strictObject, string, trim } from "valibot";
import { RiddleSubmissions } from "../riddle-submissions";

interface GuessRiddleProps {
  riddle: string;
  submissions: string[];
  submit: (answer: string) => void;
  isSubmitted: (answer: string) => boolean;
}

export function GuessRiddle({
  riddle,
  submissions,
  submit,
  isSubmitted,
}: GuessRiddleProps) {
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
      submit(value.answer.trim());
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col items-center gap-6 w-full max-w-md"
    >
      <h1 className={cn("text-xl md:text-2xl font-semibold text-center mb-2")}>
        {riddle}
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
        selector={(state) => state.values.answer.trim()}
        // eslint-disable-next-line react/no-children-prop
        children={(currentSubmission) => (
          <RiddleSubmissions
            submissions={submissions}
            currentSubmission={currentSubmission}
            scrollRef={scrollRef}
          />
        )}
      />
    </form>
  );
}
