import React from 'react';
import { 
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
  Star,
  ToggleLeft,
  Layout,
  Minus,
  Palette,
  Upload,
  PenTool,
  Grid,
  Calculator,
  Copy,
  Database,
  CreditCard,
  Target,
  Users,
  Zap,
  Crown,
  Brain,
  Sparkles,
  Wand2,
  Bot,
  Code
} from 'lucide-react';

import { FormField, LogicRule, FieldType } from './types';

// Icon mapping for rendering
const iconMap = {
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
  Star,
  ToggleLeft,
  Layout,
  Minus,
  Palette,
  Upload,
  PenTool,
  Grid,
  Calculator,
  Copy,
  Database,
  CreditCard,
  Target,
  Users,
  Zap,
  Crown
};

export const renderIcon = (iconName: string, className = "w-4 h-4") => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  if (!IconComponent) return null;
  
  return React.createElement(IconComponent, { className });
};

export const getFieldIcon = (type: string) => {
  const fieldIconMap: Record<string, () => React.ReactNode> = {
    text: () => <Type className="w-4 h-4" />,
    email: () => <Mail className="w-4 h-4" />,
    number: () => <Hash className="w-4 h-4" />,
    phone: () => <Phone className="w-4 h-4" />,
    url: () => <Link className="w-4 h-4" />,
    textarea: () => <FileText className="w-4 h-4" />,
    date: () => <Calendar className="w-4 h-4" />,
    time: () => <Calendar className="w-4 h-4" />,
    datetime: () => <Calendar className="w-4 h-4" />,
    file: () => <Upload className="w-4 h-4" />,
    color: () => <Palette className="w-4 h-4" />,
    slider: () => <Minus className="w-4 h-4" />,
    select: () => <ChevronDown className="w-4 h-4" />,
    radio: () => <Circle className="w-4 h-4" />,
    checkbox: () => <CheckSquare className="w-4 h-4" />,
    rating: () => <Star className="w-4 h-4" />,
    toggle: () => <ToggleLeft className="w-4 h-4" />,
    heading: () => <Type className="w-4 h-4" />,
    paragraph: () => <FileText className="w-4 h-4" />,
    divider: () => <Minus className="w-4 h-4" />,
    section: () => <Layout className="w-4 h-4" />,
    signature: () => <PenTool className="w-4 h-4" />,
    richtext: () => <FileText className="w-4 h-4" />,
    matrix: () => <Grid className="w-4 h-4" />,
    calculation: () => <Calculator className="w-4 h-4" />,
    repeating: () => <Copy className="w-4 h-4" />,
    lookup: () => <Database className="w-4 h-4" />,
    payment: () => <CreditCard className="w-4 h-4" />,
    location: () => <Target className="w-4 h-4" />,
    // AI-powered fields
    'ai-text': () => <Brain className="w-4 h-4" />,
    'ai-validation': () => <Sparkles className="w-4 h-4" />,
    'ai-content': () => <Wand2 className="w-4 h-4" />,
    'ai-assistant': () => <Bot className="w-4 h-4" />,
    // Custom field
    custom: () => <Code className="w-4 h-4" />
  };
  
  const iconFn = fieldIconMap[type] || (() => <Type className="w-4 h-4" />);
  return iconFn();
};

export const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getFieldWidth = (width?: string) => {
  switch (width) {
    case 'quarter': return 25;
    case 'third': return 33.33;
    case 'half': return 50;
    case 'full':
    default: return 100;
  }
};

export const getFieldWidthClass = (width?: string) => {
  switch (width) {
    case 'quarter': return 'w-1/4 pr-2';
    case 'third': return 'w-1/3 pr-2';
    case 'half': return 'w-1/2 pr-2';
    case 'full':
    default: return 'w-full';
  }
};

export const groupFieldsIntoRows = (fields: FormField[]) => {
  const rows: FormField[][] = [];
  let currentRow: FormField[] = [];
  let currentRowWidth = 0;

  fields.forEach(field => {
    const fieldWidth = getFieldWidth(field.width);
    
    if (currentRowWidth + fieldWidth > 100 && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [field];
      currentRowWidth = fieldWidth;
    } else {
      currentRow.push(field);
      currentRowWidth += fieldWidth;
    }
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
};

export const filterFieldTypes = (fieldTypes: FieldType[], searchQuery: string, selectedCategory: string) => {
  return fieldTypes.filter(fieldType => {
    const matchesSearch = searchQuery === '' || 
      fieldType.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fieldType.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fieldType.keywords.some((keyword: string) => keyword.includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || fieldType.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
};

export const groupFieldTypesByCategory = (fieldTypes: FieldType[]) => {
  return fieldTypes.reduce((acc, fieldType) => {
    if (!acc[fieldType.category]) {
      acc[fieldType.category] = [];
    }
    acc[fieldType.category].push(fieldType);
    return acc;
  }, {} as Record<string, FieldType[]>);
};

// NEW: Conditional Logic Utilities
export const evaluateCondition = (
  rule: LogicRule, 
  triggerValue: string | number | boolean | string[]
): boolean => {
  const { triggerCondition, triggerValue: ruleValue } = rule;

  // Convert values to strings for comparison
  const trigger = String(triggerValue || '').toLowerCase();
  const target = String(ruleValue || '').toLowerCase();

  switch (triggerCondition) {
    case 'equals':
      return trigger === target;
    case 'not_equals':
      return trigger !== target;
    case 'contains':
      return trigger.includes(target);
    case 'not_contains':
      return !trigger.includes(target);
    case 'greater_than':
      return Number(triggerValue) > Number(ruleValue);
    case 'less_than':
      return Number(triggerValue) < Number(ruleValue);
    case 'is_empty':
      return !triggerValue || trigger === '';
    case 'is_not_empty':
      return Boolean(triggerValue) && trigger !== '';
    default:
      return false;
  }
};

export const shouldFieldBeVisible = (
  field: FormField, 
  formValues: Record<string, string | number | boolean | string[]>, 
  allFields: FormField[]
): boolean => {
  // If no conditional logic, field is always visible
  if (!field.conditionalLogic?.enabled || !field.conditionalLogic.rules?.length) {
    return true;
  }

  // Evaluate all rules for this field
  const results = field.conditionalLogic.rules.map(rule => {
    const triggerFieldValue = formValues[rule.triggerField];
    return evaluateCondition(rule, triggerFieldValue);
  });

  // For now, ALL rules must be true for field to be visible
  // You could make this configurable (ANY vs ALL)
  return results.every(result => result);
};

export const getVisibleFields = (
  fields: FormField[], 
  formValues: Record<string, string | number | boolean | string[]>
): FormField[] => {
  return fields.filter(field => shouldFieldBeVisible(field, formValues, fields));
};

export const applyFieldLogicActions = (
  field: FormField,
  formValues: Record<string, string | number | boolean | string[]>,
  allFields: FormField[]
): Partial<FormField> => {
  if (!field.conditionalLogic?.enabled || !field.conditionalLogic.rules?.length) {
    return {};
  }

  const updates: Partial<FormField> = {};

  field.conditionalLogic.rules.forEach(rule => {
    const triggerFieldValue = formValues[rule.triggerField];
    const conditionMet = evaluateCondition(rule, triggerFieldValue);

    if (conditionMet) {
      rule.actions.forEach(action => {
        switch (action.action) {
          case 'set_value':
            // This would be handled by the form component
            break;
          case 'set_required':
            updates.required = true;
            break;
          case 'set_optional':
            updates.required = false;
            break;
          // show/hide handled by shouldFieldBeVisible
          // enable/disable could be added as a field property
        }
      });
    }
  });

  return updates;
}; 