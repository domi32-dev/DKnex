/** @jsxImportSource react */
'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, GripVertical, Eye, EyeOff, Grid, LayoutGrid, ZoomIn, ZoomOut, Settings, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    fontSize?: number;
    fontFamily?: string;
    padding?: number;
    margin?: number;
  };
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    customValidation?: string;
  };
  conditionalLogic?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number;
    action: 'show' | 'hide' | 'enable' | 'disable';
  }[];
  fieldType?: {
    type: 'text' | 'number' | 'email' | 'tel' | 'url' | 'password' | 'date' | 'time' | 'datetime-local' | 'color' | 'file' | 'image' | 'signature' | 'barcode' | 'qr' | 'location' | 'rating' | 'slider' | 'toggle' | 'repeater' | 'table' | 'grid' | 'section' | 'divider' | 'spacer' | 'html' | 'calculation';
    subtype?: string;
    format?: string;
    placeholder?: string;
    helpText?: string;
    defaultValue?: any;
  };
  fieldOptions?: {
    multiple?: boolean;
    searchable?: boolean;
    clearable?: boolean;
    creatable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    groupable?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    rotatable?: boolean;
    snapToGrid?: boolean;
    gridSize?: number;
  };
  relationships?: {
    parent?: string;
    children?: string[];
    dependsOn?: string[];
    affects?: string[];
  };
  metadata?: {
    description?: string;
    tags?: string[];
    category?: string;
    version?: string;
    lastModified?: string;
    createdBy?: string;
    permissions?: string[];
  };
}

interface FormBuilderProps {
  onFormChange: (fields: FormField[]) => void;
}

interface FormSettings {
  isResponsive: boolean;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gridSize: number;
  snapToGrid: boolean;
  showGrid: boolean;
  zoom: number;
  maskSize: {
    width: number;
    height: number;
  };
  maskBorderRadius: number;
  maskPadding: number;
}

const defaultFormSettings: FormSettings = {
  isResponsive: true,
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
  },
  gridSize: 10,
  snapToGrid: true,
  showGrid: true,
  zoom: 1,
  maskSize: {
    width: 800,
    height: 600,
  },
  maskBorderRadius: 8,
  maskPadding: 20,
};

const availableFields = [
  { type: 'text', label: 'Text Input', category: 'Basic' },
  { type: 'textarea', label: 'Text Area', category: 'Basic' },
  { type: 'number', label: 'Number Input', category: 'Basic' },
  { type: 'select', label: 'Dropdown', category: 'Basic' },
  { type: 'checkbox', label: 'Checkbox', category: 'Basic' },
  { type: 'radio', label: 'Radio Buttons', category: 'Basic' },
  { type: 'date', label: 'Date Picker', category: 'Basic' },
  { type: 'email', label: 'Email Input', category: 'Advanced' },
  { type: 'tel', label: 'Phone Input', category: 'Advanced' },
  { type: 'url', label: 'URL Input', category: 'Advanced' },
  { type: 'password', label: 'Password Input', category: 'Advanced' },
  { type: 'color', label: 'Color Picker', category: 'Advanced' },
  { type: 'file', label: 'File Upload', category: 'Advanced' },
  { type: 'image', label: 'Image Upload', category: 'Advanced' },
  { type: 'signature', label: 'Signature Pad', category: 'Advanced' },
  { type: 'barcode', label: 'Barcode Scanner', category: 'Advanced' },
  { type: 'qr', label: 'QR Code Scanner', category: 'Advanced' },
  { type: 'location', label: 'Location Picker', category: 'Advanced' },
  { type: 'rating', label: 'Rating', category: 'Advanced' },
  { type: 'slider', label: 'Slider', category: 'Advanced' },
  { type: 'toggle', label: 'Toggle Switch', category: 'Advanced' },
  { type: 'repeater', label: 'Repeater Field', category: 'Advanced' },
  { type: 'table', label: 'Table', category: 'Advanced' },
  { type: 'grid', label: 'Grid Layout', category: 'Advanced' },
  { type: 'section', label: 'Section', category: 'Layout' },
  { type: 'divider', label: 'Divider', category: 'Layout' },
  { type: 'spacer', label: 'Spacer', category: 'Layout' },
  { type: 'html', label: 'HTML Block', category: 'Layout' },
  { type: 'calculation', label: 'Calculation Field', category: 'Advanced' },
];

