"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<string[]>(["Alice", "Charly", "Mom"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      setSubmitted((prev) => [...prev, answer.trim()]);
      setAnswer("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 w-full max-w-md"
      >
        <h1 className="text-xl md:text-2xl font-semibold text-center mb-2">
          what is the name of the only son of Bob&apos;s father?
        </h1>
        <div className="flex w-full gap-2 justify-center">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1"
            placeholder="Enter your answer..."
            autoFocus
          />
          <Button type="submit" className="px-6">
            send
          </Button>
        </div>
        <div className="text-sm text-muted-foreground mt-4 text-center w-full">
          previously submitted answers: {submitted.join(", ")}
        </div>
      </form>
    </div>
  );
}
