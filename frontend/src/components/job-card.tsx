"use client";
import { motion } from "framer-motion";

interface JobCardProps {
  title: string;
  company: string;
  isTopCard?: boolean;
  progress?: number;
  isPaused?: boolean;
}

export function JobCard({ title, company, isTopCard = false, progress = 0, isPaused = false }: JobCardProps) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full bg-zinc-900 rounded-lg p-4 mb-4 border border-zinc-800">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <p className="text-sm text-zinc-400">{company}</p>
        </div>
        {!isTopCard && <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded">Pending</span>}
      </div>

      {isTopCard && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Application Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-zinc-500 mt-2">{isPaused ? "Application paused. Click 'Start Applying' to continue." : "Bot is filling out application details..."}</p>
        </div>
      )}
    </motion.div>
  );
}
