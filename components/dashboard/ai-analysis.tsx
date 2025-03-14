"use client";

import { useState, useEffect } from "react";
import { analyzeTask } from "@/lib/gemini";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, Brain, Clock, Users, List, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface AIAnalysisProps {
  task: any;
}

interface TaskAnalysis {
  summary: {
    title: string;
    description: string;
    priority_level: "Low" | "Medium" | "High" | "Urgent";
    estimated_time: string;
  };
  requirements: {
    key_points: string[];
    dependencies: string[];
    stakeholders: string[];
  };
  next_steps: {
    immediate_actions: string[];
    future_tasks: string[];
    milestones: {
      title: string;
      deadline: string;
    }[];
  };
  challenges: {
    potential_risks: string[];
    mitigation_strategies: string[];
    resource_requirements: string[];
  };
}

export function AIAnalysis({ task }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<TaskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await analyzeTask(task);
        setAnalysis(result);
      } catch (err) {
        setError("Failed to analyze task. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
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

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        {/* Summary Section */}
        <Card className="border-none bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
              <Brain className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-blue-500">{analysis.summary.title}</h3>
                <Badge className={getPriorityColor(analysis.summary.priority_level)}>
                  {analysis.summary.priority_level}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{analysis.summary.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{analysis.summary.estimated_time}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Requirements Section */}
        <Card className="border-none bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
              <List className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-purple-500 mb-3">Requirements</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Points</h4>
                  <ul className="space-y-1">
                    {analysis.requirements.key_points.map((point, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Dependencies</h4>
                  <ul className="space-y-1">
                    {analysis.requirements.dependencies.map((dep, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                        {dep}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps Section */}
        <Card className="border-none bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center mt-1">
              <ArrowRight className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-emerald-500 mb-3">Next Steps</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Immediate Actions</h4>
                  <ul className="space-y-1">
                    {analysis.next_steps.immediate_actions.map((action, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Milestones</h4>
                  <ul className="space-y-2">
                    {analysis.next_steps.milestones.map((milestone, i) => (
                      <li key={i} className="text-sm">
                        <div className="font-medium text-emerald-500">{milestone.title}</div>
                        <div className="text-muted-foreground">{milestone.deadline}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Challenges Section */}
        <Card className="border-none bg-gradient-to-br from-amber-500/10 to-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-1">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-500 mb-3">Challenges & Mitigation</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Potential Risks</h4>
                  <ul className="space-y-1">
                    {analysis.challenges.potential_risks.map((risk, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Mitigation Strategies</h4>
                  <ul className="space-y-1">
                    {analysis.challenges.mitigation_strategies.map((strategy, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}
