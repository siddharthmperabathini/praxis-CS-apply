"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { JobCard } from "./job-card";
import { useJobContext, additionalJobs } from "../context/job-context";

export function JobCardList() {
  const { pendingJobs, setPendingJobs, addCompletedJob, isRunning, setIsRunning, progress, setProgress } = useJobContext();

  // Simulate progress for the top card
  useEffect(() => {
    if (!isRunning || pendingJobs.length === 0) return;

    if (progress < 100) {
      const timer = setTimeout(() => {
        // This is the line that was causing the TypeScript error
        // Now it should work correctly as long as the context is properly typed
        setProgress((prev) => Math.min(prev + 1, 100));
      }, 100); // Adjust speed as needed

      return () => clearTimeout(timer);
    } else {
      // When progress reaches 100%, wait a bit then remove the top card and add a new one
      const timer = setTimeout(() => {
        // Add the completed job to the completed list
        if (pendingJobs.length > 0) {
          addCompletedJob(pendingJobs[0]);
        }

        setPendingJobs((prevJobs) => {
          const newJobs = [...prevJobs.slice(1)];

          // Add a new job from additional jobs if available
          const completedCount = additionalJobs.length - (newJobs.length + prevJobs.length - 1);
          if (completedCount >= 0 && completedCount < additionalJobs.length) {
            newJobs.push(additionalJobs[completedCount]);
          }

          return newJobs;
        });

        setProgress(0); // Reset progress for the next card
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [progress, isRunning, pendingJobs, setPendingJobs, addCompletedJob, setProgress]);

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Job Applications</h2>

        <button onClick={toggleRunning} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isRunning ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`} disabled={pendingJobs.length === 0}>
          {isRunning ? (
            <>
              <Pause size={16} />
              <span>Stop Applying</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Start Applying</span>
            </>
          )}
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-zinc-400 mb-2">
          <span>Application Bot Status:</span>
          <span className={isRunning ? "text-green-400" : "text-zinc-500"}>{pendingJobs.length === 0 ? "No jobs to process" : isRunning ? "Running" : "Paused"}</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            initial={{ width: "0%" }}
            animate={{
              width: isRunning && pendingJobs.length > 0 ? "100%" : "0%",
            }}
            transition={{
              duration: 1.5,
              repeat: isRunning && pendingJobs.length > 0 ? Number.POSITIVE_INFINITY : 0,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {pendingJobs.map((job, index) => (
          <JobCard key={job.id} title={job.title} company={job.company} isTopCard={index === 0} progress={index === 0 ? progress : 0} isPaused={!isRunning && index === 0} />
        ))}
      </AnimatePresence>

      {pendingJobs.length === 0 && <div className="text-center py-8 text-zinc-500">All applications completed!</div>}
    </div>
  );
}
