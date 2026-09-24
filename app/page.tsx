"use client";

import { useState } from "react";
import leads from "../test-data/mock_realistic_leads.json";
import reps from "../test-data/mock_realistic_rep_profiles.json";
import { runJevLeadRouting, RunJevLeadRoutingResponse } from "./actions";

const MOCK_LEADS = leads.leads;
const MOCK_REPS = reps.reps;

export default function Home() {
  const [choice, setChoice] = useState<RunJevLeadRoutingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestJev = async () => {
    setIsLoading(true);
    try {
      const newChoice = await runJevLeadRouting({
        lead: MOCK_LEADS[0],
        reps: MOCK_REPS,
      });
      setChoice(newChoice);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {choice ? <pre>{JSON.stringify(choice)}</pre> : ""}
        <button
          className="p-2 border border-blue-500"
          disabled={isLoading}
          onClick={handleTestJev}
        >
          Test Jev
        </button>
      </main>
    </div>
  );
}
