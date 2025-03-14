"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle2, AlertCircle, Timer } from "lucide-react";

interface StatsCardsProps {
  messages: any[];
  tasks: any[];
  timeTracking: {
    isRunning: boolean;
    time: number;
  };
  setTimeTracking: (value: any) => void;
}

export function StatsCards({ messages, tasks, timeTracking, setTimeTracking }: StatsCardsProps) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const urgentTasks = tasks.filter(
    (task) => task.priority === "Urgent" && !task.completed
  );

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Messages Analyzed
            </CardTitle>
            <Brain className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {messages.length}
            </div>
            <Progress
              value={(messages.length / 100) * 100}
              className="h-1 mt-2 bg-white/20"
            />
            <p className="text-xs text-white/80 mt-2">
              From your WhatsApp chats
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-pink-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Task Progress
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {completedTasks}/{tasks.length}
            </div>
            <Progress
              value={(completedTasks / tasks.length) * 100}
              className="h-1 mt-2 bg-white/20"
            />
            <p className="text-xs text-white/80 mt-2">
              Tasks completed today
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Urgent Tasks
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {urgentTasks.length}
            </div>
            <Progress
              value={(urgentTasks.length / tasks.length) * 100}
              className="h-1 mt-2 bg-white/20"
            />
            <p className="text-xs text-white/80 mt-2">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500 to-orange-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Focus Timer
            </CardTitle>
            <Timer className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-white">
              {formatTime(timeTracking.time)}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant={timeTracking.isRunning ? "destructive" : "secondary"}
                onClick={() =>
                  setTimeTracking((prev: any) => {
                    const newState = {
                      ...prev,
                      isRunning: !prev.isRunning,
                    };
                    localStorage.setItem(
                      "timeTracking",
                      JSON.stringify(newState)
                    );
                    return newState;
                  })
                }
                className="w-full bg-white/20 hover:bg-white/30 text-white border-none"
              >
                {timeTracking.isRunning ? "Stop" : "Start"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newState = { time: 0, isRunning: false };
                  localStorage.setItem(
                    "timeTracking",
                    JSON.stringify(newState)
                  );
                  setTimeTracking(newState);
                }}
                className="bg-white/20 hover:bg-white/30 text-white border-none"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}