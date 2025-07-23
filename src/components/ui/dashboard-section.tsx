"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
}

export function DashboardSection({
  title,
  icon,
  children,
  className = "",
  headerActions
}: DashboardSectionProps) {
  return (
    <Card className={`overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {headerActions}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );
} 