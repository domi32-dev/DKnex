'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  Plus,
  Crown
} from 'lucide-react';
import { FormField, FieldTemplate } from '../types';
import { fieldCategories, fieldTypes, defaultTemplates } from '../constants';
import { getFieldIcon } from '../utils';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  collapsedCategories: Record<string, boolean>;
  toggleCategory: (category: string) => void;
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  fieldTemplates: FieldTemplate[];
  onAddField: (type: FormField['type'], template?: FieldTemplate) => void;
  onShowOnboarding: () => void;
}

export function Sidebar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  collapsedCategories,
  toggleCategory,
  showTemplates,
  setShowTemplates,
  fieldTemplates,
  onAddField,
  onShowOnboarding
}: SidebarProps) {
  const filteredFieldTypes = fieldTypes.filter(fieldType => {
    const matchesSearch = searchQuery === '' || 
      fieldType.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fieldType.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fieldType.keywords.some(keyword => keyword.includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || fieldType.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedFieldTypes = filteredFieldTypes.reduce((acc, fieldType) => {
    if (!acc[fieldType.category]) {
      acc[fieldType.category] = [];
    }
    acc[fieldType.category].push(fieldType);
    return acc;
  }, {} as Record<string, typeof fieldTypes>);

  return (
    <div className="w-80 bg-card border-r overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Form Elements</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onShowOnboarding}>
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get help with form building</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {Object.entries(fieldCategories).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className="flex items-center gap-1"
            >
              <div className={`w-2 h-2 rounded-full ${category.color}`} />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Templates Section */}
        <Collapsible
          open={showTemplates}
          onOpenChange={setShowTemplates}
        >
          <CollapsibleTrigger className="w-full justify-between p-2 bg-transparent border-none hover:bg-muted rounded-md flex items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Field Templates</span>
              <Badge variant="secondary" className="text-xs">
                {fieldTemplates.length}
              </Badge>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {fieldTemplates.map((template) => (
              <Button
                key={template.id}
                variant="ghost"
                className="w-full justify-start p-3 h-auto hover:bg-muted/50 transition-colors"
                onClick={() => onAddField(template.field.type as FormField['type'], template)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                    {template.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {template.name}
                      {template.isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Field Categories */}
        <div className="space-y-2">
          {Object.entries(groupedFieldTypes).map(([categoryKey, categoryFields]) => {
            const category = fieldCategories[categoryKey as keyof typeof fieldCategories];
            if (!category) return null;

            return (
              <Collapsible
                key={categoryKey}
                open={!collapsedCategories[categoryKey]}
                onOpenChange={() => toggleCategory(categoryKey)}
              >
                <CollapsibleTrigger className="w-full justify-between p-2 bg-transparent border-none hover:bg-muted rounded-md flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center text-white flex-shrink-0`}>
                      {category.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{category.label}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {categoryFields.length}
                    </Badge>
                    <ChevronDown className={`w-4 h-4 transition-transform ${!collapsedCategories[categoryKey] ? 'rotate-180' : ''}`} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-2">
                  {categoryFields.map((fieldType) => (
                    <Button
                      key={fieldType.type}
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto hover:bg-muted/50 transition-colors"
                      onClick={() => onAddField(fieldType.type as FormField['type'])}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded ${category.color} flex items-center justify-center text-white flex-shrink-0`}>
                          {getFieldIcon(fieldType.type)}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{fieldType.label}</div>
                          <div className="text-xs text-muted-foreground">{fieldType.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
} 