"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  MoreHorizontal,
  CheckCircle,
  MessageCircle,
  Calendar,
  Clock,
  Tag,
  ArrowRight,
} from "lucide-react";

interface PriorityTasksProps {
  tasks: any[];
  onTaskSelect: (task: any) => void;
}

export function PriorityTasks({ tasks, onTaskSelect }: PriorityTasksProps) {
  const urgentTasks = tasks.filter(
    (task) => task.priority === "Urgent" && !task.completed
  );

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
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
    <Card className="border-none shadow-lg bg-white/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-white">
          Priority Tasks
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-4">
            {urgentTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Card
                  className={`border-none shadow-lg backdrop-blur-lg transition-all cursor-pointer ${
                    task.priority.toLowerCase() === "urgent"
                      ? "bg-gradient-to-br from-red-500/20 to-red-600/10 hover:from-red-500/30 hover:to-red-600/20"
                      : "bg-gradient-to-br from-black/40 to-black/20 hover:from-black/60 hover:to-black/40"
                  }`}
                  onClick={() => onTaskSelect(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">
                            {task.task}
                          </h3>
                          <Badge
                            className={`${getPriorityBadgeColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60">
                          From {task.from}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{task.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{task.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-4 w-4" />
                        <span>{task.category}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}