const FormBuilder: React.FC<FormBuilderProps> = ({ onFormChange }) => {
  const { theme, setTheme } = useTheme();
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [settings, setSettings] = useState<FormSettings>(defaultFormSettings);
  const [viewMode, setViewMode] = useState<'design' | 'preview'>('design');
  const [showSettings, setShowSettings] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Memoize filtered fields for better performance
  const filteredFields = useMemo(() => {
    return availableFields.filter(field => field.category === 'Basic');
  }, []);

  // Add delete field handler
  const handleDeleteField = useCallback((fieldId: string) => {
    setFields(prevFields => {
      const newFields = prevFields.filter(field => field.id !== fieldId);
      onFormChange(newFields);
      return newFields;
    });
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [onFormChange]);

  // Update handleDragEnd to allow free positioning
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'palette' && destination.droppableId === 'form') {
      const fieldType = availableFields.find(f => f.type === result.draggableId);
      if (!fieldType) return;

      const newField: FormField = {
        id: `field-${Date.now()}`,
        type: result.draggableId,
        label: `New ${fieldType.label}`,
        required: false,
        position: {
          x: 0,
          y: 0,
          width: 200,
          height: 40,
          zIndex: fields.length + 1,
        },
        fieldType: {
          type: fieldType.type as any,
          placeholder: `Enter ${fieldType.label.toLowerCase()}`,
        },
        fieldOptions: {
          draggable: true,
          resizable: true,
          rotatable: false,
          snapToGrid: settings.snapToGrid,
          gridSize: settings.gridSize,
        },
      };
      
      const newFields = [...fields];
      newFields.splice(destination.index, 0, newField);
      setFields(newFields);
      onFormChange(newFields);
    }
  }, [fields, settings.snapToGrid, settings.gridSize, onFormChange]);

  // Optimized field update handler
  const handleFieldUpdate = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFields(prevFields => {
      const newFields = prevFields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      );
      onFormChange(newFields);
      return newFields;
    });
  }, [onFormChange]);

  // Optimized field move handler
  const handleFieldMove = useCallback((fieldId: string, x: number, y: number) => {
    if (settings.snapToGrid) {
      x = Math.round(x / settings.gridSize) * settings.gridSize;
      y = Math.round(y / settings.gridSize) * settings.gridSize;
    }
    handleFieldUpdate(fieldId, {
      position: {
        ...fields.find(f => f.id === fieldId)!.position,
        x,
        y,
      },
    });
  }, [fields, settings.snapToGrid, settings.gridSize, handleFieldUpdate]);

  // Optimized field resize handler
  const handleFieldResize: RndResizeCallback = useCallback((e, direction, ref, delta, position) => {
    const fieldId = ref.getAttribute('data-field-id');
    if (!fieldId) return;

    let newWidth = parseInt(ref.style.width);
    let newHeight = parseInt(ref.style.height);
    
    if (settings.snapToGrid) {
      newWidth = Math.round(newWidth / settings.gridSize) * settings.gridSize;
      newHeight = Math.round(newHeight / settings.gridSize) * settings.gridSize;
    }
    
    handleFieldUpdate(fieldId, {
      position: {
        ...fields.find(f => f.id === fieldId)!.position,
        width: newWidth,
        height: newHeight,
      },
    });
  }, [fields, settings.snapToGrid, settings.gridSize, handleFieldUpdate]);

  // Update renderField to remove delete button
  const renderField = useCallback((field: FormField) => {
    const fieldStyle = {
      position: 'absolute' as const,
      left: field.position.x,
      top: field.position.y,
      width: field.position.width,
      height: field.position.height,
      zIndex: field.position.zIndex,
      ...field.style,
    };

    const commonProps = {
      className: `w-full h-full ${viewMode === 'preview' ? 'pointer-events-none' : ''}`,
      style: fieldStyle,
    };

    switch (field.type) {
      case 'text':
        return (
          <div {...commonProps}>
            <Label>{field.label}</Label>
            <Input
              type="text"
              placeholder={field.fieldType?.placeholder}
              disabled={viewMode === 'preview'}
            />
          </div>
        );
      case 'textarea':
        return (
          <div {...commonProps}>
            <Label>{field.label}</Label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder={field.fieldType?.placeholder}
              disabled={viewMode === 'preview'}
            />
          </div>
        );
      case 'select':
        return (
          <div {...commonProps}>
            <Label>{field.label}</Label>
            <Select disabled={viewMode === 'preview'}>
              <SelectTrigger>
                <SelectValue placeholder={field.fieldType?.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return (
          <div {...commonProps}>
            <Label>{field.label}</Label>
            <Input
              type="text"
              placeholder={field.fieldType?.placeholder}
              disabled={viewMode === 'preview'}
            />
          </div>
        );
    }
  }, [viewMode]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-card/50 backdrop-blur-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={viewMode === 'design' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('design')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Design
            </Button>
            <Button
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('preview')}
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Field Palette */}
          {viewMode === 'design' && (
            <div className={`relative transition-all duration-200 ${leftPanelCollapsed ? 'w-12' : 'w-64'}`}>
              <div className="absolute right-0 top-4 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                >
                  {leftPanelCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="h-full border-r bg-card/50 backdrop-blur-sm overflow-y-auto">
                {!leftPanelCollapsed && (
                  <div className="p-4">
                    <Tabs defaultValue="basic">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic">
                        <Droppable droppableId="palette">
                          {(provided: DroppableProvided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2 mt-4"
                            >
                              {filteredFields.map((field, index) => (
                                <Draggable
                                  key={field.type}
                                  draggableId={field.type}
                                  index={index}
                                >
                                  {(provided: DraggableProvided) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="p-3 cursor-move hover:bg-accent/50 transition-colors"
                                    >
                                      {field.label}
                                    </Card>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Canvas */}
          <div className="flex-1 relative overflow-auto">
            <div className="absolute top-4 right-4 space-x-2 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, showGrid: !prev.showGrid }))}
              >
                {settings.showGrid ? <Grid className="w-4 h-4" /> : <Grid className="w-4 h-4 opacity-50" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }))}
              >
                {settings.snapToGrid ? <LayoutGrid className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4 opacity-50" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, zoom: prev.zoom + 0.1 }))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom - 0.1) }))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>

            <Droppable droppableId="form">
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[600px] p-4 relative"
                  style={{
                    backgroundImage: settings.showGrid && viewMode === 'design'
                      ? 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)'
                      : 'none',
                    backgroundSize: `${settings.gridSize}px ${settings.gridSize}px`,
                  }}
                >
                  <div
                    className="relative mx-auto"
                    style={{
                      width: settings.maskSize.width,
                      height: settings.maskSize.height,
                      borderRadius: settings.maskBorderRadius,
                      padding: settings.maskPadding,
                      transform: `scale(${settings.zoom})`,
                      transformOrigin: 'top center',
                    }}
                  >
                    <AnimatePresence>
                      {fields.map((field) => (
                        viewMode === 'design' ? (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Rnd
                              default={{
                                x: field.position.x,
                                y: field.position.y,
                                width: field.position.width,
                                height: field.position.height,
                              }}
                              onDragStop={(e, d) => handleFieldMove(field.id, d.x, d.y)}
                              onResizeStop={handleFieldResize}
                              bounds="parent"
                              grid={settings.snapToGrid ? [settings.gridSize, settings.gridSize] : undefined}
                              style={{
                                zIndex: field.position.zIndex,
                              }}
                              onClick={() => setSelectedField(field)}
                              data-field-id={field.id}
                              resizeHandleStyles={{
                                bottomRight: { cursor: 'nwse-resize' },
                                bottomLeft: { cursor: 'nesw-resize' },
                                topRight: { cursor: 'nesw-resize' },
                                topLeft: { cursor: 'nwse-resize' },
                              }}
                              resizeHandleClasses={{
                                bottomRight: 'w-3 h-3 bg-primary/20 rounded-full hover:bg-primary/40 transition-colors',
                                bottomLeft: 'w-3 h-3 bg-primary/20 rounded-full hover:bg-primary/40 transition-colors',
                                topRight: 'w-3 h-3 bg-primary/20 rounded-full hover:bg-primary/40 transition-colors',
                                topLeft: 'w-3 h-3 bg-primary/20 rounded-full hover:bg-primary/40 transition-colors',
                              }}
                            >
                              {renderField(field)}
                            </Rnd>
                          </motion.div>
                        ) : (
                          <div key={field.id}>
                            {renderField(field)}
                          </div>
                        )
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>

          {/* Right Sidebar - Field Properties (only when a field is selected) */}
          {viewMode === 'design' && selectedField && (
            <div className="w-80 border-l bg-card/50 backdrop-blur-sm overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Field Properties</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteField(selectedField.id)}
                    >
                      Delete Field
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedField(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Label</Label>
                  <Input
                    value={selectedField.label}
                    onChange={(e) =>
                      handleFieldUpdate(selectedField.id, { label: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Required</Label>
                  <Switch
                    checked={selectedField.required}
                    onCheckedChange={(checked) =>
                      handleFieldUpdate(selectedField.id, { required: checked })
                    }
                  />
                </div>
                {selectedField.fieldType && (
                  <div>
                    <Label>Field Type</Label>
                    <Select
                      value={selectedField.fieldType.type}
                      onValueChange={(value) =>
                        handleFieldUpdate(selectedField.id, {
                          fieldType: {
                            ...selectedField.fieldType,
                            type: value as any,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields.map((field) => (
                          <SelectItem key={field.type} value={field.type}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Modal */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Mask Settings</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="absolute right-2 top-2">
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Width (px)</Label>
                  <Input
                    type="number"
                    value={settings.maskSize.width}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maskSize: { ...prev.maskSize, width: Number(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    value={settings.maskSize.height}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maskSize: { ...prev.maskSize, height: Number(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Border Radius (px)</Label>
                  <Input
                    type="number"
                    value={settings.maskBorderRadius}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maskBorderRadius: Number(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <Label>Padding (px)</Label>
                  <Input
                    type="number"
                    value={settings.maskPadding}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maskPadding: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DragDropContext>
  );
};

export default FormBuilder; 
