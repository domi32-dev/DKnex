'use client';

import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/i18n/translations';
// Removed framer-motion to avoid conflicts with drag and drop
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Save, 
  Settings, 
  GripVertical, 
  Type, 
  Hash, 
  Mail, 
  Calendar, 
  CheckSquare, 
  Circle, 
  ChevronDown,
  FileText,
  Phone,
  Link,
  Image,
  Star,
  ToggleLeft,
  Layout,
  Minus,
  Copy,
  Palette,
  Smartphone,
  Monitor,
  Tablet,
  BarChart,
  GitBranch,
  Upload,
  Download
} from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'phone' | 'url' | 'file' | 'rating' | 'toggle' | 'divider' | 'heading' | 'paragraph' | 'signature' | 'richtext' | 'matrix' | 'calculation' | 'section';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    customMessage?: string;
    customRule?: string;
  };
  style?: {
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    customCSS?: string;
  };
  width?: 'full' | 'half' | 'third' | 'quarter';
  conditionalLogic?: {
    enabled: boolean;
    conditions: {
      fieldId: string;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
      value: string;
    }[];
    action: 'show' | 'hide' | 'require' | 'disable';
  };
  calculations?: {
    enabled: boolean;
    formula: string;
    dependsOn: string[];
  };
  fileSettings?: {
    maxSize: number; // in MB
    allowedTypes: string[];
    maxFiles: number;
    showPreview: boolean;
  };
  matrixSettings?: {
    rows: string[];
    columns: string[];
    inputType: 'radio' | 'checkbox' | 'text';
  };
  sectionSettings?: {
    collapsible: boolean;
    defaultCollapsed: boolean;
    description?: string;
  };
  step?: number; // For multi-step forms
  analytics?: {
    completionRate?: number;
    averageTime?: number;
    dropoffRate?: number;
  };
}

interface FormBuilderProps {
  formId?: string;
  initialFields?: FormField[];
  onSave?: (fields: FormField[], formName: string) => void;
}

const fieldTypes = [
  // Basic Input Fields
  { type: 'text', label: 'Text Input', icon: <Type className="w-5 h-5" />, category: 'Input', description: 'Single line text' },
  { type: 'email', label: 'Email', icon: <Mail className="w-5 h-5" />, category: 'Input', description: 'Email address' },
  { type: 'number', label: 'Number', icon: <Hash className="w-5 h-5" />, category: 'Input', description: 'Numeric input' },
  { type: 'phone', label: 'Phone', icon: <Phone className="w-5 h-5" />, category: 'Input', description: 'Phone number' },
  { type: 'url', label: 'URL', icon: <Link className="w-5 h-5" />, category: 'Input', description: 'Website URL' },
  { type: 'textarea', label: 'Textarea', icon: <FileText className="w-5 h-5" />, category: 'Input', description: 'Multi-line text' },
  { type: 'date', label: 'Date', icon: <Calendar className="w-5 h-5" />, category: 'Input', description: 'Date picker' },
  { type: 'file', label: 'File Upload', icon: <Image className="w-5 h-5" />, category: 'Input', description: 'File attachment' },
  
  // Choice Fields
  { type: 'select', label: 'Dropdown', icon: <ChevronDown className="w-5 h-5" />, category: 'Choice', description: 'Select from options' },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="w-5 h-5" />, category: 'Choice', description: 'Multiple selections' },
  { type: 'radio', label: 'Radio', icon: <Circle className="w-5 h-5" />, category: 'Choice', description: 'Single selection' },
  { type: 'rating', label: 'Rating', icon: <Star className="w-5 h-5" />, category: 'Choice', description: 'Star rating' },
  { type: 'toggle', label: 'Toggle', icon: <ToggleLeft className="w-5 h-5" />, category: 'Choice', description: 'On/Off switch' },
  
  // Advanced Fields
  { type: 'signature', label: 'Signature', icon: <Edit className="w-5 h-5" />, category: 'Advanced', description: 'Digital signature pad' },
  { type: 'richtext', label: 'Rich Text', icon: <Type className="w-5 h-5" />, category: 'Advanced', description: 'WYSIWYG editor' },
  { type: 'matrix', label: 'Matrix/Grid', icon: <Layout className="w-5 h-5" />, category: 'Advanced', description: 'Grid of inputs' },
  { type: 'calculation', label: 'Calculation', icon: <Hash className="w-5 h-5" />, category: 'Advanced', description: 'Auto-calculated field' },
  
  // Layout Fields
  { type: 'section', label: 'Section', icon: <Layout className="w-5 h-5" />, category: 'Layout', description: 'Collapsible section' },
  { type: 'heading', label: 'Heading', icon: <Type className="w-5 h-5" />, category: 'Layout', description: 'Section title' },
  { type: 'paragraph', label: 'Paragraph', icon: <FileText className="w-5 h-5" />, category: 'Layout', description: 'Text content' },
  { type: 'divider', label: 'Divider', icon: <Minus className="w-5 h-5" />, category: 'Layout', description: 'Section separator' },
];

