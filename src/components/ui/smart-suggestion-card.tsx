"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'ux' | 'conversion' | 'analytics';
  icon: ReactNode;
  estimatedImprovement: string;
  actionable: boolean;
}

interface SmartSuggestionCardProps {
  suggestions: SmartSuggestion[];
  className?: string;
  onTakeAction?: (suggestion: SmartSuggestion) => void;
}

export function SmartSuggestionCard({
  suggestions,
  className = "",
  onTakeAction
}: SmartSuggestionCardProps) {
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

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
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300"
          animate={{
            background: [
              'linear-gradient(45deg, rgb(99 102 241 / 0.05), rgb(168 85 247 / 0.05))',
              'linear-gradient(135deg, rgb(168 85 247 / 0.05), rgb(99 102 241 / 0.05))',
              'linear-gradient(45deg, rgb(99 102 241 / 0.05), rgb(168 85 247 / 0.05))'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                whileHover={{ rotate: 10 }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold">Smart Suggestions</h3>
                <p className="text-xs text-muted-foreground">AI-powered recommendations</p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
              {suggestions.length}
            </Badge>
          </div>

          {/* Suggestions List */}
          <div className="space-y-4">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group/item hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg p-3 transition-colors cursor-pointer"
                onClick={() => onTakeAction?.(suggestion)}
              >
                <div className="flex items-start gap-3">
                  {/* Impact Indicator */}
                  <div className="flex-shrink-0">
                    <motion.div 
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${getImpactColor(suggestion.impact)} flex items-center justify-center text-white text-xs font-bold group-hover/item:scale-110 transition-transform`}
                      whileHover={{ rotate: 180 }}
                    >
                      {suggestion.icon}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">
                        {suggestion.title}
                      </h4>
                      <Badge className={`${getImpactBadgeColor(suggestion.impact)} text-xs`}>
                        {suggestion.impact}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {suggestion.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-green-600">
                          {suggestion.estimatedImprovement}
                        </span>
                        <span className="text-xs text-muted-foreground">expected</span>
                      </div>
                      
                      {suggestion.actionable && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="opacity-0 group-hover/item:opacity-100 transition-opacity text-xs h-6 px-2"
                        >
                          Apply <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More Button */}
          {suggestions.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                View {suggestions.length - 3} more suggestions
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 