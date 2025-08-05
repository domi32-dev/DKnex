import { ReactNode } from 'react';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'phone' | 'url' | 'file' | 'rating' | 'toggle' | 'divider' | 'heading' | 'paragraph' | 'signature' | 'richtext' | 'matrix' | 'calculation' | 'section' | 'repeating' | 'lookup' | 'payment' | 'location' | 'slider' | 'color' | 'time' | 'datetime' | 'custom';
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
    aiValidation?: {
      enabled: boolean;
      rules: string[];
      severity: 'error' | 'warning' | 'info';
    };
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
    rules: LogicRule[];
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
  // AI Integration Fields
  aiSettings?: {
    enabled: boolean;
    suggestions: AISuggestion[];
    autoComplete: boolean;
    smartValidation: boolean;
    contentGeneration: boolean;
    optimizationHints: string[];
  };
  // Dev Mode Fields
  customComponent?: {
    enabled: boolean;
    id?: string; // Add id to link to CustomFieldType
    html: string;
    css: string;
    javascript: string;
    props: Record<string, string | number | boolean | string[]>;
    events: CustomEvent[];
    dependencies: string[];
  };
  step?: number;
  pageId?: string;
  analytics?: {
    completionRate?: number;
    averageTime?: number;
    dropoffRate?: number;
    aiOptimizationScore?: number;
  };
}

// AI Integration Types
export interface AISuggestion {
  id: string;
  type: 'field' | 'validation' | 'styling' | 'logic' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  action: () => void;
  preview?: string;
}

export interface AIFormAnalysis {
  score: number;
  suggestions: AISuggestion[];
  insights: {
    conversionOptimization: string[];
    userExperience: string[];
    accessibility: string[];
    performance: string[];
  };
  predictedMetrics: {
    completionRate: number;
    abandonmentRate: number;
    timeToComplete: number;
  };
}

export interface AIFieldRecommendation {
  fieldType: FormField['type'];
  label: string;
  placeholder?: string;
  validation?: Partial<FormField['validation']>;
  reasoning: string;
  confidence: number;
}

// Dev Mode Types
export interface CustomEvent {
  name: string;
  handler: string;
  parameters: string[];
}

export interface CustomFieldType {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: ReactNode;
  template: {
    html: string;
    css: string;
    javascript: string;
    props: CustomFieldProp[];
  };
  preview: string;
  author: string;
  version: string;
  dependencies: string[];
}

export interface CustomFieldProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: string | number | boolean | string[];
  description: string;
}

export interface LogicRule {
  id: string;
  name: string;
  enabled: boolean;
  triggerField: string;
  triggerCondition: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  triggerValue: string;
  actions: LogicAction[];
  priority: number;
}

export interface LogicAction {
  id: string;
  targetField: string;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'set_value' | 'set_required' | 'set_optional';
  value?: string;
}

export interface FormLogic {
  id: string;
  name: string;
  type: 'save_workflow' | 'validation_workflow' | 'notification_workflow' | 'redirect_workflow';
  enabled: boolean;
  conditions: LogicRule[];
  actions: FormLogicAction[];
  priority: number;
}

export interface FormLogicAction {
  id: string;
  type: 'save_data' | 'send_email' | 'redirect' | 'show_message' | 'trigger_webhook';
  config: Record<string, string | number | boolean | string[]>;
}

export interface DevModeSettings {
  enabled: boolean;
  codeEditor: {
    theme: 'dark' | 'light';
    fontSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
  sandbox: {
    allowNetworkRequests: boolean;
    allowLocalStorage: boolean;
    allowedDomains: string[];
    maxExecutionTime: number;
  };
  debugging: {
    enableConsole: boolean;
    enableInspector: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
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

export interface PlatformExport {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'framework' | 'platform' | 'cms' | 'enterprise';
  supportedFeatures: string[];
  exportFunction: (form: FormExportData) => Promise<ExportResult>;
  preview?: string;
  documentation?: string;
}

export interface FormExportData {
  formName: string;
  fields: FormField[];
  pages: FormPage[];
  settings: {
    theme: string;
    primaryColor: string;
    submitButtonText: string;
    successMessage: string;
    enableNotifications: boolean;
    enableAnalytics: boolean;
  };
  customFieldTypes: CustomFieldType[];
  isMultiStep: boolean;
}

export interface ExportResult {
  success: boolean;
  files: ExportFile[];
  instructions: string[];
  warnings?: string[];
  errors?: string[];
  estimatedTime?: string;
}

export interface ExportFile {
  name: string;
  content: string;
  type: 'code' | 'config' | 'documentation' | 'assets';
  language?: string;
  framework?: string;
} 