'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Search, 
  Trash2, 
  HelpCircle,
  ChevronDown,
  Sparkles,
  Crown,
  Package,
  Edit
} from 'lucide-react';
import { FormField, FieldTemplate, CustomFieldType } from '../types';
import { fieldCategories, fieldTypes, categoryIconMap } from '../constants';
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
  customFieldTypes: CustomFieldType[];
  onAddField: (type: FormField['type'], template?: FieldTemplate, customId?: string) => void;
  onDeleteCustomFieldType: (componentId: string) => void;
  onEditCustomFieldType: (componentId: string) => void;
  onShowOnboarding: () => void;
}

// Type for field type with custom properties
interface ExtendedFieldType {
  type: FormField['type'];
  label: string;
  description: string;
  category: string;
  keywords: string[];
  uniqueKey: string;
  customId?: string;
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
  customFieldTypes,
  onAddField,
  onDeleteCustomFieldType,
  onEditCustomFieldType,
  onShowOnboarding
}: SidebarProps) {
  // Merge built-in field types with custom field types
  const allFieldTypes: ExtendedFieldType[] = [
    ...fieldTypes.map((fieldType) => ({
      ...fieldType,
      uniqueKey: fieldType.type // Use type as unique key for built-in fields
    })) as ExtendedFieldType[],
    ...customFieldTypes.map((customField: CustomFieldType) => ({
      type: 'custom' as const,
      label: customField.name,
      description: customField.description,
      category: customField.category,
      keywords: [customField.name.toLowerCase(), customField.description.toLowerCase()],
      customId: customField.id,
      uniqueKey: `custom-${customField.id}` // Unique key for custom fields
    }))
  ];

  const filteredFieldTypes = allFieldTypes.filter(fieldType => {
    const matchesSearch = searchQuery === '' || 
      fieldType.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fieldType.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fieldType.keywords.some((keyword: string) => keyword.includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || fieldType.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedFieldTypes = filteredFieldTypes.reduce((acc, fieldType) => {
    if (!acc[fieldType.category]) {
      acc[fieldType.category] = [];
    }
    acc[fieldType.category].push(fieldType);
    return acc;
  }, {} as Record<string, ExtendedFieldType[]>);

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Form Elements</h2>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShowOnboarding}
                    className="p-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick start guide</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search form elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="mt-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(fieldCategories).map(([key, category]) => {
                const IconComponent = categoryIconMap[key as keyof typeof categoryIconMap];
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      {IconComponent ? <IconComponent className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      {category.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedCategory === 'all' ? (
          // Show grouped categories
          Object.entries(groupedFieldTypes).map(([categoryKey, categoryFields]) => {
            const category = fieldCategories[categoryKey as keyof typeof fieldCategories];
            if (!category) return null;

            const IconComponent = categoryIconMap[categoryKey as keyof typeof categoryIconMap];

            return (
              <Collapsible
                key={categoryKey}
                open={!collapsedCategories[categoryKey]}
                onOpenChange={() => toggleCategory(categoryKey)}
              >
                <CollapsibleTrigger className="w-full justify-between p-3 h-auto hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 rounded-lg transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded ${category.color} flex items-center justify-center text-white`}>
                      {IconComponent ? <IconComponent className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{category.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{categoryFields.length} elements</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${collapsedCategories[categoryKey] ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-2">
                  {categoryFields.map((fieldType) => {
                    const isCustomField = fieldType.type === 'custom' && fieldType.customId;
                    
                    return (
                      <div key={fieldType.uniqueKey} className="group relative">
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-3 h-auto hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-slate-700/50 dark:hover:border-slate-600 border border-transparent rounded-lg transition-all duration-200 text-foreground hover:text-foreground"
                          onClick={() => {
                            if (isCustomField && fieldType.customId) {
                              onAddField(fieldType.type, undefined, fieldType.customId);
                            } else {
                              onAddField(fieldType.type);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-6 h-6 rounded ${category.color} flex items-center justify-center text-white flex-shrink-0`}>
                              {isCustomField ? <Package className="w-4 h-4" /> : getFieldIcon(fieldType.type)}
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium text-sm flex items-center gap-2 text-foreground">
                                {fieldType.label}
                                {isCustomField && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    Custom
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{fieldType.description}</div>
                            </div>
                          </div>
                        </Button>
                        
                        {/* Edit and Delete buttons for custom components */}
                        {isCustomField && fieldType.customId && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-6 w-6 hover:bg-blue-100 hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditCustomFieldType(fieldType.customId!);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-6 w-6 hover:bg-red-100 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCustomFieldType(fieldType.customId!);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })
        ) : (
          // Show flat list when specific category is selected
          <div className="space-y-1">
            {filteredFieldTypes.map((fieldType) => {
              const isCustomField = fieldType.type === 'custom' && fieldType.customId;
              const category = fieldCategories[fieldType.category as keyof typeof fieldCategories];
              
              return (
                <div key={fieldType.uniqueKey} className="group relative">
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-slate-700/50 dark:hover:border-slate-600 border border-transparent rounded-lg transition-all duration-200 text-foreground hover:text-foreground"
                    onClick={() => {
                      if (isCustomField && fieldType.customId) {
                        onAddField(fieldType.type, undefined, fieldType.customId);
                      } else {
                        onAddField(fieldType.type);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-6 h-6 rounded ${category?.color || 'bg-gray-500'} flex items-center justify-center text-white flex-shrink-0`}>
                        {isCustomField ? <Package className="w-4 h-4" /> : getFieldIcon(fieldType.type)}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm flex items-center gap-2 text-foreground">
                          {fieldType.label}
                          {isCustomField && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Custom
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{fieldType.description}</div>
                      </div>
                    </div>
                  </Button>
                  
                  {/* Edit and Delete buttons for custom components */}
                  {isCustomField && fieldType.customId && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6 hover:bg-blue-100 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCustomFieldType(fieldType.customId!);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6 hover:bg-red-100 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCustomFieldType(fieldType.customId!);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 