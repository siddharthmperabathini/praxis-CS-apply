"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar, Building } from "lucide-react";
import { useJobContext } from "@/context/job-context";

export function CompletedJobList() {
  const { completedJobs } = useJobContext();

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-white">Applied Jobs</h2>

      {completedJobs.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-zinc-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-zinc-400 mb-2">No applications yet</h3>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto">Start the application bot on the Apply page to begin submitting job applications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedJobs.map((job) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">{job.title}</h3>
                  <div className="flex items-center text-sm text-zinc-400 mt-1">
                    <Building className="w-3.5 h-3.5 mr-1.5" />
                    <span>{job.company}</span>
                  </div>
                  {job.appliedAt && (
                    <div className="flex items-center text-xs text-zinc-500 mt-2">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      <span>Applied on {formatDate(job.appliedAt)}</span>
                    </div>
                  )}
                </div>
                <div className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Applied</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
