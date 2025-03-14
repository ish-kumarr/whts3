"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fetchTasks, fetchImportantMessages } from "@/lib/api";
import { Bot, Bell, Plus, Sparkles } from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PriorityTasks } from "@/components/dashboard/priority-tasks";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { TaskDialog } from "@/components/dashboard/task-dialog";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [timeTracking, setTimeTracking] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("timeTracking");
      return saved ? JSON.parse(saved) : { isRunning: false, time: 0 };
    }
    return { isRunning: false, time: 0 };
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, messagesData] = await Promise.all([
          fetchTasks(),
          fetchImportantMessages(),
        ]);
        setTasks(tasksData);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeTracking.isRunning) {
      interval = setInterval(() => {
        setTimeTracking((prev) => {
          const newState = {
            ...prev,
            time: prev.time + 1,
          };
          localStorage.setItem("timeTracking", JSON.stringify(newState));
          return newState;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeTracking.isRunning]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-black">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center relative">
              <Bot className="h-8 w-8 text-primary" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                {getGreeting()}, <span className="text-primary">Ish</span>
              </h1>
              <p className="text-gray-400 mt-1">
                I've analyzed your WhatsApp messages and organized your tasks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button className="h-10">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </motion.div>

        <StatsCards
          messages={messages}
          tasks={tasks}
          timeTracking={timeTracking}
          setTimeTracking={setTimeTracking}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2">
            <PriorityTasks tasks={tasks} onTaskSelect={setSelectedTask} />
          </motion.div>

          <motion.div variants={item}>
            <CalendarView tasks={tasks} onTaskSelect={setSelectedTask} />
          </motion.div>
        </div>
      </motion.div>

      <TaskDialog task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}