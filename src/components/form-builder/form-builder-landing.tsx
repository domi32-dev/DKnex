'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FormInput, Eye, Edit, BarChart3, Clock, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/translations';
import { useSession } from 'next-auth/react';

export function FormBuilderLanding() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session } = useSession();

  // Sample data - replace with real data later
  const recentForms = [
    {
      id: '1',
      name: 'Contact Form',
      lastModified: '2 hours ago',
      submissions: 23,
      status: 'published'
    },
    {
      id: '2',
      name: 'Job Application',
      lastModified: '1 day ago',
      submissions: 7,
      status: 'published'
    },
    {
      id: '3',
      name: 'Survey Draft',
      lastModified: '3 days ago',
      submissions: 0,
      status: 'draft'
    }
  ];

  const stats = [
    { 
      title: 'Total Forms', 
      value: '12', 
      change: '+2 this week',
      trend: 'up',
      icon: <FormInput className="w-5 h-5" />
    },
    { 
      title: 'Total Submissions', 
      value: '1,247', 
      change: '+18% this month',
      trend: 'up',
      icon: <BarChart3 className="w-5 h-5" />
    },
    { 
      title: 'Active Forms', 
      value: '8', 
      change: '3 published today',
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5" />
    },
    { 
      title: 'Response Rate', 
      value: '84%', 
      change: '+5% vs last month',
      trend: 'up',
      icon: <Users className="w-5 h-5" />
    }
  ];

  const quickActions = [
    {
      title: 'Create New Form',
      description: 'Start building a form from scratch',
      icon: <Plus className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-500',
      action: () => router.push('/forms')
    },
    {
      title: 'Browse Templates',
      description: 'Use a pre-built template',
      icon: <FormInput className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      action: () => router.push('/templates')
    },
    {
      title: 'View Submissions',
      description: 'Check recent form responses',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      action: () => router.push('/submissions')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your forms today
          </p>
        </div>
                 <Button
           onClick={() => router.push('/forms')}
           className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white"
         >
           <Plus className="w-4 h-4 mr-2" />
           Create New Form
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
             <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border"> 
               {/* Background decoration */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
               
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                 <div className="space-y-1">
                   <CardTitle className="text-sm font-medium text-muted-foreground">
                     {stat.title}
                   </CardTitle>
                   <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                 </div>
                 <div className="flex-shrink-0">
                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                     {stat.icon}
                   </div>
                 </div>
               </CardHeader>
               <CardContent className="pt-0">
                 <div className="flex items-center space-x-2">
                   <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                     stat.trend === 'up' 
                       ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                       : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                   }`}>
                     <TrendingUp className={`w-3 h-3 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                     {stat.change}
                   </div>
                 </div>
                 
                 {/* Mini progress bar */}
                 <div className="mt-3">
                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                     <div 
                       className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-1000" 
                       style={{ width: `${Math.min(100, (parseInt(stat.value.replace(/[^\d]/g, '')) / 2000) * 100)}%` }}
                     />
                   </div>
                 </div>
               </CardContent>
             </Card>
           </motion.div>
         ))}
       </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Forms</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/forms')}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentForms.map((form) => (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      <FormInput className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{form.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {form.lastModified}
                        </span>
                        <span>{form.submissions} submissions</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(form.status)}`}>
                          {form.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                  <Button onClick={() => router.push('/forms')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Form
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
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
                    className="w-full h-auto p-4 justify-start hover:shadow-md transition-all"
                    onClick={action.action}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mr-3`}>
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                💡 Pro Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use templates to create forms faster. Our job application template includes all the fields you need and can be customized to match your brand.
              </p>
              <Button
                variant="link"
                className="p-0 mt-2 h-auto text-blue-600 dark:text-blue-400"
                onClick={() => router.push('/templates')}
              >
                Browse Templates →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 