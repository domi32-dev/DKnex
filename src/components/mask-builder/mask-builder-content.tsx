'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import FormBuilder from './FormBuilder';
import { useRouter } from 'next/navigation';

interface Form {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  isResponsive: boolean;
  fields: any[];
}

export function MaskBuilderContent() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      name: 'Contact Form',
      description: 'A simple contact form with name, email, and message fields',
      lastModified: '2024-03-20',
      isResponsive: true,
      fields: [],
    },
    {
      id: '2',
      name: 'Registration Form',
      description: 'User registration form with validation',
      lastModified: '2024-03-19',
      isResponsive: true,
      fields: [],
    },
  ]);

  const handleCreateForm = (isResponsive: boolean) => {
    const newForm: Form = {
      id: Date.now().toString(),
      name: `New Form ${forms.length + 1}`,
      description: 'A new form',
      lastModified: new Date().toISOString().split('T')[0],
      isResponsive,
      fields: [],
    };
    setForms([...forms, newForm]);
    setShowCreateForm(false);
    router.push(`/mask-builder/designer/${newForm.id}`);
  };

  const handleFormChange = (formId: string, fields: any[]) => {
    setForms(forms.map(form => 
      form.id === formId ? { ...form, fields, lastModified: new Date().toISOString().split('T')[0] } : form
    ));
  };

  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-blue-900 dark:text-white tracking-tight drop-shadow-lg">
          Mask Builder
        </h1>
        <Button
          size="lg"
          onClick={() => setShowCreateForm(true)}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Form
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/mask-builder/designer/${form.id}`)}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{form.name}</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {form.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Last modified: {form.lastModified}</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {form.isResponsive ? 'Responsive' : 'Desktop'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          >
            <div className="flex items-center justify-center min-h-screen">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4"
              >
                <h2 className="text-3xl font-bold text-foreground mb-4">Create New Form</h2>
                <p className="text-muted-foreground mb-8">Choose the type of form you want to create</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card 
                    className="p-6 hover:border-primary/50 transition-colors cursor-pointer" 
                    onClick={() => handleCreateForm(true)}
                  >
                    <h3 className="text-xl font-semibold mb-2">Responsive Form</h3>
                    <p className="text-muted-foreground">Create a form that adapts to different screen sizes</p>
                  </Card>
                  
                  <Card 
                    className="p-6 hover:border-primary/50 transition-colors cursor-pointer" 
                    onClick={() => handleCreateForm(false)}
                  >
                    <h3 className="text-xl font-semibold mb-2">Desktop Only</h3>
                    <p className="text-muted-foreground">Create a form optimized for desktop viewing</p>
                  </Card>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 