"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  FileText,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  FormInput,
  Mail,
  Star,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/translations";

interface Submission {
  id: string;
  formName: string;
  formId: string;
  submittedAt: string;
  submitterName: string;
  submitterEmail: string;
  status: "new" | "reviewed" | "responded" | "archived";
  rating?: number;
  fields: Record<string, unknown>;
  attachments?: string[];
}

export function SubmissionsContent() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Mock data - replace with real API data
  const [submissions] = useState<Submission[]>([
    {
      id: "1",
      formName: "Contact Form",
      formId: "form-1",
      submittedAt: "2024-01-15T10:30:00Z",
      submitterName: "John Smith",
      submitterEmail: "john.smith@email.com",
      status: "new",
      fields: {
        name: "John Smith",
        email: "john.smith@email.com",
        subject: "Product Inquiry",
        message: "I'm interested in your premium package. Could you provide more details about pricing and features?",
        phone: "+1-555-0123",
        company: "Tech Solutions Inc."
      }
    },
    {
      id: "2",
      formName: "Job Application",
      formId: "form-2",
      submittedAt: "2024-01-14T14:45:00Z",
      submitterName: "Sarah Johnson",
      submitterEmail: "sarah.j@email.com",
      status: "reviewed",
      rating: 5,
      fields: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        position: "Frontend Developer",
        experience: "5 years",
        skills: "React, TypeScript, Next.js",
        message: "Experienced developer looking for new challenges in a dynamic team environment.",
        portfolio: "https://sarah-portfolio.com"
      },
      attachments: ["resume.pdf", "portfolio.pdf"]
    },
    {
      id: "3",
      formName: "Event Registration",
      formId: "form-3",
      submittedAt: "2024-01-13T09:15:00Z",
      submitterName: "Mike Davis",
      submitterEmail: "mike@email.com",
      status: "responded",
      rating: 4,
      fields: {
        name: "Mike Davis",
        email: "mike@email.com",
        eventType: "Workshop",
        attendees: "2",
        dietary: "Vegetarian",
        specialRequests: "Wheelchair accessible seating"
      }
    },
    {
      id: "4",
      formName: "Customer Feedback",
      formId: "form-1",
      submittedAt: "2024-01-12T16:20:00Z",
      submitterName: "Lisa Williams",
      submitterEmail: "lisa.w@email.com",
      status: "archived",
      rating: 3,
      fields: {
        name: "Lisa Williams",
        email: "lisa.w@email.com",
        rating: "8",
        feedback: "Great service overall, but delivery took longer than expected.",
        recommendation: "Yes"
      }
    },
    {
      id: "5",
      formName: "Support Request",
      formId: "form-4",
      submittedAt: "2024-01-11T11:30:00Z",
      submitterName: "David Brown",
      submitterEmail: "d.brown@email.com",
      status: "new",
      fields: {
        name: "David Brown",
        email: "d.brown@email.com",
        category: "Technical Issue",
        priority: "High",
        description: "Unable to access dashboard after recent update. Getting error 500.",
        urgency: "Business Critical"
      }
    }
  ]);

  const stats = [
    {
      title: t('submissions.totalSubmissions' as const),
      value: submissions.length.toString(),
      change: `+12% ${t('dashboard.thisMonth' as const)}`,
      trend: "up",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: t('submissions.newSubmissions' as const), 
      value: submissions.filter(s => s.status === "new").length.toString(),
      change: `+3 ${t('dashboard.today' as const)}`,
      trend: "up",
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: t('submissions.averageRating' as const),
      value: "4.2",
      change: `+0.3 ${t('dashboard.lastMonth' as const)}`,
      trend: "up", 
      icon: <Star className="w-5 h-5" />
    },
    {
      title: t('submissions.responseRate' as const),
      value: "94%",
      change: `+2% ${t('dashboard.thisWeek' as const)}`,
      trend: "up",
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submitterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.formName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "reviewed": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "responded": return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "archived": return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Clock className="w-3 h-3" />;
      case "reviewed": return <Eye className="w-3 h-3" />;
      case "responded": return <CheckCircle className="w-3 h-3" />;
      case "archived": return <FileText className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 space-y-8 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            {t('submissions.title' as const)}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('submissions.subtitle' as const)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filter
          </Button>
        </div>
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
            <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              {/* Animated gradient background for glassy effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-opacity pointer-events-none group-hover:from-blue-500/20 group-hover:to-purple-500/20"
                animate={{ opacity: [1, 0.95, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                whileHover={{ opacity: 0.15 }}
              />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4 z-10" />
          <Input
            placeholder={t('submissions.searchPlaceholder' as const)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-400/30"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" 
              : "bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
            }
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('submissions.status.all' as any)}
          </Button>
          <Button
            variant={statusFilter === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("new")}
            className={statusFilter === "new" 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" 
              : "bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
            }
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('submissions.status.new' as any)}
          </Button>
          <Button
            variant={statusFilter === "reviewed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("reviewed")}
            className={statusFilter === "reviewed" 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" 
              : "bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
            }
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('submissions.status.reviewed' as any)}
          </Button>
          <Button
            variant={statusFilter === "responded" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("responded")}
            className={statusFilter === "responded" 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" 
              : "bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
            }
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('submissions.status.responded' as any)}
          </Button>
        </div>
      </div>

      {/* Submissions Table */}
      <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
        {/* Animated gradient background for glassy effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-opacity pointer-events-none group-hover:from-blue-500/20 group-hover:to-purple-500/20"
          animate={{ opacity: [1, 0.95, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          whileHover={{ opacity: 0.15 }}
        />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {t('submissions.recentSubmissions' as const)} ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            {filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-white/40 dark:bg-slate-800/40 border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm hover:bg-blue-100/30 dark:hover:bg-blue-900/20 transition-all duration-200 gap-4 group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {submission.submitterName.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{submission.submitterName}</h4>
                      {renderStars(submission.rating)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{submission.submitterEmail}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <FormInput className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{submission.formName}</span>
                      </span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        {formatDate(submission.submittedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusColor(submission.status)}>
                    {getStatusIcon(submission.status)}
                    <span className="ml-1 capitalize">{submission.status}</span>
                  </Badge>
                  
                  {submission.attachments && submission.attachments.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {submission.attachments.length} {t('submissions.files' as const)}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                    className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto relative overflow-hidden">
                {/* Animated gradient background */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"
                  animate={{ opacity: [1, 0.95, 1] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 relative z-10" />
                <h3 className="text-xl font-semibold mb-2 relative z-10">{t('submissions.noSubmissionsFound' as const)}</h3>
                <p className="text-muted-foreground relative z-10">
                  {searchTerm || statusFilter !== "all" 
                    ? t('submissions.tryAdjusting' as const)
                    : t('submissions.noSubmissionsMessage' as const)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSubmission(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white/80 dark:bg-slate-900/80 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-xl relative overflow-hidden">
              {/* Animated gradient overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none rounded-2xl"
                animate={{ opacity: [1, 0.95, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {selectedSubmission.submitterName}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(null)}
                    className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('submissions.form' as const)}</span>
                  <p className="font-semibold">{selectedSubmission.formName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('submissions.submitted' as const)}</span>
                  <p className="font-semibold">{formatDate(selectedSubmission.submittedAt)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(selectedSubmission.status)}>
                    {selectedSubmission.status}
                  </Badge>
                </div>
                {selectedSubmission.rating && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">{t('submissions.rating' as const)}</span>
                    <div className="mt-1">{renderStars(selectedSubmission.rating)}</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">{t('submissions.submissionData' as const)}</h4>
                {Object.entries(selectedSubmission.fields).map(([key, value]) => (
                  <div key={key} className="border-l-2 border-primary/20 pl-4">
                    <span className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <p className="font-medium break-words">{String(value)}</p>
                  </div>
                ))}
              </div>

              {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">{t('submissions.attachments' as const)}</h4>
                  {selectedSubmission.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="w-4 h-4" />
                      <span className="flex-1 truncate">{file}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 