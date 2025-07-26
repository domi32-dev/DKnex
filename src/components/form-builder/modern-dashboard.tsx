"use client";

import { useState } from "react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import { AIInsightCard, AIInsight } from "@/components/ui/ai-insight-card";
import { DashboardSection } from "@/components/ui/dashboard-section";
import { MiniChartCard } from "@/components/ui/mini-chart-card";
import { GoalProgressCard } from "@/components/ui/goal-progress-card";
import { SmartSuggestionCard } from "@/components/ui/smart-suggestion-card";
import {
   FormInput,
   BarChart3,
   TrendingUp,
   Target,
   Activity,
   Brain,
   Zap,
   Settings,
   Clock,
   Users,
   Star,
   Smartphone,
   Eye,
   Save
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/translations";
import { useSession } from "next-auth/react";

interface DashboardWidget {
   id: string;
   title: string;
   type: 'metric' | 'chart' | 'list' | 'activity';
   order: number;
   visible: boolean;
}

interface MetricData {
   title: string;
   value: string;
   change: string;
   trend: 'up' | 'down';
   context: string;
   icon: React.ReactNode;
   color: string;
   progress: number;
}

export function ModernDashboard() {
   const { t } = useTranslation();
   const { data: session } = useSession();
   
   const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
   const [dashboardLayout, setDashboardLayout] = useState<DashboardWidget[]>([
      { id: 'metrics', title: 'Key Metrics', type: 'metric', order: 0, visible: true },
      { id: 'insights', title: 'AI Insights', type: 'chart', order: 1, visible: true },
      { id: 'recent', title: 'Recent Activity', type: 'activity', order: 2, visible: true },
      { id: 'forms', title: 'Quick Access', type: 'list', order: 3, visible: true },
   ]);

   // AI-powered insights
   const aiInsights: AIInsight[] = [
      {
         id: '1',
         type: 'recommendation',
         title: t('dashboard.aiInsightRecommendation1' as const),
         description: t('dashboard.aiInsightRecommendation1Desc' as const),
         confidence: 0.87,
         actionable: true,
         priority: 'high'
      },
      {
         id: '2',
         type: 'prediction',
         title: t('dashboard.aiInsightPrediction1' as const),
         description: t('dashboard.aiInsightPrediction1Desc' as const),
         confidence: 0.92,
         actionable: false,
         priority: 'medium'
      },
      {
         id: '3',
         type: 'anomaly',
         title: t('dashboard.aiInsightAnomaly1' as const),
         description: t('dashboard.aiInsightAnomaly1Desc' as const),
         confidence: 0.95,
         actionable: true,
         priority: 'high'
      }
   ];

   // Enhanced metrics with context and trends
   const smartMetrics: MetricData[] = [
      {
         title: t('dashboard.totalForms' as const),
         value: '24',
         change: '+3 ' + t('dashboard.thisWeek' as const),
         trend: 'up',
         context: t('dashboard.fasterGrowth' as const),
         icon: <FormInput className="w-5 h-5" />,
         color: 'from-blue-500 to-purple-500',
         progress: 78,
      },
      {
         title: t('dashboard.activeSubmissions' as const),
         value: '1,847',
         change: '+23% vs ' + t('dashboard.thisWeek' as const).slice(0, -1),
         trend: 'up',
         context: t('dashboard.highestWeekly' as const),
         icon: <BarChart3 className="w-5 h-5" />,
         color: 'from-green-500 to-emerald-500',
         progress: 85,
      },
      {
         title: t('dashboard.averageResponseTime' as const),
         value: '2.3min',
         change: '-12% ' + t('dashboard.improvement' as const),
         trend: 'up',
         context: t('dashboard.formsGettingEasier' as const),
         icon: <TrendingUp className="w-5 h-5" />,
         color: 'from-orange-500 to-red-500',
         progress: 62,
      },
      {
         title: t('dashboard.conversionRate' as const),
         value: '87.4%',
         change: '+5.2% ' + t('dashboard.thisMonth' as const),
         trend: 'up',
         context: t('dashboard.bestPerformance' as const),
         icon: <Target className="w-5 h-5" />,
         color: 'from-purple-500 to-indigo-500',
         progress: 87,
      },
   ];

   // Event handlers for AI insights
   const handleTakeAction = (insight: AIInsight) => {
      console.log('Taking action for insight:', insight.id);
      // Add your action logic here
   };

   const handleViewDetails = (insight: AIInsight) => {
      console.log('Viewing details for insight:', insight.id);
      // Add your view details logic here
   };

   return (
      <div className="min-h-screen p-6 space-y-8 max-w-full">
         
         {/* Modern Header with improved dark mode visibility */}
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0 flex-1">
               <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                     {t('dashboard.welcome' as const)}
                     {session?.user?.name ? `, ${session.user.name}` : ""}! 
                  </h1>
                  <motion.div
                     animate={{ rotate: [0, 10, -10, 0] }}
                     transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                     className="text-2xl md:text-3xl"
                  >
                     👋
                  </motion.div>
               </div>
               <p className="text-muted-foreground text-sm md:text-base dark:text-slate-300">
                  {t('dashboard.subtitle' as const)}
               </p>
            </div>
         </div>

         {/* AI Insights Section */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm"
         >
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                     <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-semibold text-lg">{t('dashboard.aiInsights' as const)}</h2>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                     {t('dashboard.aiInsightsLive' as const)}
                  </Badge>
               </div>
               <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
               </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {aiInsights.map((insight, index) => (
                  <AIInsightCard
                     key={insight.id}
                     insight={insight}
                     index={index}
                     onTakeAction={handleTakeAction}
                     onViewDetails={handleViewDetails}
                  />
               ))}
            </div>
         </motion.div>

         {/* Enhanced Metrics with Interactivity */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {smartMetrics.map((metric, index) => (
               <MetricCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  trend={metric.trend}
                  context={metric.context}
                  icon={metric.icon}
                  color={metric.color}
                  progress={metric.progress}
                  onClick={() => console.log(`Clicked ${metric.title}`)}
               />
            ))}
         </div>

         {/* Beautiful New Dashboard Sections - 2x2 + Smart Suggestions Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side: 2x2 Data Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Top Left */}
               <MiniChartCard
                  title={t('dashboard.weeklySubmissions' as const)}
                  value="1,847"
                  change="+23%"
                  trend="up"
                  icon={<BarChart3 className="w-4 h-4" />}
                  color="from-blue-500 to-indigo-500"
                  chartData={[45, 52, 38, 61, 56, 78, 89, 72, 84, 67, 91, 85]}
               />

               {/* Top Right */}
               <GoalProgressCard
                  title={t('dashboard.submissionsGoal' as const)}
                  current={1847}
                  target={2500}
                  unit="submissions"
                  icon={<Target className="w-5 h-5" />}
                  color="from-green-500 to-emerald-500"
                  description={t('dashboard.onTrackToReach' as const)}
               />

               {/* Bottom Left */}
               <MiniChartCard
                  title={t('dashboard.responseTimeChart' as const)}
                  value="2.3min"
                  change="-12%"
                  trend="up"
                  icon={<Clock className="w-4 h-4" />}
                  color="from-orange-500 to-red-500"
                  chartData={[320, 280, 290, 260, 240, 230, 210, 190, 180, 170, 165, 138]}
               />

               {/* Bottom Right */}
               <GoalProgressCard
                  title={t('dashboard.qualityGoal' as const)}
                  current={87}
                  target={95}
                  unit="score"
                  icon={<Star className="w-5 h-5" />}
                  color="from-purple-500 to-pink-500"
                  description={t('dashboard.aheadOfSchedule' as const)}
               />
            </div>

            {/* Right Side: Smart Suggestions - Full Height */}
            <div className="lg:row-span-1">
               <SmartSuggestionCard
                  suggestions={[
                     {
                        id: '1',
                        title: t('dashboard.optimizeFormTitles' as const),
                        description: t('dashboard.improveFormDiscoverability' as const),
                        impact: 'medium',
                        category: 'ux',
                        icon: <Eye className="w-3 h-3" />,
                        estimatedImprovement: '+15%',
                        actionable: true
                     },
                     {
                        id: '2',
                        title: t('dashboard.addProgressIndicators' as const),
                        description: t('dashboard.showUsersFormProgress' as const),
                        impact: 'high',
                        category: 'ux',
                        icon: <Activity className="w-3 h-3" />,
                        estimatedImprovement: '+25%',
                        actionable: true
                     },
                     {
                        id: '3',
                        title: t('dashboard.enableAutoSave' as const),
                        description: t('dashboard.preventDataLossUsers' as const),
                        impact: 'high',
                        category: 'performance',
                        icon: <Save className="w-3 h-3" />,
                        estimatedImprovement: '+18%',
                        actionable: true
                     },
                     {
                        id: '4',
                        title: t('dashboard.optimizeMobile' as const),
                        description: t('dashboard.usersAccessMobile' as const),
                        impact: 'medium',
                        category: 'performance',
                        icon: <Smartphone className="w-3 h-3" />,
                        estimatedImprovement: '+12%',
                        actionable: true
                     }
                  ]}
                  onTakeAction={(suggestion) => console.log('Taking action:', suggestion.id)}
                  className="h-full"
               />
            </div>
         </div>

         {/* What's New Section */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="group"
         >
            <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border border-slate-250/60 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
            
            {/* Animated Background Gradient */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-opacity"
              animate={{
                background: [
                  'linear-gradient(45deg, rgb(168 85 247 / 0.05), rgb(59 130 246 / 0.05))',
                  'linear-gradient(135deg, rgb(59 130 246 / 0.05), rgb(168 85 247 / 0.05))',
                  'linear-gradient(45deg, rgb(168 85 247 / 0.05), rgb(59 130 246 / 0.05))'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <CardHeader className="relative z-10">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                     <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                     >
                        ✨
                     </motion.div>
                     {t('dashboard.whatsNewInDkNex' as const)}
                  </CardTitle>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                     v2.1.0
                  </Badge>
               </div>
            </CardHeader>
            <CardContent className="relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                     {
                        title: t('dashboard.aiPoweredInsights' as const),
                        desc: t('dashboard.aiInsightGetSmartRecommendations' as const),
                        icon: "🧠",
                        new: true
                     },
                     {
                        title: t('dashboard.commandPalette' as const),
                        desc: t('dashboard.commandPaletteNavigateFaster' as const),
                        icon: "⚡",
                        new: true
                     },
                     {
                        title: t('dashboard.modernDashboard' as const),
                        desc: t('dashboard.modernDashboardRedesigned' as const),
                        icon: "🎨",
                        new: false
                     }
                  ].map((feature, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/20 dark:bg-slate-700/20 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-colors cursor-pointer backdrop-blur-sm border border-white/10 dark:border-slate-600/10"
                     >
                        <span className="text-xl flex-shrink-0">{feature.icon}</span>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{feature.title}</h4>
                              {feature.new && (
                                 <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                                    {t('dashboard.new' as const)}
                                 </Badge>
                              )}
                           </div>
                           <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>
               <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-muted-foreground">
                        🚀 {t('dashboard.readyToExplore' as const)}
                     </p>
                     <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-sm">
                           {t('dashboard.releaseNotes' as const)}
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                           {t('dashboard.tryAltK' as const)}
                        </Button>
                     </div>
                  </div>
               </div>
            </CardContent>
            </Card>
         </motion.div>
      </div>
   );
} 