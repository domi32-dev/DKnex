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
  GitBranch 
} from 'lucide-react';
import { FormField } from '../types';
import { FieldRenderer } from './field-renderer';
import { groupFieldsIntoRows, getFieldWidthClass } from '../utils';

interface FormCanvasProps {
  fields: FormField[];
  selectedField: FormField | null;
  currentTheme: string;
  isInlineEditing: string | null;
  onDragEnd: (result: DropResult) => void;
  onSelectField: (field: FormField) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
  onDuplicateField: (field: FormField) => void;
  onStartInlineEdit: (fieldId: string) => void;
  onFinishInlineEdit: (fieldId: string, newLabel: string) => void;
  onAddField: (type: FormField['type']) => void;
  onShowOnboarding: () => void;
}

export function FormCanvas({
  fields,
  selectedField,
  currentTheme,
  isInlineEditing,
  onDragEnd,
  onSelectField,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  onStartInlineEdit,
  onFinishInlineEdit,
  onAddField,
  onShowOnboarding
}: FormCanvasProps) {
  const inlineEditRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="h-full">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
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
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    }`}
                  >
                    {fields.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Wand2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Start building your form</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                          Add form elements from the sidebar to get started. You can drag and drop to reorder them.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddField('text')}
                            className="flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Text Field
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={onShowOnboarding}
                            className="flex items-center gap-1"
                          >
                            <Play className="w-4 h-4" />
                            Quick Tour
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {groupFieldsIntoRows(fields).map((row, rowIndex) => (
                          <div key={`row-${rowIndex}`} className="flex flex-wrap -mr-2">
                            {row.map((field, fieldIndex) => {
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
                                            {!['heading', 'paragraph', 'divider'].includes(field.type) && (
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
                                            <FieldRenderer field={field} isPreview={false} />
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
                                                  <Copy className="w-3 h-3" />
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
                                                  <Trash2 className="w-3 h-3" />
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