"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Clock, Tag, MessageSquare, Mail, Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AIAnalysis } from "./ai-analysis";
import { AIChat } from "./ai-chat";

interface TaskDialogProps {
  task: any;
  onClose: () => void;
}

export function TaskDialog({ task, onClose }: TaskDialogProps) {
  if (!task) return null;

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
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] h-[85vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            <span>Task Details</span>
            <Badge className={`${getPriorityBadgeColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-[calc(85vh-80px)] gap-6 p-6 pt-2">
          <div className="w-[70%] overflow-y-auto pr-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-medium">{task.task}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>From {task.from}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>Due Date</span>
                </div>
                <p className="text-muted-foreground">{task.deadline}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Due Time</span>
                </div>
                <p className="text-muted-foreground">{task.time}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  <span>Category</span>
                </div>
                <p className="text-muted-foreground">{task.category}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat Type</span>
                </div>
                <p className="text-muted-foreground">
                  {task.isGroup ? "Group Chat" : "Direct Message"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Mail className="h-4 w-4" />
                <span>Original Message</span>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm whitespace-pre-wrap">{task.snippet}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {task.reminded ? "Reminder sent" : "No reminder sent"}
                </span>
              </div>
              <span>
                Created {formatDistanceToNow(new Date(task.timestamp))} ago
              </span>
            </div>
          </div>

          <div className="w-[30%] border-l pl-6">
            <Tabs defaultValue="analysis" className="h-full flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger
                  value="analysis"
                  className="flex-1 flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="flex-1 flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="analysis"
                className="flex-1 mt-6 overflow-y-auto h-[calc(85vh-200px)]"
              >
                <AIAnalysis task={task} />
              </TabsContent>

              <TabsContent
                value="chat"
                className="flex-1 mt-6 flex flex-col overflow-hidden h-[calc(85vh-200px)]"
              >
                <AIChat task={task} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
