"use client";

// import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
   Plus,
   FormInput,
   Eye,
   Edit,
   BarChart3,
   Clock,
   TrendingUp,
   Users,
   ArrowRight,
   Activity,
   HelpCircle,
   Calendar,
   CheckCircle,
   AlertCircle,
   Star,
   Download,
   Share2,
   Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/translations";
import { useSession } from "next-auth/react";

export function FormBuilderLanding() {
   const router = useRouter();
   const { t } = useTranslation();
   const { data: session } = useSession();

   // Sample data - replace with real data later
   const recentForms = [
      {
         id: "1",
         name: "Contact Form",
         lastModified: "2 hours ago",
         submissions: 23,
         status: "published",
      },
      {
         id: "2",
         name: "Job Application",
         lastModified: "1 day ago",
         submissions: 7,
         status: "published",
      },
      {
         id: "3",
         name: "Survey Draft",
         lastModified: "3 days ago",
         submissions: 0,
         status: "draft",
      },
   ];

   const stats = [
      {
         title: t('dashboard.totalForms' as const),
         value: "12",
         change: `+2 ${t('dashboard.thisWeek' as const)}`,
         trend: "up",
         icon: <FormInput className="w-5 h-5" />,
      },
      {
         title: t('dashboard.totalSubmissions' as const),
         value: "1,247",
         change: `+18% ${t('dashboard.thisMonth' as const)}`,
         trend: "up",
         icon: <BarChart3 className="w-5 h-5" />,
      },
      {
         title: t('dashboard.activeForms' as const),
         value: "8",
         change: `3 ${t('dashboard.publishedToday' as const)}`,
         trend: "up",
         icon: <TrendingUp className="w-5 h-5" />,
      },
      {
         title: t('dashboard.responseRate' as const),
         value: "84%",
         change: `+5% ${t('dashboard.lastMonth' as const)}`,
         trend: "up",
         icon: <Users className="w-5 h-5" />,
      },
   ];

   const quickActions = [
      {
         title: t('forms.createNewForm' as const),
         description: t('forms.subtitle' as const),
         icon: <Plus className="w-6 h-6" />,
         color: "from-blue-500 to-purple-500",
         action: () => router.push("/forms"),
      },
      {
         title: t('navigation.templates' as const),
         description: "Use a pre-built template",
         icon: <FormInput className="w-6 h-6" />,
         color: "from-purple-500 to-indigo-500",
         action: () => router.push("/templates"),
      },
              {
          title: t('navigation.submissions' as const),
          description: "Check recent form responses",
          icon: <BarChart3 className="w-6 h-6" />,
          color: "from-indigo-500 to-blue-500",
          action: () => router.push("/submissions"),
       },
   ];

   const recentActivity = [
      {
         id: 1,
         action: "New submission received",
         form: "Contact Form",
         time: "2 minutes ago",
         type: "submission",
         icon: <CheckCircle className="w-4 h-4" />,
      },
      {
         id: 2,
         action: "Form published",
         form: "Event Registration",
         time: "1 hour ago",
         type: "publish",
         icon: <Zap className="w-4 h-4" />,
      },
      {
         id: 3,
         action: "Form shared",
         form: "Customer Survey",
         time: "3 hours ago",
         type: "share",
         icon: <Share2 className="w-4 h-4" />,
      },
      {
         id: 4,
         action: "Template downloaded",
         form: "Job Application",
         time: "1 day ago",
         type: "download",
         icon: <Download className="w-4 h-4" />,
      },
   ];

   const helpItems = [
      {
         title: "Getting Started Guide",
         description: "Learn the basics of form building",
         icon: <HelpCircle className="w-4 h-4" />,
      },
      {
         title: "Advanced Features",
         description: "Conditional logic and integrations",
         icon: <Star className="w-4 h-4" />,
      },
      {
         title: "API Documentation",
         description: "Integrate with your apps",
         icon: <FormInput className="w-4 h-4" />,
      },
   ];

   const upcomingEvents = [
      {
         title: "Monthly Report Due",
         date: "Tomorrow",
         type: "report",
      },
      {
         title: "Form Review Meeting",
         date: "Friday 2 PM",
         type: "meeting",
      },
      {
         title: "System Maintenance",
         date: "Next Monday",
         type: "maintenance",
      },
   ];

   const getStatusColor = (status: string) => {
      switch (status) {
         case "published":
            return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
         case "draft":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
         default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      }
   };

   return (
      <div className="min-h-screen p-6 space-y-8 max-w-full overflow-hidden">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0 flex-1">
               <h1 className="text-2xl md:text-3xl font-bold truncate">
                  {t('dashboard.welcome' as const)}
                  {session?.user?.name ? `, ${session.user.name}` : ""}! 👋
               </h1>
               <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  {t('dashboard.subtitle' as const)}
               </p>
            </div>
            <Button
               onClick={() => router.push("/forms")}
               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white whitespace-nowrap"
            >
               <Plus className="w-4 h-4 mr-2" />
               {t('dashboard.createNewForm' as const)}
            </Button>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
               <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
               >
                  <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border h-full">
                     {/* Background decoration */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />

                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <div className="space-y-1 min-w-0 flex-1">
                           <CardTitle className="text-sm font-medium text-muted-foreground truncate">
                              {stat.title}
                           </CardTitle>
                           <div className="text-2xl md:text-3xl font-bold tracking-tight">
                              {stat.value}
                           </div>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                           <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                              {stat.icon}
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent className="pt-0">
                        <div className="flex items-center space-x-2">
                           <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium truncate max-w-full ${
                                 stat.trend === "up"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              }`}
                           >
                              <TrendingUp
                                 className={`w-3 h-3 mr-1 flex-shrink-0 ${
                                    stat.trend === "down" ? "rotate-180" : ""
                                 }`}
                              />
                              <span className="truncate">{stat.change}</span>
                           </div>
                        </div>

                        {/* Mini progress bar */}
                        <div className="mt-3">
                           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div
                                 className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-1000"
                                 style={{
                                    width: `${Math.min(
                                       100,
                                       (parseInt(
                                          stat.value.replace(/[^\d]/g, "")
                                       ) /
                                          2000) *
                                          100
                                    )}%`,
                                 }}
                              />
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </motion.div>
            ))}
         </div>

         {/* Second Row - Main Content */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Forms */}
            <Card className="overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg md:text-xl truncate flex-1">{t('dashboard.recentForms' as const)}</CardTitle>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => router.push("/forms")}
                     className="whitespace-nowrap ml-2"
                  >
                     <span className="hidden sm:inline">View All</span>
                     <ArrowRight className="w-4 h-4 sm:ml-1" />
                  </Button>
               </CardHeader>
               <CardContent className="space-y-4">
                  {recentForms.map((form) => (
                     <div
                        key={form.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors overflow-hidden"
                     >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                           <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                              <FormInput className="w-5 h-5" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <h4 className="font-medium truncate">{form.name}</h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                                 <span className="flex items-center gap-1 flex-shrink-0">
                                    <Clock className="w-3 h-3" />
                                    <span className="truncate">{form.lastModified}</span>
                                 </span>
                                 <span className="truncate">{form.submissions} submissions</span>
                                 <span
                                    className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(
                                       form.status
                                    )}`}
                                 >
                                    {form.status}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                           <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                           </Button>
                           <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                           </Button>
                        </div>
                     </div>
                  ))}

                  {recentForms.length === 0 && (
                     <div className="text-center py-8">
                        <FormInput className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No forms yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                           Create your first form to get started
                        </p>
                        <Button onClick={() => router.push("/forms")}>
                           <Plus className="w-4 h-4 mr-2" />
                           Create Form
                        </Button>
                     </div>
                  )}
               </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-lg md:text-xl truncate">{t('dashboard.quickActions' as const)}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {quickActions.map((action, index) => (
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                     >
                        <Button
                           variant="outline"
                           className="w-full h-auto p-4 justify-start hover:shadow-md transition-all overflow-hidden"
                           onClick={action.action}
                        >
                           <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mr-3 flex-shrink-0`}
                           >
                              {action.icon}
                           </div>
                           <div className="text-left min-w-0 flex-1">
                              <div className="font-medium truncate">{action.title}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                 {action.description}
                              </div>
                           </div>
                        </Button>
                     </motion.div>
                  ))}
               </CardContent>
            </Card>

            {/* Pro Tip */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800 overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     💡 {t('dashboard.proTip' as const)}
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                     Use templates to create forms faster. Our job application
                     template includes all the fields you need and can be
                     customized to match your brand.
                  </p>
                  <Button
                     variant="link"
                     className="p-0 mt-2 h-auto text-blue-600 dark:text-blue-400"
                     onClick={() => router.push("/templates")}
                  >
                     Browse Templates →
                  </Button>
               </CardContent>
            </Card>
         </div>

         {/* Third Row - Activity & Status */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recent Activity */}
            <Card className="overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <Activity className="w-5 h-5" />
                     <span className="truncate">{t('dashboard.recentActivity' as const)}</span>
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  {recentActivity.map((activity) => (
                     <div
                        key={activity.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors overflow-hidden"
                     >
                        <div
                           className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              activity.type === "submission"
                                 ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                                 : activity.type === "publish"
                                 ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                                 : activity.type === "share"
                                 ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20"
                                 : "bg-orange-100 text-orange-600 dark:bg-orange-900/20"
                           }`}
                        >
                           {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium truncate">
                              {activity.action}
                           </p>
                           <p className="text-xs text-muted-foreground truncate">
                              {activity.form} • {activity.time}
                           </p>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <Calendar className="w-5 h-5" />
                     <span className="truncate">{t('dashboard.upcoming' as const)}</span>
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                     <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors overflow-hidden"
                     >
                        <div
                           className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              event.type === "report"
                                 ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20"
                                 : event.type === "meeting"
                                 ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                                 : "bg-red-100 text-red-600 dark:bg-red-900/20"
                           }`}
                        >
                           {event.type === "report" ? (
                              <BarChart3 className="w-4 h-4" />
                           ) : event.type === "meeting" ? (
                              <Users className="w-4 h-4" />
                           ) : (
                              <AlertCircle className="w-4 h-4" />
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium truncate">
                              {event.title}
                           </p>
                           <p className="text-xs text-muted-foreground truncate">
                              {event.date}
                           </p>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>

            {/* Help & Resources */}
            <Card className="overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <HelpCircle className="w-5 h-5" />
                     <span className="truncate">{t('dashboard.helpResources' as const)}</span>
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  {helpItems.map((item, index) => (
                     <button
                        key={index}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left overflow-hidden"
                        onClick={() => {
                           /* Add navigation */
                        }}
                     >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                           {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium truncate">
                              {item.title}
                           </p>
                           <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                           </p>
                        </div>
                     </button>
                  ))}
               </CardContent>
            </Card>

            {/* System Status */}
            <Card className="overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <Zap className="w-5 h-5" />
                     <span className="truncate">{t('dashboard.systemStatus' as const)}</span>
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium truncate flex-1">API Status</span>
                     <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">
                           Operational
                        </span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium truncate flex-1">Database</span>
                     <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium truncate flex-1">Email Service</span>
                     <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-yellow-600">
                           Degraded
                        </span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium truncate flex-1">CDN</span>
                     <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Fast</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Fourth Row - Performance Chart */}
         <Card className="overflow-hidden">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="truncate">{t('dashboard.performanceOverview' as const)}</span>
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="h-48 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center">
                     <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                     <p className="text-sm text-muted-foreground">
                        Chart will be rendered here
                     </p>
                     <p className="text-xs text-muted-foreground mt-1">
                        Integration with Recharts coming soon
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
