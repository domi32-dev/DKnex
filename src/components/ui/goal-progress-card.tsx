"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GoalProgressCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: ReactNode;
  color: string;
  description?: string;
  className?: string;
}

export function GoalProgressCard({
  title,
  current,
  target,
  unit,
  icon,
  color,
  description,
  className = ""
}: GoalProgressCardProps) {
  
  const percentage = Math.min((current / target) * 100, 100);
  const radius = 45;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group cursor-pointer ${className}`}
    >
      <div className="relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-250/60 dark:border-slate-700/50 rounded-xl p-6 h-full">
        
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

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                whileHover={{ rotate: 10 }}
              >
                {icon}
              </motion.div>
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {Math.round(percentage)}%
            </div>
          </div>

          {/* Circular Progress */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={`url(#gradient-progress-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id={`gradient-progress-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color.includes('blue') ? '#3b82f6' : color.includes('green') ? '#10b981' : '#f59e0b'} />
                    <stop offset="100%" stopColor={color.includes('purple') ? '#8b5cf6' : color.includes('emerald') ? '#059669' : '#dc2626'} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-lg font-bold">{current}</div>
                <div className="text-xs text-muted-foreground">of {target}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground text-center leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
              {description}
            </p>
          )}

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 