"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MiniChartCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: ReactNode;
  color: string;
  chartData?: number[];
  className?: string;
}

export function MiniChartCard({
  title,
  value,
  change,
  trend,
  icon,
  color,
  chartData = [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
  className = ""
}: MiniChartCardProps) {
  
  const maxValue = Math.max(...chartData);
  const minValue = Math.min(...chartData);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group cursor-pointer ${className}`}
    >
      <div className="relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-250/60 dark:border-slate-700/50 rounded-xl p-4 h-full flex flex-col">
        
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

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                whileHover={{ rotate: 10 }}
              >
                {icon}
              </motion.div>
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{value}</div>
              <div className={`text-xs font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="relative h-12 mb-3">
            <svg viewBox={`0 0 ${chartData.length * 10} 60`} className="w-full h-full">
              <motion.polyline
                fill="none"
                stroke={`url(#gradient-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
                strokeWidth="2.5"
                points={chartData
                  .map((value, index) => {
                    const x = index * 10;
                    const y = 60 - ((value - minValue) / (maxValue - minValue)) * 40;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <defs>
                <linearGradient id={`gradient-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={color.includes('blue') ? '#3b82f6' : color.includes('green') ? '#10b981' : '#f59e0b'} />
                  <stop offset="100%" stopColor={color.includes('purple') ? '#8b5cf6' : color.includes('emerald') ? '#059669' : '#dc2626'} />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Chart Points */}
          <div className="flex justify-between text-xs text-muted-foreground mt-auto">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 