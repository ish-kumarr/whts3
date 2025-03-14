"use client";

import { useState, useEffect } from "react";
import { analyzeTask } from "@/lib/gemini";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";

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
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium text-blue-500 mb-2">Task Summary</h3>
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown>{analysis.split("Important Points/Requirements:")[0]}</ReactMarkdown>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-none bg-gradient-to-br from-amber-500/10 to-red-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-1">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-medium text-amber-500 mb-2">Requirements</h3>
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown>{analysis.split("Important Points/Requirements:")[1]?.split("Aage ke Steps:")[0]}</ReactMarkdown>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-none bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center mt-1">
            <ArrowRight className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-medium text-emerald-500 mb-2">Next Steps</h3>
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown>{analysis.split("Aage ke Steps:")[1]?.split("Challenges/Considerations:")[0]}</ReactMarkdown>
            </div>
          </div>
        </div>
      </Card>

      {analysis.includes("Challenges/Considerations:") && (
        <Card className="border-none bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
              <AlertCircle className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium text-purple-500 mb-2">Challenges</h3>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{analysis.split("Challenges/Considerations:")[1]}</ReactMarkdown>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
