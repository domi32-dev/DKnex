"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Brain, Zap, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'anomaly' | 'trend';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface AIInsightCardProps {
  insight: AIInsight;
  index?: number;
  onTakeAction?: (insight: AIInsight) => void;
  onViewDetails?: (insight: AIInsight) => void;
  className?: string;
}

export function AIInsightCard({ 
  insight, 
  index = 0, 
  onTakeAction, 
  onViewDetails, 
  className = "" 
}: AIInsightCardProps) {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getInsightIcon = (type: string): ReactNode => {
    switch (type) {
      case 'recommendation': return <Sparkles className="w-4 h-4" />;
      case 'prediction': return <Brain className="w-4 h-4" />;
      case 'anomaly': return <Zap className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-250/60 dark:border-slate-700/50 hover:shadow-lg transition-all cursor-pointer group backdrop-blur-sm relative overflow-hidden ${className}`}
      whileHover={{ y: -2 }}
    >
      {/* Floating particles animation */}
      <motion.div
        className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl"
        animate={{
          x: [0, 10, 0],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div 
            className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {getInsightIcon(insight.type)}
          </motion.div>
          <Badge className={getPriorityColor(insight.priority)} variant="secondary">
            {insight.priority}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Confidence</div>
          <div className="text-sm font-bold text-green-600">
            {Math.round(insight.confidence * 100)}%
          </div>
        </div>
      </div>
      
      <h3 className="font-semibold text-base mb-2 group-hover:text-blue-600 transition-colors leading-tight">
        {insight.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {insight.description}
      </p>

      {/* Progress bar for confidence */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>AI Confidence</span>
          <span>{Math.round(insight.confidence * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${insight.confidence * 100}%` }}
            transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        {insight.actionable && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs p-0 h-auto transition-colors hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            onClick={() => onTakeAction?.(insight)}
          >
            Take action <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
          onClick={() => onViewDetails?.(insight)}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
} 