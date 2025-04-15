"use client";

import { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction } from "react";

// Sample job data
export const initialJobs = [
  { id: 1, title: "Frontend Developer", company: "TechCorp Inc." },
  { id: 2, title: "UX Designer", company: "Creative Solutions" },
  { id: 3, title: "Product Manager", company: "Innovate Labs" },
  { id: 4, title: "Data Scientist", company: "DataMinds" },
  { id: 5, title: "DevOps Engineer", company: "CloudScale" },
];

// Additional jobs that will appear at the bottom
export const additionalJobs = [
  { id: 6, title: "Backend Developer", company: "ServerStack" },
  { id: 7, title: "Mobile Developer", company: "AppWorks" },
  { id: 8, title: "Full Stack Engineer", company: "OmniTech" },
  { id: 9, title: "AI Specialist", company: "Neural Networks Inc." },
  { id: 10, title: "QA Engineer", company: "QualityFirst" },
];

export type Job = {
  id: number;
  title: string;
  company: string;
  appliedAt?: Date;
};

type JobContextType = {
  pendingJobs: Job[];
  setPendingJobs: Dispatch<SetStateAction<Job[]>>; // Updated type
  completedJobs: Job[];
  addCompletedJob: (job: Job) => void;
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>; // Updated type
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>; // Updated type
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
  const [pendingJobs, setPendingJobs] = useState<Job[]>(initialJobs);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedCompletedJobs = localStorage.getItem("completedJobs");
    if (savedCompletedJobs) {
      try {
        const parsed = JSON.parse(savedCompletedJobs);
        // Convert string dates back to Date objects
        const jobsWithDates = parsed.map((job: any) => ({
          ...job,
          appliedAt: job.appliedAt ? new Date(job.appliedAt) : undefined,
        }));
        setCompletedJobs(jobsWithDates);
      } catch (e) {
        console.error("Failed to parse completed jobs from localStorage", e);
      }
    }

    const savedPendingJobs = localStorage.getItem("pendingJobs");
    if (savedPendingJobs) {
      try {
        setPendingJobs(JSON.parse(savedPendingJobs));
      } catch (e) {
        console.error("Failed to parse pending jobs from localStorage", e);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("completedJobs", JSON.stringify(completedJobs));
  }, [completedJobs]);

  useEffect(() => {
    localStorage.setItem("pendingJobs", JSON.stringify(pendingJobs));
  }, [pendingJobs]);

  const addCompletedJob = (job: Job) => {
    const jobWithDate = {
      ...job,
      appliedAt: new Date(),
    };
    setCompletedJobs((prev) => [jobWithDate, ...prev]);
  };

  return (
    <JobContext.Provider
      value={{
        pendingJobs,
        setPendingJobs,
        completedJobs,
        addCompletedJob,
        isRunning,
        setIsRunning,
        progress,
        setProgress,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobContext() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
}
