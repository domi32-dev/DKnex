"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, Calendar, CheckCircle2, Clock, Plus, Settings, Users, Smile, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

// Sanitize user input for display
const sanitizeUserInput = (input: string | null | undefined): string => {
  return input?.replace(/[<>]/g, '') || '';
};

// Validate avatar URL
const isValidAvatarUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    // Special handling for Google Photos URLs
    if (url.includes('googleusercontent.com')) {
      return true;
    }
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function DashboardContent() {
  const { data: session } = useSession();

  // Card base classes for light/dark mode
  const cardBase = "rounded-2xl shadow-md border-0 bg-white dark:bg-[#23263a] dark:border dark:border-[#2d314d] transition-colors";
  const cardHeader = "flex flex-row items-center gap-2 pb-2";
  const sectionTitle = "text-lg font-semibold text-blue-900 dark:text-white";

  // Get safe user data
  const safeUserName = sanitizeUserInput(session?.user?.name);
  const safeUserEmail = sanitizeUserInput(session?.user?.email);
  const safeUserImage = session?.user?.image && isValidAvatarUrl(session.user.image) 
    ? session.user.image 
    : null;

  // Static activities data for now
  const activities = [
    { user: "John Doe", avatar: "/avatar2.png", action: "created a new project", time: "2h ago" },
    { user: "Jane Smith", avatar: "/avatar3.png", action: "updated project settings", time: "3h ago" },
    { user: "Mike Johnson", avatar: "/avatar4.png", action: "completed task", time: "4h ago" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Greeting */}
      <div className="flex items-center gap-4 mb-2">
        <Avatar className="h-14 w-14">
          {safeUserImage ? (
            <AvatarImage 
              src={safeUserImage} 
              alt={safeUserName || "User"}
              referrerPolicy="no-referrer"
            />
          ) : null}
          <AvatarFallback>
            {safeUserName ? safeUserName[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-900 dark:text-white">
            <Smile className="text-primary w-7 h-7 dark:text-blue-400" />
            Welcome back, <span className="text-primary dark:text-blue-400">{safeUserName || "User"}</span>!
          </h1>
          <p className="text-muted-foreground text-sm mt-1 dark:text-slate-300">
            {safeUserEmail ? `Signed in as ${safeUserEmail}` : "Here's what's happening in your workspace today."}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Users", 
            value: "1,234",
            icon: <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />, 
            bg: "bg-blue-100 dark:bg-[#2d314d]"
          },
          {
            label: "Active Projects",
            value: "42",
            icon: <BarChart3 className="h-7 w-7 text-purple-600 dark:text-purple-400" />, 
            bg: "bg-purple-100 dark:bg-[#2d314d]"
          },
          {
            label: "Tasks Today",
            value: "18",
            icon: <Activity className="h-7 w-7 text-green-600 dark:text-green-400" />, 
            bg: "bg-green-100 dark:bg-[#2d314d]"
          },
          {
            label: "Storage Used",
            value: "45%",
            icon: <Settings className="h-7 w-7 text-pink-600 dark:text-pink-400" />, 
            bg: "bg-pink-100 dark:bg-[#2d314d]"
          },
        ].map((stat, i) => (
          <Card key={i} className={cardBase}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.bg} flex items-center justify-center`}>{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-slate-300">{stat.label}</p>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-white">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className={`${cardBase} lg:col-span-2`}>
          <CardHeader className={cardHeader}>
            <Activity className="text-green-500 w-6 h-6 dark:text-green-400" />
            <CardTitle className={sectionTitle}>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-[#23263a] transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar} alt={activity.user} />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-white">{activity.user}</p>
                    <p className="text-sm text-muted-foreground dark:text-slate-300">{activity.action}</p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground dark:text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className={cardBase}>
          <CardHeader className={cardHeader}>
            <BarChart3 className="text-purple-500 w-6 h-6 dark:text-purple-400" />
            <CardTitle className={sectionTitle}>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Website Redesign",
                  progress: 75,
                  members: 5,
                  deadline: "2024-03-15"
                },
                {
                  name: "Mobile App Development",
                  progress: 45,
                  members: 8,
                  deadline: "2024-04-01"
                },
                {
                  name: "Marketing Campaign",
                  progress: 30,
                  members: 4,
                  deadline: "2024-03-20"
                }
              ].map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900 dark:text-white">{project.name}</span>
                    <span className="text-xs text-muted-foreground dark:text-slate-400">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground dark:text-slate-400">
                    <span>{project.members} members</span>
                    <span>{project.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Team Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className={cardBase}>
          <CardHeader className={cardHeader}>
            <CheckCircle2 className="text-green-500 w-6 h-6 dark:text-green-400" />
            <CardTitle className={sectionTitle}>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Review design mockups", project: "Website Redesign", due: "Today" },
                { task: "Update API documentation", project: "Mobile App Development", due: "Tomorrow" },
                { task: "Prepare presentation", project: "Marketing Campaign", due: "In 2 days" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-[#23263a] transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-green-400 dark:text-green-300" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 dark:text-white">{item.task}</p>
                    <p className="text-xs text-muted-foreground dark:text-slate-400">{item.project}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-slate-400">
                    <Clock className="h-4 w-4 text-blue-400 dark:text-blue-300" />
                    <span>{item.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 