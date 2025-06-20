'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, MoreVertical, FormInput, Eye, Edit, Trash2, Copy } from 'lucide-react';
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
          <h1 className="text-3xl font-bold">My Forms</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your forms
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
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
          >
            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
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
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {form.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{form.fields} fields</span>
                  <span>{form.submissions} submissions</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last modified: {form.lastModified}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/forms/builder/${form.id}`)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/forms/${form.id}/preview`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
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
          <h3 className="text-xl font-semibold mb-2">No forms found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first form to get started'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Form
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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-lg shadow-xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Create New Form</h2>
              <p className="text-muted-foreground mb-8">Choose the type of form you want to create</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  className="p-6 hover:border-primary/50 transition-colors cursor-pointer hover:shadow-lg" 
                  onClick={() => handleCreateForm(true)}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
                    <FormInput className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Responsive Form</h3>
                  <p className="text-muted-foreground">Create a form that adapts to different screen sizes</p>
                </Card>
                
                <Card 
                  className="p-6 hover:border-primary/50 transition-colors cursor-pointer hover:shadow-lg" 
                  onClick={() => handleCreateForm(false)}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white mb-4">
                    <FormInput className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Desktop Only</h3>
                  <p className="text-muted-foreground">Create a form optimized for desktop viewing</p>
                </Card>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
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