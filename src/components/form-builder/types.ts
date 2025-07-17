import { ReactNode } from 'react';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'phone' | 'url' | 'file' | 'rating' | 'toggle' | 'divider' | 'heading' | 'paragraph' | 'signature' | 'richtext' | 'matrix' | 'calculation' | 'section' | 'repeating' | 'lookup' | 'payment' | 'location' | 'slider' | 'color' | 'time' | 'datetime';
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
    maxSize: number;
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
    icon?: string;
    color?: string;
  };
  repeatingSettings?: {
    minItems: number;
    maxItems: number;
    addButtonText: string;
    removeButtonText: string;
  };
  step?: number;
  pageId?: string;
  analytics?: {
    completionRate?: number;
    averageTime?: number;
    dropoffRate?: number;
  };
}

export interface FormPage {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface FieldTemplate {
  id: string;
  name: string;
  description: string;
  field: Partial<FormField>;
  category: string;
  icon: ReactNode;
  isPremium?: boolean;
}

export interface FieldType {
  type: string;
  label: string;
  icon: ReactNode;
  category: string;
  description: string;
  keywords: string[];
}

export interface FieldCategory {
  label: string;
  icon: ReactNode;
  description: string;
  color: string;
}

export interface FormBuilderProps {
  formId?: string;
  initialFields?: FormField[];
  onSave?: (fields: FormField[], formName: string, pages?: FormPage[]) => void;
}

export interface FormBuilderState {
  fields: FormField[];
  pages: FormPage[];
  currentPage: string;
  selectedField: FormField | null;
  formName: string;
  previewMode: boolean;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  isMultiStep: boolean;
  showAnalytics: boolean;
  showLogicRules: boolean;
  showSettings: boolean;
  showTemplates: boolean;
  notification: string | null;
  searchQuery: string;
  selectedCategory: string;
  collapsedCategories: Record<string, boolean>;
  history: { fields: FormField[]; timestamp: number }[];
  historyIndex: number;
  isInlineEditing: string | null;
  showOnboarding: boolean;
  currentTheme: string;
  showLogicBuilder: boolean;
  fieldTemplates: FieldTemplate[];
}

export type FormBuilderAction = 
  | { type: 'SET_FIELDS'; payload: FormField[] }
  | { type: 'ADD_FIELD'; payload: FormField }
  | { type: 'UPDATE_FIELD'; payload: { id: string; updates: Partial<FormField> } }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'SELECT_FIELD'; payload: FormField | null }
  | { type: 'SET_FORM_NAME'; payload: string }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_PREVIEW_DEVICE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'TOGGLE_ANALYTICS'; payload: boolean }
  | { type: 'TOGGLE_LOGIC_RULES'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'TOGGLE_CATEGORY'; payload: string }
  | { type: 'SET_NOTIFICATION'; payload: string | null }
  | { type: 'START_INLINE_EDIT'; payload: string }
  | { type: 'STOP_INLINE_EDIT' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ADD_TO_HISTORY'; payload: FormField[] }; 