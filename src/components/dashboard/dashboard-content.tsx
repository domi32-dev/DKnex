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
  const cardBase = "rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all";
  const cardHeader = "flex flex-row items-center gap-3 pb-2";
  const sectionTitle = "text-lg font-semibold text-foreground flex items-center gap-2";

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
    <div className="p-8">
      <div className="mx-auto space-y-8">
        {/* Greeting */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16 ring-2 ring-secondary/20">
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
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              Welcome back, <span className="text-primary">{safeUserName || "User"}</span>!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Here's what's happening in your workspace today.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Users", 
              value: "1,234",
              icon: <Users className="h-6 w-6" />, 
              bg: "bg-secondary/10 dark:bg-secondary/20",
              iconClass: "text-secondary dark:text-secondary-foreground"
            },
            {
              label: "Active Projects",
              value: "42",
              icon: <BarChart3 className="h-6 w-6" />, 
              bg: "bg-accent/10 dark:bg-accent/20",
              iconClass: "text-accent dark:text-accent-foreground"
            },
            {
              label: "Tasks Today",
              value: "18",
              icon: <Activity className="h-6 w-6" />, 
              bg: "bg-secondary/10 dark:bg-secondary/20",
              iconClass: "text-secondary dark:text-secondary-foreground"
            },
            {
              label: "Storage Used",
              value: "45%",
              icon: <Settings className="h-6 w-6" />, 
              bg: "bg-accent/10 dark:bg-accent/20",
              iconClass: "text-accent dark:text-accent-foreground"
            },
          ].map((stat, i) => (
            <Card key={i} className={cardBase}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-3 ${stat.bg} ${stat.iconClass}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  </div>
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
              <Activity className="text-accent w-5 h-5" />
              <CardTitle className={sectionTitle}>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/5 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} alt={activity.user} />
                      <AvatarFallback>{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card className={cardBase}>
            <CardHeader className={cardHeader}>
              <BarChart3 className="text-secondary w-5 h-5" />
              <CardTitle className={sectionTitle}>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
                      <span className="text-sm font-medium text-foreground">{project.name}</span>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{project.members} members</span>
                      <span>{project.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <Card className={cardBase}>
            <CardHeader className={cardHeader}>
              <CheckCircle2 className="text-accent w-5 h-5" />
              <CardTitle className={sectionTitle}>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[
                  { task: "Review design mockups", project: "Website Redesign", due: "Today" },
                  { task: "Update API documentation", project: "Mobile App Development", due: "Tomorrow" },
                  { task: "Prepare presentation", project: "Marketing Campaign", due: "In 2 days" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/5 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.task}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.project}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{item.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 