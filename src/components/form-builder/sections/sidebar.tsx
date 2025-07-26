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
  Crown,
  Trash2,
  Package,
  Edit
} from 'lucide-react';
import { FormField, FieldTemplate, CustomFieldType } from '../types';
import { fieldCategories, fieldTypes, defaultTemplates, categoryIconMap } from '../constants';
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
  const allFieldTypes = [
    ...fieldTypes.map(fieldType => ({
      ...fieldType,
      uniqueKey: fieldType.type // Use type as unique key for built-in fields
    })),
    ...customFieldTypes.map(customField => ({
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
  }, {} as Record<string, typeof allFieldTypes>);

  return (
    <div className="w-80 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Form Elements</h3>
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
            className="pl-10 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-1 h-7 text-xs ${selectedCategory === 'all' 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
              : "bg-white/70 dark:bg-slate-700/70 border border-slate-300 dark:border-slate-600 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-700/90"
            }`}
          >
            All
          </Button>
          {Object.entries(fieldCategories).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-1 px-2 py-1 h-7 text-xs ${
                selectedCategory === key 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white/70 dark:bg-slate-700/70 border border-slate-300 dark:border-slate-600 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-700/90"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${category.color}`} />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Templates Section */}
        <Collapsible
          open={showTemplates}
          onOpenChange={setShowTemplates}
        >
          <CollapsibleTrigger className="w-full justify-between p-2 bg-white/70 dark:bg-slate-700/70 border border-slate-300 dark:border-slate-600 hover:bg-white/90 dark:hover:bg-slate-700/90 rounded-lg flex items-center backdrop-blur-sm transition-colors">
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
                onClick={() => onAddField(template.field.type as FormField['type'], template, undefined)}
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
          {selectedCategory === 'all' ? (
            // Show grouped/collapsible view when "All" is selected
            Object.entries(groupedFieldTypes).map(([categoryKey, categoryFields]) => {
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
                        {(() => {
                          const IconComponent = categoryIconMap[category.icon as keyof typeof categoryIconMap];
                          return IconComponent ? <IconComponent className="w-4 h-4" /> : category.icon;
                        })()}
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
                    {categoryFields.map((fieldType) => {
                      const isCustomField = fieldType.type === 'custom' && 'customId' in fieldType;
                      
                      return (
                        <div key={(fieldType as any).uniqueKey} className="group relative">
                          <Button
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto hover:bg-muted/50 transition-colors"
                            onClick={() => {
                              if (isCustomField && 'customId' in fieldType) {
                                onAddField(fieldType.type as FormField['type'], undefined, (fieldType as any).customId);
                              } else {
                                onAddField(fieldType.type as FormField['type']);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-6 h-6 rounded ${category.color} flex items-center justify-center text-white flex-shrink-0`}>
                                {isCustomField ? <Package className="w-4 h-4" /> : getFieldIcon(fieldType.type)}
                              </div>
                              <div className="text-left flex-1">
                                <div className="font-medium text-sm flex items-center gap-2">
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
                          {isCustomField && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-6 w-6 hover:bg-blue-100 hover:text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditCustomFieldType((fieldType as any).customId);
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
                                  onDeleteCustomFieldType((fieldType as any).customId);
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
                const isCustomField = fieldType.type === 'custom' && 'customId' in fieldType;
                const category = fieldCategories[fieldType.category as keyof typeof fieldCategories];
                
                return (
                  <div key={(fieldType as any).uniqueKey} className="group relative">
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        if (isCustomField && 'customId' in fieldType) {
                          onAddField(fieldType.type as FormField['type'], undefined, (fieldType as any).customId);
                        } else {
                          onAddField(fieldType.type as FormField['type']);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-6 h-6 rounded ${category?.color || 'bg-gray-500'} flex items-center justify-center text-white flex-shrink-0`}>
                          {isCustomField ? <Package className="w-4 h-4" /> : getFieldIcon(fieldType.type)}
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm flex items-center gap-2">
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
                    {isCustomField && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 hover:bg-blue-100 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCustomFieldType((fieldType as any).customId);
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
                            onDeleteCustomFieldType((fieldType as any).customId);
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
    </div>
  );
} 