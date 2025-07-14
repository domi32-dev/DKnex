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
import { motion } from "framer-motion";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            {t('submissions.title' as const)}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('submissions.subtitle' as const)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button>
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
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('submissions.searchPlaceholder' as const)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('submissions.status.all' as any)}
          </Button>
          <Button
            variant={statusFilter === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("new")}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('submissions.status.new' as any)}
          </Button>
          <Button
            variant={statusFilter === "reviewed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("reviewed")}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('submissions.status.reviewed' as any)}
          </Button>
          <Button
            variant={statusFilter === "responded" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("responded")}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('submissions.status.responded' as any)}
          </Button>
        </div>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('submissions.recentSubmissions' as const)} ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {submission.submitterName.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{submission.submitterName}</h4>
                      {renderStars(submission.rating)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {submission.submitterEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <FormInput className="w-3 h-3" />
                        {submission.formName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(submission.submittedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
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
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('submissions.noSubmissionsFound' as const)}</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? t('submissions.tryAdjusting' as const)
                  : t('submissions.noSubmissionsMessage' as const)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {selectedSubmission.submitterName}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('submissions.form' as const)}</span>
                  <p className="font-semibold">{selectedSubmission.formName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('submissions.submitted' as const)}</span>
                  <p className="font-semibold">{formatDate(selectedSubmission.submittedAt)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('submissions.status' as const)}</span>
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
                    <p className="font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>

              {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">{t('submissions.attachments' as const)}</h4>
                  {selectedSubmission.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="w-4 h-4" />
                      <span className="flex-1">{file}</span>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 