export function ModernFormBuilder({ formId, initialFields = [], onSave }: FormBuilderProps) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [formName, setFormName] = useState(t('formBuilder.untitledForm' as any) || 'Untitled Form');
  const [previewMode, setPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isMultiStep, setIsMultiStep] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showLogicRules, setShowLogicRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper function to get translated field type label
  const getFieldTypeLabel = (type: string) => {
    return t(`formBuilder.fieldTypes.${type}` as any) || type;
  };

  // Helper function to get translated field type description
  const getFieldTypeDescription = (type: string) => {
    return t(`formBuilder.fieldDescriptions.${type}` as any) || `${type} field`;
  };

  const addField = useCallback((type: FormField['type']) => {
    const baseField: FormField = {
      id: generateId(),
      type,
      label: getFieldTypeLabel(type),
      required: false,
      width: 'full',
    };

    // Add type-specific defaults
    switch (type) {
      case 'select':
      case 'radio':
      case 'checkbox':
        baseField.options = ['Option 1', 'Option 2', 'Option 3'];
        break;
      
      case 'heading':
        baseField.style = { fontSize: '2xl', fontWeight: 'bold' };
        break;
      
      case 'paragraph':
        baseField.style = { fontSize: 'base', fontWeight: 'normal' };
        break;
      
      case 'file':
        baseField.fileSettings = {
          maxSize: 10, // 10MB
          allowedTypes: ['image/*', 'application/pdf', '.doc,.docx'],
          maxFiles: 1,
          showPreview: true
        };
        break;
      
      case 'matrix':
        baseField.matrixSettings = {
          rows: ['Row 1', 'Row 2', 'Row 3'],
          columns: ['Column 1', 'Column 2', 'Column 3'],
          inputType: 'radio'
        };
        break;
      
      case 'section':
        baseField.sectionSettings = {
          collapsible: true,
          defaultCollapsed: false,
          description: 'Section description'
        };
        break;
      
      case 'calculation':
        baseField.calculations = {
          enabled: true,
          formula: '',
          dependsOn: []
        };
        break;
      
      case 'signature':
        baseField.label = 'Digital Signature';
        break;
      
      case 'richtext':
        baseField.label = 'Rich Text Content';
        baseField.placeholder = 'Enter rich text content...';
        break;
    }
    
    setFields(prev => [...prev, baseField]);
    setSelectedField(baseField);
  }, []);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    if (selectedField?.id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedField]);

  const deleteField = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [selectedField]);

  const duplicateField = useCallback((field: FormField) => {
    const newField = { ...field, id: generateId(), label: `${field.label} Copy` };
    setFields(prev => [...prev, newField]);
  }, []);

  const onDragStart = useCallback(() => {
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    // Re-enable text selection
    document.body.style.userSelect = '';
    
    const { destination, source } = result;
    
    if (!destination) return;
    if (source.droppableId !== 'form-fields' || destination.droppableId !== 'form-fields') return;
    if (source.index === destination.index) return;

    try {
      const newFields = [...fields];
      const [movedField] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, movedField);
      setFields(newFields);
    } catch (error) {
      console.error('Drag and drop error:', error);
    }
  }, [fields]);

      const handleSave = useCallback(() => {
      if (onSave) {
        onSave(fields, formName);
      }
      showNotification(t('formBuilder.saved' as any) || 'Form saved successfully!');
    }, [fields, formName, onSave, t]);

  // Function to group fields into rows based on their widths
  const groupFieldsIntoRows = useCallback((fields: FormField[]) => {
    const rows: FormField[][] = [];
    let currentRow: FormField[] = [];
    let currentRowWidth = 0;

    const getFieldWidth = (width?: string) => {
      switch (width) {
        case 'quarter': return 25;
        case 'third': return 33.33;
        case 'half': return 50;
        case 'full':
        default: return 100;
      }
    };

    fields.forEach(field => {
      const fieldWidth = getFieldWidth(field.width);
      
      // If adding this field would exceed 100% width, start a new row
      if (currentRowWidth + fieldWidth > 100 && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [field];
        currentRowWidth = fieldWidth;
      } else {
        currentRow.push(field);
        currentRowWidth += fieldWidth;
      }
    });

    // Add the last row if it has fields
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }, []);

  // Function to get CSS width class for field
  const getFieldWidthClass = useCallback((width?: string) => {
    switch (width) {
      case 'quarter': return 'w-1/4 pr-2';
      case 'third': return 'w-1/3 pr-2';
      case 'half': return 'w-1/2 pr-2';
      case 'full':
      default: return 'w-full';
    }
  }, []);

  const renderField = (field: FormField, isPreview = false) => {
    const baseInputClass = "w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200";
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
      case 'url':
        return (
          <Input
            type={field.type === 'phone' ? 'tel' : field.type}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            className={baseInputClass}
            disabled={!isPreview}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            className={`${baseInputClass} min-h-[120px] resize-vertical`}
            disabled={!isPreview}
          />
        );
      
      case 'select':
        return (
          <Select disabled={!isPreview}>
            <SelectTrigger className={`${baseInputClass} justify-between`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`${field.id}_${index}`}
                  className="w-4 h-4 rounded border-2 border-border focus:ring-primary/20 text-primary"
                  disabled={!isPreview}
                />
                <label htmlFor={`${field.id}_${index}`} className="text-sm font-medium leading-none">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`${field.id}_${index}`}
                  name={field.id}
                  className="w-4 h-4 border-2 border-border focus:ring-primary/20 text-primary"
                  disabled={!isPreview}
                />
                <label htmlFor={`${field.id}_${index}`} className="text-sm font-medium leading-none">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <Input
            type="date"
            required={field.required}
            className={baseInputClass}
            disabled={!isPreview}
          />
        );
      
      case 'file':
        return (
          <Input
            type="file"
            required={field.required}
            className={baseInputClass}
            disabled={!isPreview}
          />
        );
      
      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-8 h-8 text-yellow-400 cursor-pointer hover:fill-current transition-colors"
              />
            ))}
          </div>
        );
      
      case 'toggle':
        return (
          <Switch disabled={!isPreview} />
        );
      
      case 'heading':
        const headingSize = field.style?.fontSize === '2xl' ? 'text-3xl' : field.style?.fontSize === 'xl' ? 'text-2xl' : field.style?.fontSize === 'lg' ? 'text-xl' : 'text-lg';
        return (
          <div
            className={`${headingSize} font-${field.style?.fontWeight || 'bold'} text-${field.style?.textAlign || 'left'} text-foreground`}
            style={{ color: field.style?.color }}
          >
            {field.label}
          </div>
        );
      
      case 'paragraph':
        return (
          <div
            className={`text-${field.style?.fontSize || 'base'} font-${field.style?.fontWeight || 'normal'} text-${field.style?.textAlign || 'left'} text-muted-foreground leading-relaxed`}
            style={{ color: field.style?.color }}
          >
            {field.label}
          </div>
        );
      
      case 'divider':
        return <hr className="border-border my-8" />;
      
      case 'signature':
        return (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30">
            <Edit className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">Digital Signature Pad</p>
            <p className="text-xs text-muted-foreground">Click here to sign</p>
            <div className="mt-4 h-24 bg-background border rounded flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Signature area</span>
            </div>
          </div>
        );
      
      case 'richtext':
        return (
          <div className="border border-border rounded-lg">
            <div className="border-b border-border p-2 flex space-x-2 bg-muted/30 rounded-t-lg">
              <button className="p-1 hover:bg-muted rounded text-sm font-bold">B</button>
              <button className="p-1 hover:bg-muted rounded text-sm italic">I</button>
              <button className="p-1 hover:bg-muted rounded text-sm underline">U</button>
            </div>
            <div className="p-4 min-h-32 bg-background rounded-b-lg">
              <p className="text-muted-foreground text-sm">{field.placeholder || 'Enter rich text content...'}</p>
            </div>
          </div>
        );
      
      case 'matrix':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/30">
                  <th className="p-3 text-left border-b border-border"></th>
                  {field.matrixSettings?.columns?.map((col, index) => (
                    <th key={index} className="p-3 text-center border-b border-l border-border text-sm font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {field.matrixSettings?.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border">
                    <td className="p-3 font-medium text-sm border-r border-border">{row}</td>
                    {field.matrixSettings?.columns?.map((_, colIndex) => (
                      <td key={colIndex} className="p-3 text-center border-l border-border">
                        <input 
                          type={field.matrixSettings?.inputType || 'radio'} 
                          name={`${field.id}_${rowIndex}`}
                          className="w-4 h-4"
                          disabled={!isPreview}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'calculation':
        return (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Calculated Field</span>
            </div>
            <div className="bg-background border rounded p-3 text-foreground">
              <span className="text-sm">Result: </span>
              <span className="font-mono text-lg">0.00</span>
            </div>
            {field.calculations?.formula && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Formula: {field.calculations.formula}</p>
            )}
          </div>
        );
      
      case 'section':
        return (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-muted/50">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{field.label}</h3>
                {field.sectionSettings?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{field.sectionSettings.description}</p>
                )}
              </div>
              {field.sectionSettings?.collapsible && (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="p-4 bg-background">
              <p className="text-muted-foreground text-sm">Section content will appear here</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderFieldEditor = () => {
    if (!selectedField) return null;

    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="field-label" className="text-xs font-medium">Field Label</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
            className="focus:ring-primary/20"
          />
        </div>

        {['text', 'email', 'number', 'phone', 'url', 'textarea'].includes(selectedField.type) && (
          <div className="space-y-1">
            <Label htmlFor="field-placeholder" className="text-xs font-medium">Placeholder Text</Label>
            <Input
              id="field-placeholder"
              value={selectedField.placeholder || ''}
              onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
              className="focus:ring-primary/20"
            />
          </div>
        )}

        {!['heading', 'paragraph', 'divider'].includes(selectedField.type) && (
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="space-y-0">
              <Label htmlFor="field-required" className="text-xs font-medium">Required Field</Label>
              <p className="text-xs text-muted-foreground">Users must fill this field</p>
            </div>
            <Switch
              id="field-required"
              checked={selectedField.required}
              onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
            />
          </div>
        )}

        {/* Field Width Control */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Field Width</Label>
          <Select
            value={selectedField.width || 'full'}
            onValueChange={(value) => updateField(selectedField.id, { width: value as 'full' | 'half' | 'third' | 'quarter' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width (100%)</SelectItem>
              <SelectItem value="half">Half Width (50%)</SelectItem>
              <SelectItem value="third">Third Width (33%)</SelectItem>
              <SelectItem value="quarter">Quarter Width (25%)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Fields with the same width will appear side by side
          </p>
        </div>

        {['select', 'checkbox', 'radio'].includes(selectedField.type) && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Options</Label>
            <div className="space-y-3">
              {selectedField.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(selectedField.options || [])];
                      newOptions[index] = e.target.value;
                      updateField(selectedField.id, { options: newOptions });
                    }}
                    className="flex-1 focus:ring-primary/20"
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newOptions = selectedField.options?.filter((_, i) => i !== index);
                      updateField(selectedField.id, { options: newOptions });
                    }}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                  updateField(selectedField.id, { options: newOptions });
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {['heading', 'paragraph'].includes(selectedField.type) && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Font Size</Label>
              <Select
                value={selectedField.style?.fontSize || 'base'}
                onValueChange={(value) => updateField(selectedField.id, { 
                  style: { ...selectedField.style, fontSize: value as 'sm' | 'base' | 'lg' | 'xl' | '2xl' } 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  {selectedField.type === 'heading' && <SelectItem value="2xl">2X Large</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Font Weight</Label>
              <Select
                value={selectedField.style?.fontWeight || 'normal'}
                onValueChange={(value) => updateField(selectedField.id, { 
                  style: { ...selectedField.style, fontWeight: value as 'normal' | 'medium' | 'semibold' | 'bold' } 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="semibold">Semibold</SelectItem>  
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Advanced Field Settings */}
        {selectedField.type === 'file' && (
          <div className="space-y-4 border-t pt-4">
            <Label className="text-sm font-semibold">File Upload Settings</Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Max File Size (MB)</Label>
              <Input
                type="number"
                value={selectedField.fileSettings?.maxSize || 10}
                onChange={(e) => updateField(selectedField.id, {
                  fileSettings: {
                    ...selectedField.fileSettings,
                    maxSize: parseInt(e.target.value) || 10,
                    allowedTypes: selectedField.fileSettings?.allowedTypes || ['image/*'],
                    maxFiles: selectedField.fileSettings?.maxFiles || 1,
                    showPreview: selectedField.fileSettings?.showPreview || true
                  }
                })}
                min="1"
                max="100"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Max Number of Files</Label>
              <Input
                type="number"
                value={selectedField.fileSettings?.maxFiles || 1}
                onChange={(e) => updateField(selectedField.id, {
                  fileSettings: {
                    ...selectedField.fileSettings,
                    maxSize: selectedField.fileSettings?.maxSize || 10,
                    allowedTypes: selectedField.fileSettings?.allowedTypes || ['image/*'],
                    maxFiles: parseInt(e.target.value) || 1,
                    showPreview: selectedField.fileSettings?.showPreview || true
                  }
                })}
                min="1"
                max="10"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Show File Preview</Label>
              <Switch
                checked={selectedField.fileSettings?.showPreview ?? true}
                onCheckedChange={(checked) => updateField(selectedField.id, {
                  fileSettings: {
                    ...selectedField.fileSettings,
                    maxSize: selectedField.fileSettings?.maxSize || 10,
                    allowedTypes: selectedField.fileSettings?.allowedTypes || ['image/*'],
                    maxFiles: selectedField.fileSettings?.maxFiles || 1,
                    showPreview: checked
                  }
                })}
              />
            </div>
          </div>
        )}

        {selectedField.type === 'matrix' && (
          <div className="space-y-4 border-t pt-4">
            <Label className="text-sm font-semibold">Matrix Settings</Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Input Type</Label>
              <Select
                value={selectedField.matrixSettings?.inputType || 'radio'}
                onValueChange={(value) => updateField(selectedField.id, {
                  matrixSettings: {
                    ...selectedField.matrixSettings,
                    inputType: value as 'radio' | 'checkbox' | 'text',
                    rows: selectedField.matrixSettings?.rows || ['Row 1', 'Row 2'],
                    columns: selectedField.matrixSettings?.columns || ['Column 1', 'Column 2']
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radio">Radio Buttons</SelectItem>
                  <SelectItem value="checkbox">Checkboxes</SelectItem>
                  <SelectItem value="text">Text Inputs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Rows</Label>
              {selectedField.matrixSettings?.rows?.map((row, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={row}
                    onChange={(e) => {
                      const newRows = [...(selectedField.matrixSettings?.rows || [])];
                      newRows[index] = e.target.value;
                      updateField(selectedField.id, {
                        matrixSettings: {
                          ...selectedField.matrixSettings,
                          rows: newRows,
                          columns: selectedField.matrixSettings?.columns || ['Column 1'],
                          inputType: selectedField.matrixSettings?.inputType || 'radio'
                        }
                      });
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newRows = selectedField.matrixSettings?.rows?.filter((_, i) => i !== index);
                      updateField(selectedField.id, {
                        matrixSettings: {
                          ...selectedField.matrixSettings,
                          rows: newRows || [],
                          columns: selectedField.matrixSettings?.columns || ['Column 1'],
                          inputType: selectedField.matrixSettings?.inputType || 'radio'
                        }
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newRows = [...(selectedField.matrixSettings?.rows || []), `Row ${(selectedField.matrixSettings?.rows?.length || 0) + 1}`];
                  updateField(selectedField.id, {
                    matrixSettings: {
                      ...selectedField.matrixSettings,
                      rows: newRows,
                      columns: selectedField.matrixSettings?.columns || ['Column 1'],
                      inputType: selectedField.matrixSettings?.inputType || 'radio'
                    }
                  });
                }}
                className="w-full"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Row
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Columns</Label>
              {selectedField.matrixSettings?.columns?.map((column, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={column}
                    onChange={(e) => {
                      const newColumns = [...(selectedField.matrixSettings?.columns || [])];
                      newColumns[index] = e.target.value;
                      updateField(selectedField.id, {
                        matrixSettings: {
                          ...selectedField.matrixSettings,
                          columns: newColumns,
                          rows: selectedField.matrixSettings?.rows || ['Row 1'],
                          inputType: selectedField.matrixSettings?.inputType || 'radio'
                        }
                      });
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newColumns = selectedField.matrixSettings?.columns?.filter((_, i) => i !== index);
                      updateField(selectedField.id, {
                        matrixSettings: {
                          ...selectedField.matrixSettings,
                          columns: newColumns || [],
                          rows: selectedField.matrixSettings?.rows || ['Row 1'],
                          inputType: selectedField.matrixSettings?.inputType || 'radio'
                        }
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newColumns = [...(selectedField.matrixSettings?.columns || []), `Column ${(selectedField.matrixSettings?.columns?.length || 0) + 1}`];
                  updateField(selectedField.id, {
                    matrixSettings: {
                      ...selectedField.matrixSettings,
                      columns: newColumns,
                      rows: selectedField.matrixSettings?.rows || ['Row 1'],
                      inputType: selectedField.matrixSettings?.inputType || 'radio'
                    }
                  });
                }}
                className="w-full"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
        )}

        {selectedField.type === 'calculation' && (
          <div className="space-y-4 border-t pt-4">
            <Label className="text-sm font-semibold">Calculation Settings</Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Formula</Label>
              <textarea
                value={selectedField.calculations?.formula || ''}
                onChange={(e) => updateField(selectedField.id, {
                  calculations: {
                    ...selectedField.calculations,
                    formula: e.target.value,
                    enabled: true,
                    dependsOn: selectedField.calculations?.dependsOn || []
                  }
                })}
                className="w-full p-2 border rounded text-sm font-mono"
                rows={3}
                placeholder="e.g., field_1 + field_2 * 0.1"
              />
              <p className="text-xs text-muted-foreground">
                Use field IDs in your formula. Available operators: +, -, *, /, (, )
              </p>
            </div>
          </div>
        )}

        {selectedField.type === 'section' && (
          <div className="space-y-4 border-t pt-4">
            <Label className="text-sm font-semibold">Section Settings</Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <textarea
                value={selectedField.sectionSettings?.description || ''}
                onChange={(e) => updateField(selectedField.id, {
                  sectionSettings: {
                    ...selectedField.sectionSettings,
                    description: e.target.value,
                    collapsible: selectedField.sectionSettings?.collapsible ?? true,
                    defaultCollapsed: selectedField.sectionSettings?.defaultCollapsed ?? false
                  }
                })}
                className="w-full p-2 border rounded text-sm"
                rows={2}
                placeholder="Optional section description"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Collapsible Section</Label>
              <Switch
                checked={selectedField.sectionSettings?.collapsible ?? true}
                onCheckedChange={(checked) => updateField(selectedField.id, {
                  sectionSettings: {
                    ...selectedField.sectionSettings,
                    collapsible: checked,
                    defaultCollapsed: selectedField.sectionSettings?.defaultCollapsed ?? false,
                    description: selectedField.sectionSettings?.description || ''
                  }
                })}
              />
            </div>
            
            {selectedField.sectionSettings?.collapsible && (
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Default Collapsed</Label>
                <Switch
                  checked={selectedField.sectionSettings?.defaultCollapsed ?? false}
                  onCheckedChange={(checked) => updateField(selectedField.id, {
                    sectionSettings: {
                      ...selectedField.sectionSettings,
                      defaultCollapsed: checked,
                      collapsible: selectedField.sectionSettings?.collapsible ?? true,
                      description: selectedField.sectionSettings?.description || ''
                    }
                  })}
                />
              </div>
            )}
          </div>
        )}

        {/* Conditional Logic */}
        {!['divider', 'heading', 'paragraph', 'section'].includes(selectedField.type) && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Conditional Logic</Label>
              <Switch
                checked={selectedField.conditionalLogic?.enabled ?? false}
                onCheckedChange={(checked) => updateField(selectedField.id, {
                  conditionalLogic: {
                    enabled: checked,
                    conditions: selectedField.conditionalLogic?.conditions || [],
                    action: selectedField.conditionalLogic?.action || 'show'
                  }
                })}
              />
            </div>
            
            {selectedField.conditionalLogic?.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Action</Label>
                  <Select
                    value={selectedField.conditionalLogic?.action || 'show'}
                    onValueChange={(value) => updateField(selectedField.id, {
                      conditionalLogic: {
                        ...selectedField.conditionalLogic,
                        enabled: true,
                        action: value as 'show' | 'hide' | 'require' | 'disable',
                        conditions: selectedField.conditionalLogic?.conditions || []
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="show">Show Field</SelectItem>
                      <SelectItem value="hide">Hide Field</SelectItem>
                      <SelectItem value="require">Make Required</SelectItem>
                      <SelectItem value="disable">Disable Field</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  This field will be {selectedField.conditionalLogic.action}n when conditions are met
                </p>
              </div>
            )}
          </div>
        )}

        {/* Advanced Validation */}
        {['text', 'email', 'number', 'textarea', 'phone', 'url'].includes(selectedField.type) && (
          <div className="space-y-4 border-t pt-4">
            <Label className="text-sm font-semibold">Advanced Validation</Label>
            
            {['text', 'textarea'].includes(selectedField.type) && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Min Length</Label>
                    <Input
                      type="number"
                      value={selectedField.validation?.minLength || ''}
                      onChange={(e) => updateField(selectedField.id, {
                        validation: {
                          ...selectedField.validation,
                          minLength: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Max Length</Label>
                    <Input
                      type="number"
                      value={selectedField.validation?.maxLength || ''}
                      onChange={(e) => updateField(selectedField.id, {
                        validation: {
                          ...selectedField.validation,
                          maxLength: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                      placeholder="100"
                    />
                  </div>
                </div>
              </>
            )}
            
            {selectedField.type === 'number' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Min Value</Label>
                  <Input
                    type="number"
                    value={selectedField.validation?.min || ''}
                    onChange={(e) => updateField(selectedField.id, {
                      validation: {
                        ...selectedField.validation,
                        min: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Max Value</Label>
                  <Input
                    type="number"
                    value={selectedField.validation?.max || ''}
                    onChange={(e) => updateField(selectedField.id, {
                      validation: {
                        ...selectedField.validation,
                        max: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="1000"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Custom Pattern (Regex)</Label>
              <Input
                value={selectedField.validation?.pattern || ''}
                onChange={(e) => updateField(selectedField.id, {
                  validation: {
                    ...selectedField.validation,
                    pattern: e.target.value
                  }
                })}
                placeholder="^[A-Za-z0-9]+$"
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Custom Error Message</Label>
              <Input
                value={selectedField.validation?.customMessage || ''}
                onChange={(e) => updateField(selectedField.id, {
                  validation: {
                    ...selectedField.validation,
                    customMessage: e.target.value
                  }
                })}
                placeholder="Please enter a valid value"
              />
            </div>
          </div>
        )}

        {/* Custom Styling */}
        <div className="space-y-4 border-t pt-4">
          <Label className="text-sm font-semibold">Custom Styling</Label>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Custom CSS Classes</Label>
            <Input
              value={selectedField.style?.customCSS || ''}
              onChange={(e) => updateField(selectedField.id, {
                style: {
                  ...selectedField.style,
                  customCSS: e.target.value
                }
              })}
              placeholder="my-custom-class another-class"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Add custom CSS classes for advanced styling
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (previewMode) {
    const deviceClasses = {
      desktop: 'max-w-4xl',
      tablet: 'max-w-2xl',
      mobile: 'max-w-sm'
    };

    return (
      <div className="min-h-screen bg-background">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-6 border-b bg-card sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{formName}</h1>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
              Preview Mode
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Device Toggle */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={() => setPreviewMode(false)}
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="py-12">
          <div className={`mx-auto px-6 ${deviceClasses[previewDevice]}`}>
            <Card className="shadow-lg">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl font-bold text-center">
                  {formName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                {groupFieldsIntoRows(fields).map((row, rowIndex) => (
                  <div key={`preview-row-${rowIndex}`} className="flex flex-wrap -mr-2">
                    {row.map((field) => (
                      <div key={field.id} className={`${getFieldWidthClass(field.width)} mb-4`}>
                        <div className="space-y-3">
                          {!['heading', 'paragraph', 'divider'].includes(field.type) && (
                            <Label className="text-base font-semibold text-foreground block">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-2">*</span>}
                            </Label>
                          )}
                          {renderField(field, true)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                <Button className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white">
                  {t('formBuilder.submitForm' as any) || 'Submit Form'} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          {notification}
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-card sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="text-2xl font-bold border-none bg-transparent p-0 focus:ring-0 shadow-none"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            placeholder={t('formBuilder.formTitle' as any) || 'Form Title'}
          />
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
            {fields.length} {t('formBuilder.fieldsCount' as any) || 'fields'} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {t('formBuilder.preview' as any) || 'Preview'} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
          </Button>
          
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('formBuilder.saveForm' as any) || 'Save Form'} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
          </Button>
        </div>
      </div>

      {/* Advanced Toolbar */}
      <div className="border-b bg-muted/30 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Multi-step Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="multi-step"
                checked={isMultiStep}
                onCheckedChange={setIsMultiStep}
              />
              <Label htmlFor="multi-step" className="text-sm font-medium">Multi-step Form</Label>
            </div>

            {/* Form Analytics */}
            <Button 
              variant={showAnalytics ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart className="w-4 h-4" />
              <span>Analytics</span>
            </Button>

            {/* Conditional Logic Overview */}
            <Button 
              variant={showLogicRules ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowLogicRules(!showLogicRules)}
            >
              <GitBranch className="w-4 h-4" />
              <span>Logic Rules</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {fields.filter(f => f.conditionalLogic?.enabled).length}
              </span>
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Import/Export */}
            <div className="flex items-center space-x-1 bg-background rounded-lg p-1 border">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => {
                  // Create a file input element for importing
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        try {
                          const data = JSON.parse(e.target?.result as string);
                          if (data.fields && Array.isArray(data.fields)) {
                            setFields(data.fields);
                            setFormName(data.formName || 'Imported Form');
                            showNotification('Form imported successfully!');
                          } else {
                            showNotification('Invalid form data format');
                          }
                        } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
                          showNotification('Error parsing JSON file');
                        }
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => {
                  // Export form as JSON
                  const formData = {
                    formName,
                    fields,
                    isMultiStep,
                    exportedAt: new Date().toISOString()
                  };
                  const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${formName.replace(/\s+/g, '_').toLowerCase()}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  showNotification('Form exported successfully!');
                }}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>

            {/* Form Settings */}
            <Button 
              variant={showSettings ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="border-b bg-blue-50 dark:bg-blue-950/20 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold mb-3 text-blue-800 dark:text-blue-200">Form Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Fields</h4>
                <p className="text-xl font-bold text-blue-600">{fields.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Required Fields</h4>
                <p className="text-xl font-bold text-green-600">{fields.filter(f => f.required).length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Conditional Fields</h4>
                <p className="text-xl font-bold text-purple-600">{fields.filter(f => f.conditionalLogic?.enabled).length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Advanced Fields</h4>
                <p className="text-xl font-bold text-orange-600">
                  {fields.filter(f => ['signature', 'richtext', 'matrix', 'calculation', 'section'].includes(f.type)).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logic Rules Panel */}
      {showLogicRules && (
        <div className="border-b bg-purple-50 dark:bg-purple-950/20 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200">Conditional Logic Rules</h3>
            {fields.filter(f => f.conditionalLogic?.enabled).length > 0 ? (
              <div className="space-y-3">
                {fields.filter(f => f.conditionalLogic?.enabled).map(field => (
                  <div key={field.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{field.label}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Action: <span className="font-medium text-purple-600">{field.conditionalLogic?.action}</span>
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedField(field)}
                    >
                      Edit Rules
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No conditional logic rules defined yet</p>
                <p className="text-sm text-gray-500">Add conditional logic to fields in the properties panel</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b bg-gray-50 dark:bg-gray-950/20 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Form Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Form Name</Label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Multi-step Form</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Break form into multiple pages</p>
                  </div>
                  <Switch checked={isMultiStep} onCheckedChange={setIsMultiStep} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Form Statistics</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Fields:</span>
                      <span className="font-medium">{fields.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Required Fields:</span>
                      <span className="font-medium">{fields.filter(f => f.required).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Advanced Fields:</span>
                      <span className="font-medium">
                        {fields.filter(f => ['signature', 'richtext', 'matrix', 'calculation', 'section'].includes(f.type)).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className={`flex ${showAnalytics || showLogicRules || showSettings ? 'h-[calc(100vh-280px)]' : 'h-[calc(100vh-125px)]'}`}>
          {/* Left Sidebar - Field Types */}
          <div className="w-72 bg-card border-r overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">{t('formBuilder.formElements' as any) || 'Form Elements'}</h3> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                <p className="text-sm text-muted-foreground">{t('formBuilder.dragToPosition' as any) || 'Click to add or drag to position'}</p> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
              </div>
              
              <Tabs defaultValue="input" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input">{t('formBuilder.tabs.basic' as any) || 'Basic'}</TabsTrigger> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                <TabsTrigger value="advanced">{t('formBuilder.tabs.advanced' as any) || 'Advanced'}</TabsTrigger> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
              </TabsList>
              
              <TabsContent value="input" className="space-y-2 mt-4">
                <div className="space-y-3">
                  {/* Input Fields */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">{t('formBuilder.categories.input' as any) || 'Input'}</h4> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                    <div className="space-y-2">
                      {fieldTypes
                        .filter(field => field.category === 'Input')
                        .map((fieldType) => (
                          <Card
                            key={fieldType.type}
                            className="cursor-pointer hover:shadow-sm transition-all duration-200 hover:border-primary/50 group"
                            onClick={() => addField(fieldType.type as FormField['type'])}
                          >
                            <CardContent className="flex items-center space-x-3 p-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                                {fieldType.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{getFieldTypeLabel(fieldType.type)}</h4>
                                <p className="text-xs text-muted-foreground">{getFieldTypeDescription(fieldType.type)}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Choice Fields */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">{t('formBuilder.categories.choice' as any) || 'Choice'}</h4> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                    <div className="space-y-2">
                      {fieldTypes
                        .filter(field => field.category === 'Choice')
                        .map((fieldType) => (
                          <Card
                            key={fieldType.type}
                            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50 group hover:scale-105"
                            onClick={() => addField(fieldType.type as FormField['type'])}
                          >
                            <CardContent className="flex items-center space-x-4 p-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
                                {fieldType.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{fieldType.label}</h4>
                                <p className="text-xs text-muted-foreground">{fieldType.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-2 mt-4">
                <div className="space-y-3">
                  {/* Advanced Fields */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">{t('formBuilder.categories.advanced' as any) || 'Advanced'}</h4> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                    <div className="space-y-2">
                      {fieldTypes
                        .filter(field => field.category === 'Advanced')
                        .map((fieldType) => (
                          <Card
                            key={fieldType.type}
                            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50 group hover:scale-105"
                            onClick={() => addField(fieldType.type as FormField['type'])}
                          >
                            <CardContent className="flex items-center space-x-4 p-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
                                {fieldType.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{fieldType.label}</h4>
                                <p className="text-xs text-muted-foreground">{fieldType.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Layout Fields */}
                  <div>
                    <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">{t('formBuilder.categories.layout' as any) || 'Layout'}</h4> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                    <div className="space-y-2">
                      {fieldTypes
                        .filter(field => field.category === 'Layout')
                        .map((fieldType) => (
                          <Card
                            key={fieldType.type}
                            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50 group hover:scale-105"
                            onClick={() => addField(fieldType.type as FormField['type'])}
                          >
                            <CardContent className="flex items-center space-x-4 p-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
                                {fieldType.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{fieldType.label}</h4>
                                <p className="text-xs text-muted-foreground">{fieldType.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Center - Form Builder Canvas */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="h-full">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  {t('formBuilder.formBuilderCanvas' as any) || 'Form Builder Canvas'} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t('formBuilder.designYourForm' as any) || 'Design your form by adding and arranging elements'}</p> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
              </CardHeader>
              <CardContent className="p-4 h-[calc(100%-80px)]">
                  <Droppable droppableId="form-fields">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-3 min-h-full p-4 border-2 border-dashed rounded-lg transition-all duration-200 ${
                          snapshot.isDraggingOver
                            ? 'border-primary bg-primary/5 shadow-inner border-solid'
                            : 'border-border bg-muted/20'
                        }`}
                      >
                        {groupFieldsIntoRows(fields).map((row, rowIndex) => (
                          <div key={`row-${rowIndex}`} className="flex flex-wrap -mr-2">
                            {row.map((field, _fieldIndex) => { // eslint-disable-line @typescript-eslint/no-unused-vars
                              const globalIndex = fields.findIndex(f => f.id === field.id);
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
                                            ? 'border-primary ring-1 ring-primary/20 shadow-md'
                                            : 'border-border hover:border-primary/50 hover:shadow-sm'
                                        } ${
                                          snapshot.isDragging 
                                            ? 'shadow-xl scale-105 z-[9999] opacity-90' 
                                            : ''
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedField(field);
                                        }}
                                      >
                                        <div className="flex items-start justify-between h-full">
                                          <div className="flex-1 space-y-2">
                                            {!['heading', 'paragraph', 'divider'].includes(field.type) && (
                                              <Label className="text-base font-semibold text-foreground block">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-2">*</span>}
                                              </Label>
                                            )}
                                            {renderField(field)}
                                          </div>
                                          
                                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                            <div 
                                              {...provided.dragHandleProps}
                                              className="p-2 rounded-lg hover:bg-muted cursor-grab active:cursor-grabbing touch-none border border-transparent hover:border-border"
                                              onMouseDown={(e) => e.stopPropagation()}
                                              title="Drag to reorder"
                                            >
                                              <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                            </div>
                                            
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                duplicateField(field);
                                              }}
                                              className="hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                            >
                                              <Copy className="w-4 h-4" />
                                            </Button>
                                            
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                deleteField(field.id);
                                              }}
                                              className="hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </Button>
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
                        
                        {fields.length === 0 && !snapshot.isDraggingOver && (
                          <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                              <Layout className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                              Start Building Your Form
                            </h3>
                            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                              Drag form elements from the left panel or click to add them to your form
                            </p>
                          </div>
                        )}
                        
                        {fields.length === 0 && snapshot.isDraggingOver && (
                          <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-lg bg-primary/20 border-2 border-primary border-dashed flex items-center justify-center mx-auto mb-6">
                              <Plus className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-primary">
                              Drop Here
                            </h3>
                            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                              Release to add this element to your form
                            </p>
                          </div>
                        )}
                        
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Field Properties */}
        <div className="w-72 bg-card border-l overflow-y-auto">
          <div className="p-4">
            <h3 className="text-base font-semibold mb-4 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              {t('formBuilder.fieldProperties' as any) || 'Field Properties'}
            </h3>
            
            {selectedField ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      {fieldTypes.find(f => f.type === selectedField.type)?.icon}
                    </div>
                    <span>{getFieldTypeLabel(selectedField.type)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {renderFieldEditor()}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">{t('formBuilder.noFieldSelected' as any) || 'No Field Selected'}</h4> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('formBuilder.clickToCustomize' as any) || 'Click on a form field to customize its properties and settings'} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </DragDropContext>
    </div>
  );
} 