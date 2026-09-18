"use client";

import { PageHeader } from "@/components/workspace/page-header";
import fetchAdminStats from "@/app/frontendLib/adminlib/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Users, FolderKanban, CheckCircle2, MessageSquare } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import TaskDeleteButton from "../project/TaskDeleteButton";
import ProjectDeleteButton from "./ProjectDeleteButton";

interface AdminProject {
  _id: string;
  name: string;
  about?: string;
  ownerId: string;
}

interface AdminTask {
  _id: string;
  projectId: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
}

export default function AdminDashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: fetchAdminStats,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Loading admin metrics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  }

  // Extract stats and dynamic pie chart data from backend response
  const stats = data?.data?.stats || {
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalMessages: 0,
  };

  const taskInteractionData = data?.data?.taskInteractionData || [];
  const projects: AdminProject[] = data?.data?.projects || [];
  const tasks: AdminTask[] = data?.data?.tasks || [];
  const projectNames = new Map(
    projects.map((project) => [project._id, project.name]),
  );

  // Calculate total messages from dynamic task data (fallback to 0)
  const totalMessages =
    taskInteractionData.reduce(
      (acc: number, curr: { messages: number }) => acc + curr.messages,
      0,
    ) || stats.totalMessages;

  return (
    <div className="page-shell space-y-6">
      <PageHeader
        title="Workspace overview"
        description="See team activity, review projects, and manage work across your workspace."
      />
      {/* Top Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="border border-border/60 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              Registered members
            </p>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="border border-border/60 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projects
            </CardTitle>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
              <FolderKanban className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">
              {stats.totalProjects.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              Across the workspace
            </p>
          </CardContent>
        </Card>

        {/* Task Messages */}
        <Card className="border border-border/60 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Task Messages
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
              <MessageSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">
              {stats.totalMessages.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all task threads
            </p>
          </CardContent>
        </Card>

        {/* Total Tasks */}
        <Card className="border border-border/60 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">
              {stats.totalTasks?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              Across all stages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 xl:grid-cols-7">
        {/* Pie Chart: Task Interaction by Messages */}
        <Card className="xl:col-span-4 border border-border/60 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Activity by task status</CardTitle>
            <CardDescription>
              {totalMessages} messages grouped by task status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              {taskInteractionData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No task interaction data recorded yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskInteractionData}
                      dataKey="messages"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                    >
                      {taskInteractionData.map(
                        (
                          entry: { name: string; color: string },
                          index: number,
                        ) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${value ?? 0} messages`,
                        "Activity",
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => (
                        <span className="text-xs font-medium text-muted-foreground">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Breakdown List */}
        <Card className="xl:col-span-3 border border-border/60 rounded-2xl shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg">Message Metrics</CardTitle>
            <CardDescription>Raw counts by task stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {taskInteractionData.map(
              (item: { name: string; messages: number; color: string }) => {
                const percentage =
                  totalMessages > 0
                    ? Math.round((item.messages / totalMessages) * 100)
                    : 0;
                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </span>
                      <span className="text-muted-foreground">
                        {item.messages} msgs ({percentage}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-border/60 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>All projects</CardTitle>
            <CardDescription>
              View and manage every project in the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No projects found.
              </p>
            )}
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between gap-4 rounded-xl border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {project.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {project.about || `Owner: ${project.ownerId}`}
                  </p>
                </div>
                <ProjectDeleteButton
                  projectId={project._id}
                  projectName={project.name}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/60 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>All tasks</CardTitle>
            <CardDescription>
              Review tasks across every project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No tasks found.
              </p>
            )}
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between gap-4 rounded-xl border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{task.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {projectNames.get(task.projectId) || "Unknown project"} ·{" "}
                    {task.status} · {task.priority}
                  </p>
                </div>
                <TaskDeleteButton
                  taskId={task._id}
                  taskTitle={task.title}
                  queryKey={["adminDashboardStats"]}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
