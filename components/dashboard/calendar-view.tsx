"use client";

import { useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  tasks: any[];
  onTaskSelect: (task: any) => void;
}

export function CalendarView({ tasks, onTaskSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      return isSameDay(taskDate, date);
    });
  };

  const days = getDaysInMonth();

  return (
    <Card className="border-none shadow-lg bg-white/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-white">
          Calendar
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentMonth(
                (prev) =>
                  new Date(prev.getFullYear(), prev.getMonth() - 1)
              )
            }
            className="text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-white font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentMonth(
                (prev) =>
                  new Date(prev.getFullYear(), prev.getMonth() + 1)
              )
            }
            className="text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-400 py-1"
              >
                {day}
              </div>
            )
          )}
          {days.map((day) => {
            const dayTasks = getTasksForDate(day);
            return (
              <HoverCard key={day.toString()}>
                <HoverCardTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`h-10 relative ${
                      isToday(day)
                        ? "bg-primary/20"
                        : dayTasks.length > 0
                        ? "bg-white/5"
                        : ""
                    } hover:bg-white/10`}
                    onClick={() => {
                      if (dayTasks.length > 0) {
                        onTaskSelect(dayTasks[0]);
                      }
                    }}
                  >
                    <span
                      className={`text-sm ${
                        isToday(day) ? "text-primary" : "text-white"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                        {dayTasks.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className="h-1 w-1 rounded-full bg-primary"
                          />
                        ))}
                      </div>
                    )}
                  </Button>
                </HoverCardTrigger>
                {dayTasks.length > 0 && (
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      {dayTasks.map((task, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`h-2 w-2 rounded-full bg-${task.priority.toLowerCase() === "urgent" ? "red" : "blue"}-500`}
                          />
                          <span className="text-sm">{task.task}</span>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                )}
              </HoverCard>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}