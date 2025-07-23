"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  context: string;
  icon: ReactNode;
  color: string;
  progress?: number;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  context,
  icon,
  color,
  progress = 78,
  className = "",
  onClick
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
    >
              <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-250/60 dark:border-slate-700/50 h-full">
        {/* Animated Background Gradient */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`}
          animate={{
            background: [
              `linear-gradient(45deg, ${color.split(' ')[1]}, ${color.split(' ')[3]})`,
              `linear-gradient(135deg, ${color.split(' ')[3]}, ${color.split(' ')[1]})`,
              `linear-gradient(45deg, ${color.split(' ')[1]}, ${color.split(' ')[3]})`
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <div className="space-y-1 min-w-0 flex-1">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </CardTitle>
            <div className="text-2xl md:text-3xl font-bold tracking-tight">
              {value}
            </div>
            <div className="text-xs text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity mt-1 text-left">
              {context}
            </div>
          </div>
          <motion.div 
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
            whileHover={{ rotate: 10 }}
          >
            {icon}
          </motion.div>
        </CardHeader>
        
        <CardContent className="pt-0 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <Badge 
              variant="secondary" 
              className={`${trend === 'up' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              <TrendingUp className={`w-3 h-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {change}
            </Badge>
            
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Mini trend visualization - always visible */}
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{progress}% of goal</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          
          {/* Additional metric info - shows on hover */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>vs. last period</span>
              <span className="text-green-600 font-medium">↗ +{Math.floor(Math.random() * 20 + 5)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 