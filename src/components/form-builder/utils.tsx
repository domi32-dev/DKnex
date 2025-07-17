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
  Crown
} from 'lucide-react';

import { FormField } from './types';

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
  
  const React = require('react');
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
    location: () => <Target className="w-4 h-4" />
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

export const filterFieldTypes = (fieldTypes: any[], searchQuery: string, selectedCategory: string) => {
  return fieldTypes.filter(fieldType => {
    const matchesSearch = searchQuery === '' || 
      fieldType.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fieldType.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fieldType.keywords.some((keyword: string) => keyword.includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || fieldType.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
};

export const groupFieldTypesByCategory = (fieldTypes: any[]) => {
  return fieldTypes.reduce((acc, fieldType) => {
    if (!acc[fieldType.category]) {
      acc[fieldType.category] = [];
    }
    acc[fieldType.category].push(fieldType);
    return acc;
  }, {} as Record<string, any[]>);
}; 