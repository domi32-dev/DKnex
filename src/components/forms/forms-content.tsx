'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, MoreVertical, FormInput, Eye, Edit, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/translations';

interface Form {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  isResponsive: boolean;
  fields: number;
  submissions: number;
  status: 'draft' | 'published' | 'archived';
}

export function FormsContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Sample forms data - replace with real data later
  const [forms] = useState<Form[]>([
    {
      id: '1',
      name: 'Contact Form',
      description: 'Simple contact form for customer inquiries',
      lastModified: '2 hours ago',
      isResponsive: true,
      fields: 5,
      submissions: 23,
      status: 'published'
    },
    {
      id: '2',
      name: 'Job Application',
      description: 'Comprehensive job application form with file uploads',
      lastModified: '1 day ago',
      isResponsive: true,
      fields: 12,
      submissions: 7,
      status: 'published'
    },
    {
      id: '3',
      name: 'Survey Draft',
      description: 'Customer satisfaction survey - work in progress',
      lastModified: '3 days ago',
      isResponsive: false,
      fields: 8,
      submissions: 0,
      status: 'draft'
    }
  ]);

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateForm = (isResponsive: boolean) => {
    setShowCreateForm(false);
    // Navigate to form builder with responsive setting
    router.push(`/forms/builder/new?responsive=${isResponsive}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {t('forms.title' as const)}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('forms.subtitle' as const)}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('forms.createNewForm' as const)}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('forms.search' as const)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-400/30"
          />
        </div>
        <Button 
          variant="ghost" 
          className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
        >
          <Filter className="w-4 h-4 mr-2" />
          {t('forms.filter' as const)}
        </Button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group cursor-pointer"
          >
            <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Animated gradient background for glassy effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-opacity pointer-events-none group-hover:from-blue-500/20 group-hover:to-purple-500/20"
                animate={{ opacity: [1, 0.95, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                whileHover={{ opacity: 0.15 }}
              />
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <FormInput className="w-5 h-5 text-primary" />
                    {form.name}
                  </CardTitle>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                    {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <p className="text-sm text-muted-foreground">
                  {form.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{form.fields} {t('forms.fields' as const)}</span>
                  <span>{form.submissions} {t('forms.submissions' as const)}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {t('forms.lastModified' as const)}: {form.lastModified}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/forms/builder/${form.id}`)}
                    className="flex-1 bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md hover:bg-blue-100/30 dark:hover:bg-blue-900/20 text-foreground"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {t('forms.edit' as const)}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/forms/${form.id}/preview`)}
                    className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md hover:bg-blue-100/30 dark:hover:bg-blue-900/20 text-foreground"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md hover:bg-blue-100/30 dark:hover:bg-blue-900/20 text-foreground"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <FormInput className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('forms.noFormsFound' as const)}</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? t('forms.tryAdjusting' as const) : t('forms.createFirstForm' as const)}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('forms.createFirstForm' as const)}
            </Button>
          )}
        </div>
      )}

      {/* Create Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-2xl shadow-2xl border border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 sm:p-4 md:p-6 lg:p-8 w-[95vw] max-w-[350px] sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[85vh] overflow-y-auto mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated gradient overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none rounded-2xl"
                animate={{ opacity: [1, 0.95, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 relative z-10">
                {t('forms.createNewForm' as const)}
              </h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base relative z-10">
                Choose the type of form you want to create
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative z-10">
                <Card 
                  className="relative p-3 sm:p-4 md:p-6 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-blue-200/40 dark:border-blue-800/40 backdrop-blur-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                  onClick={() => handleCreateForm(true)}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-opacity pointer-events-none rounded-xl"
                    animate={{ opacity: [1, 0.95, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-2 sm:mb-3 md:mb-4 relative z-10">
                    <FormInput className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 relative z-10">Responsive Form</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base relative z-10">
                    Create a form that adapts to different screen sizes
                  </p>
                </Card>
                <Card 
                  className="relative p-3 sm:p-4 md:p-6 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-blue-200/40 dark:border-blue-800/40 backdrop-blur-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                  onClick={() => handleCreateForm(false)}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-opacity pointer-events-none rounded-xl"
                    animate={{ opacity: [1, 0.95, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-2 sm:mb-3 md:mb-4 relative z-10">
                    <FormInput className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 relative z-10">Desktop Only</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base relative z-10">
                    Create a form optimized for desktop viewing
                  </p>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8 relative z-10">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCreateForm(false)}
                  className="w-full sm:w-auto text-sm sm:text-base bg-white/30 dark:bg-slate-900/30 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 