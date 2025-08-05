'use client';

import { useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Wand2, 
  Lightbulb, 
  Plus, 
  Play, 
  GripVertical, 
  Copy, 
  Trash2, 
  GitBranch,
  X
} from 'lucide-react';
import { FormField, FormPage, CustomFieldType } from '../types';
import { FieldRenderer } from './field-renderer';
import { groupFieldsIntoRows, getFieldWidthClass } from '../utils';

interface FormCanvasProps {
  fields: FormField[];
  selectedField: FormField | null;
  currentTheme: string;
  isInlineEditing: string | null;
  isMultiStep: boolean;
  pages: FormPage[];
  currentPage: string;
  formValues?: Record<string, string | number | boolean | string[]>;
  onDragEnd: (result: DropResult) => void;
  onSelectField: (field: FormField) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
  onDuplicateField: (field: FormField) => void;
  onStartInlineEdit: (fieldId: string) => void;
  onFinishInlineEdit: (fieldId: string, newLabel: string) => void;
  onFormValueChange?: (fieldId: string, value: string | number | boolean | string[]) => void;
  onAddField: (type: FormField['type']) => void;
  onShowOnboarding: () => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
  onUpdatePageTitle: (pageId: string, title: string) => void;
  onSwitchToPage: (pageId: string) => void;
  customFieldTypes?: CustomFieldType[];
}

export function FormCanvas({
  fields,
  selectedField,
  currentTheme,
  isInlineEditing,
  isMultiStep,
  pages,
  currentPage,
  formValues = {},
  onDragEnd,
  onSelectField,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  onStartInlineEdit,
  onFinishInlineEdit,
  onFormValueChange,
  onAddField,
  onShowOnboarding,
  onAddPage,
  onDeletePage,
  onSwitchToPage,
  customFieldTypes = []
}: FormCanvasProps) {
  const inlineEditRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="h-full">
        <Card className="h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  Form Builder Canvas
                </CardTitle>
                <p className="text-sm text-muted-foreground">Design your form by adding and arranging elements</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentTheme} theme
                </Badge>
                <Button variant="ghost" size="sm">
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Multi-step Navigation */}
          {isMultiStep && (
            <div className="border-t border-b bg-gradient-to-r from-blue-500/5 to-purple-500/5 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-muted-foreground">Pages:</span>
                  <div className="flex items-center space-x-2">
                    {pages.map((page) => (
                      <div key={page.id} className="flex items-center space-x-1">
                        <Button
                          variant={currentPage === page.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => onSwitchToPage(page.id)}
                          className={`flex items-center gap-2 ${
                            currentPage === page.id 
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                              : "hover:bg-muted"
                          }`}
                        >
                          <span>{page.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {fields.filter(f => f.pageId === page.id).length}
                          </Badge>
                        </Button>
                        {pages.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeletePage(page.id)}
                            className="p-1 h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddPage}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Page
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <CardContent className="p-4 h-[calc(100%-80px)]">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[200px] p-4 border-2 border-dashed rounded-lg transition-all duration-200 ${
                      snapshot.isDraggingOver
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-muted/20'
                    }`}
                  >
                    {fields.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Wand2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Start Building Your Form</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Add form fields from the sidebar to begin creating your form. You can drag and drop to arrange them.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <Button onClick={() => onAddField('text')} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Text Field
                          </Button>
                          <Button variant="outline" onClick={onShowOnboarding}>
                            <Play className="w-4 h-4 mr-2" />
                            Quick Start Guide
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {groupFieldsIntoRows(fields).map((row, rowIndex) => (
                          <div key={`row-${rowIndex}`} className="flex flex-wrap -mr-2">
                            {row.map((field) => {
                              const globalIndex = fields.indexOf(field);
                              return (
                                <Draggable key={field.id} draggableId={field.id} index={globalIndex}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`${getFieldWidthClass(field.width)} mb-4`}
                                      style={provided.draggableProps.style}
                                    >
                                      <div
                                        className={`group relative p-4 border-2 rounded-lg bg-card transition-all duration-200 h-full ${
                                          selectedField?.id === field.id
                                            ? 'border-primary ring-2 ring-primary/20 shadow-md'
                                            : 'border-border hover:border-primary/50 hover:shadow-sm'
                                        } ${
                                          snapshot.isDragging 
                                            ? 'shadow-xl scale-105 z-[9999] opacity-90' 
                                            : ''
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onSelectField(field);
                                        }}
                                      >
                                        <div className="flex items-start justify-between h-full">
                                          <div className="flex-1 space-y-2">
                                            {!['heading', 'paragraph', 'divider', 'custom'].includes(field.type) && (
                                              <div className="flex items-center gap-2">
                                                {isInlineEditing === field.id ? (
                                                  <Input
                                                    ref={inlineEditRef}
                                                    value={field.label}
                                                    onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
                                                    onBlur={() => onFinishInlineEdit(field.id, field.label)}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        onFinishInlineEdit(field.id, field.label);
                                                      } else if (e.key === 'Escape') {
                                                        onFinishInlineEdit(field.id, field.label);
                                                      }
                                                    }}
                                                    className="text-base font-semibold"
                                                  />
                                                ) : (
                                                  <Label 
                                                    className="text-base font-semibold text-foreground block cursor-pointer hover:text-primary"
                                                    onDoubleClick={() => onStartInlineEdit(field.id)}
                                                  >
                                                    {field.label}
                                                    {field.required && <span className="text-red-500 ml-2">*</span>}
                                                  </Label>
                                                )}
                                                {field.conditionalLogic?.enabled && (
                                                  <Tooltip>
                                                    <TooltipTrigger>
                                                      <GitBranch className="w-3 h-3 text-purple-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>Has conditional logic</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                )}
                                              </div>
                                            )}
                                            <FieldRenderer 
                                              field={field} 
                                              isPreview={false} 
                                              formValues={formValues}
                                              onValueChange={onFormValueChange}
                                              customFieldTypes={customFieldTypes} 
                                            />
                                          </div>
                                          
                                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                            <div 
                                              {...provided.dragHandleProps}
                                              className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing touch-none"
                                              onMouseDown={(e) => e.stopPropagation()}
                                            >
                                              <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                            </div>
                                            
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="p-1 h-6 w-6 hover:bg-muted"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDuplicateField(field);
                                                  }}
                                                >
                                                  <Copy className="w-4 h-4" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Duplicate field</p>
                                              </TooltipContent>
                                            </Tooltip>
                                            
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="p-1 h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteField(field.id);
                                                  }}
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Delete field</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 