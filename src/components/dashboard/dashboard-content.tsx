"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, Calendar, CheckCircle2, Clock, Plus, Settings, Users, Smile, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/i18n/translations';

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

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let increment = end / 40;
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 12);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

function MiniBar({ percent, color }: { percent: number, color: string }) {
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mt-2">
      <div
        className={color + " h-full rounded-full transition-all duration-500"}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function MiniBarSVG({ color }: { color: string }) {
  // Simple static bar chart SVG
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="18" width="4" height="12" rx="2" fill={color} />
      <rect x="10" y="12" width="4" height="18" rx="2" fill={color} />
      <rect x="18" y="8" width="4" height="22" rx="2" fill={color} />
      <rect x="26" y="14" width="4" height="16" rx="2" fill={color} />
      <rect x="34" y="10" width="4" height="20" rx="2" fill={color} />
      <rect x="42" y="16" width="4" height="14" rx="2" fill={color} />
    </svg>
  );
}

function KpiCard({ label, value, trend, trendColor, trendIcon, chartColor, chartData, last7days }: any) {
  return (
    <Card className="rounded-3xl border-0 bg-white/80 dark:bg-[#23263a]/90 backdrop-blur-xl shadow-md dark:shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <CardTitle className="text-xl font-bold text-blue-900 dark:text-white flex items-center gap-2">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {value.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold mt-1">
              {trendIcon}
              <span className={trendColor}>{trend}</span>
              <span className="text-muted-foreground font-normal ml-1">{last7days}</span>
            </span>
          </div>
          <div className="flex items-center h-full ml-2">
            <ResponsiveContainer width={48} height={32}>
              <BarChart data={chartData} barCategoryGap={2} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardContent() {
  const { data: session } = useSession();
  const { t } = useTranslation();

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

  const kpis = [
    {
      label: t('dashboard.kpi.activeUsers' as const),
      value: 18765,
      trend: "+2.6%",
      trendColor: "text-green-500",
      trendIcon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 12V4M8 4l-4 4M8 4l4 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      chartColor: "#22c55e",
      chartData: [
        { name: 'Mon', value: 8 },
        { name: 'Tue', value: 12 },
        { name: 'Wed', value: 10 },
        { name: 'Thu', value: 14 },
        { name: 'Fri', value: 13 },
        { name: 'Sat', value: 16 },
        { name: 'Sun', value: 15 },
      ],
      last7days: t('dashboard.kpi.last7days' as const)
    },
    {
      label: t('dashboard.kpi.installed' as const),
      value: 4876,
      trend: "+0.2%",
      trendColor: "text-green-500",
      trendIcon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 12V4M8 4l-4 4M8 4l4 4" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      chartColor: "#06b6d4",
      chartData: [
        { name: 'Mon', value: 5 },
        { name: 'Tue', value: 7 },
        { name: 'Wed', value: 6 },
        { name: 'Thu', value: 8 },
        { name: 'Fri', value: 7 },
        { name: 'Sat', value: 9 },
        { name: 'Sun', value: 8 },
      ],
      last7days: t('dashboard.kpi.last7days' as const)
    },
    {
      label: t('dashboard.kpi.downloads' as const),
      value: 678,
      trend: "-0.1%",
      trendColor: "text-red-500",
      trendIcon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 4v8M8 12l4-4M8 12l-4-4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      chartColor: "#ef4444",
      chartData: [
        { name: 'Mon', value: 3 },
        { name: 'Tue', value: 4 },
        { name: 'Wed', value: 5 },
        { name: 'Thu', value: 6 },
        { name: 'Fri', value: 5 },
        { name: 'Sat', value: 7 },
        { name: 'Sun', value: 6 },
      ],
      last7days: t('dashboard.kpi.last7days' as const)
    },
  ];

  return (
    <div className="min-h-screen text-foreground p-6 space-y-6">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/70 dark:bg-[#23263a]/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] px-8 py-10 border border-blue-400/10">
        <Avatar className="h-24 w-24 border-4 border-blue-400/30 shadow-xl bg-white/10 dark:bg-blue-900/30">
          {safeUserImage ? (
            <AvatarImage src={safeUserImage} alt={safeUserName || 'User'} referrerPolicy="no-referrer" />
          ) : null}
          <AvatarFallback className="text-3xl font-bold text-blue-900/80 dark:text-white/80 bg-white/30 dark:bg-blue-900/30">{safeUserName ? safeUserName[0].toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-blue-900 dark:text-white mb-2 tracking-tight drop-shadow-lg">Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">{safeUserName || 'User'}</span>!</h1>
          <p className="text-lg text-blue-800/80 dark:text-blue-100/80 font-light mb-4">Here's what's happening in your workspace today.</p>
          <Button className="bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-200">Create New Project</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="rounded-3xl border-0 bg-white/80 dark:bg-[#23263a]/90 backdrop-blur-xl shadow-md dark:shadow-md hover:shadow-lg transition-all duration-200 lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Activity className="text-blue-500 w-6 h-6" />
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-white flex items-center gap-2">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shadow">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar} alt={activity.user} />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-white">{activity.user}</p>
                    <p className="text-sm text-blue-800/80 dark:text-blue-100/80">{activity.action}</p>
                  </div>
                  <span className="ml-auto text-xs text-blue-700/80 dark:text-blue-200/80 font-medium">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="rounded-3xl border-0 bg-white/80 dark:bg-[#23263a]/90 backdrop-blur-xl shadow-md dark:shadow-md hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart3 className="text-violet-500 w-6 h-6" />
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-white flex items-center gap-2">Active Projects</CardTitle>
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
                    <span className="text-base font-semibold text-blue-900 dark:text-white">{project.name}</span>
                    <span className="text-xs text-blue-700/80 dark:text-blue-200/80 font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-violet-200/40 dark:bg-violet-900/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500 ease-in-out" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-blue-700/80 dark:text-blue-200/80">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Tasks */}
        <Card className="rounded-3xl border-0 bg-white/80 dark:bg-[#23263a]/90 backdrop-blur-xl shadow-md dark:shadow-md hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CheckCircle2 className="text-green-500 w-6 h-6" />
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-white flex items-center gap-2">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { task: "Review design mockups", project: "Website Redesign", due: "Today" },
                { task: "Update API documentation", project: "Mobile App Development", due: "Tomorrow" },
                { task: "Prepare presentation", project: "Marketing Campaign", due: "In 2 days" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shadow">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-blue-900 dark:text-white truncate">{item.task}</p>
                    <p className="text-xs text-blue-800/80 dark:text-blue-100/80 truncate">{item.project}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-700/80 dark:text-blue-200/80 whitespace-nowrap">
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
  );
} 