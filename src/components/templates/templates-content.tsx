'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, FormInput, Users, Briefcase, Heart, ShoppingCart, MessageSquare, Calendar, FileText, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/translations';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  fields: number;
  color: string;
  popular: boolean;
}

export function TemplatesContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Contact Form',
      description: 'Simple contact form for customer inquiries',
      category: 'Business',
      icon: <MessageSquare className="w-6 h-6" />,
      fields: 5,
      color: 'from-blue-500 to-cyan-500',
      popular: true
    },
    {
      id: '2',
      name: 'Job Application',
      description: 'Comprehensive job application with file uploads',
      category: 'HR',
      icon: <Briefcase className="w-6 h-6" />,
      fields: 12,
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: '3',
      name: 'Event Registration',
      description: 'Event registration form with payment integration',
      category: 'Events',
      icon: <Calendar className="w-6 h-6" />,
      fields: 8,
      color: 'from-green-500 to-emerald-500',
      popular: false
    },
    {
      id: '4',
      name: 'Customer Survey',
      description: 'Customer satisfaction survey with rating scales',
      category: 'Research',
      icon: <Users className="w-6 h-6" />,
      fields: 10,
      color: 'from-orange-500 to-red-500',
      popular: true
    },
    {
      id: '5',
      name: 'Order Form',
      description: 'Product order form with quantity and pricing',
      category: 'E-commerce',
      icon: <ShoppingCart className="w-6 h-6" />,
      fields: 7,
      color: 'from-indigo-500 to-purple-500',
      popular: false
    },
    {
      id: '6',
      name: 'Feedback Form',
      description: 'General feedback form for services or products',
      category: 'Business',
      icon: <Heart className="w-6 h-6" />,
      fields: 6,
      color: 'from-pink-500 to-rose-500',
      popular: false
    },
    {
      id: '7',
      name: 'Newsletter Signup',
      description: 'Simple newsletter subscription form',
      category: 'Marketing',
      icon: <FileText className="w-6 h-6" />,
      fields: 3,
      color: 'from-teal-500 to-cyan-500',
      popular: true
    },
    {
      id: '8',
      name: 'Support Ticket',
      description: 'Customer support ticket submission form',
      category: 'Support',
      icon: <MessageSquare className="w-6 h-6" />,
      fields: 9,
      color: 'from-amber-500 to-orange-500',
      popular: false
    }
  ];

  const categories = ['All', 'Business', 'HR', 'Events', 'Research', 'E-commerce', 'Marketing', 'Support'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (templateId: string) => {
    router.push(`/forms/builder/new?template=${templateId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{t('templates.title' as const)}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('templates.subtitle' as const)}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('templates.searchPlaceholder' as const)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Popular Templates */}
      {selectedCategory === 'All' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">{t('templates.mostPopular' as const)}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.filter(t => t.popular).map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-white mb-3`}>
                      {template.icon}
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{template.fields} {t('forms.fields' as const)}</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {template.category}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      {t('templates.useTemplate' as const)}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {selectedCategory === 'All' ? t('templates.browseAll' as const) : `${selectedCategory} Templates`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-white`}>
                      {template.icon}
                    </div>
                    {template.popular && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground flex-1">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{template.fields} {t('forms.fields' as const)}</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    {t('templates.useTemplate' as const)}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FormInput className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('templates.noTemplatesFound' as const)}</h3>
          <p className="text-muted-foreground mb-6">
            {t('templates.tryAdjusting' as const)}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 