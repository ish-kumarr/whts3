"use client";

import { useState, useEffect } from "react";
import { analyzeTask } from "@/lib/gemini";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AIAnalysisProps {
  task: any;
}

export function AIAnalysis({ task }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      const result = await analyzeTask(task);
      setAnalysis(result);
      setLoading(false);
    };
    getAnalysis();
  }, [task]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="relative">
          <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-75 blur animate-pulse" />
          <div className="relative bg-black rounded-lg p-4 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          AI is analyzing your task...
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 opacity-75 blur-lg" />
      <div className="relative bg-black/40 backdrop-blur-xl rounded-lg p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}