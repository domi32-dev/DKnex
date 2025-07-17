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

import { FieldCategory, FieldType, FieldTemplate } from './types';

export const fieldCategories = {
  input: {
    label: 'Input Fields',
    icon: 'Type',
    description: 'Basic text and data input fields',
    color: 'bg-blue-500'
  },
  choice: {
    label: 'Choice Fields',
    icon: 'CheckSquare',
    description: 'Selection and choice fields',
    color: 'bg-green-500'
  },
  layout: {
    label: 'Layout & Display',
    icon: 'Layout',
    description: 'Structure and visual elements',
    color: 'bg-purple-500'
  },
  advanced: {
    label: 'Advanced Fields',
    icon: 'Zap',
    description: 'Complex and specialized fields',
    color: 'bg-orange-500'
  },
  integrations: {
    label: 'Integrations',
    icon: 'Database',
    description: 'External services and APIs',
    color: 'bg-red-500'
  },
  premium: {
    label: 'Premium Features',
    icon: 'Crown',
    description: 'Advanced premium functionality',
    color: 'bg-yellow-500'
  }
};

export const fieldTypes = [
  // Input Fields
  { type: 'text', label: 'Text Input', icon: 'Type', category: 'input', description: 'Single line text input', keywords: ['text', 'input', 'string'] },
  { type: 'email', label: 'Email', icon: 'Mail', category: 'input', description: 'Email address input', keywords: ['email', 'mail', 'address'] },
  { type: 'number', label: 'Number', icon: 'Hash', category: 'input', description: 'Numeric input field', keywords: ['number', 'numeric', 'integer'] },
  { type: 'phone', label: 'Phone', icon: 'Phone', category: 'input', description: 'Phone number input', keywords: ['phone', 'telephone', 'mobile'] },
  { type: 'url', label: 'URL', icon: 'Link', category: 'input', description: 'Website URL input', keywords: ['url', 'link', 'website'] },
  { type: 'textarea', label: 'Textarea', icon: 'FileText', category: 'input', description: 'Multi-line text input', keywords: ['textarea', 'multiline', 'paragraph'] },
  { type: 'date', label: 'Date', icon: 'Calendar', category: 'input', description: 'Date picker input', keywords: ['date', 'calendar', 'picker'] },
  { type: 'time', label: 'Time', icon: 'Calendar', category: 'input', description: 'Time picker input', keywords: ['time', 'clock', 'hour'] },
  { type: 'datetime', label: 'Date & Time', icon: 'Calendar', category: 'input', description: 'Date and time picker', keywords: ['datetime', 'timestamp'] },
  { type: 'file', label: 'File Upload', icon: 'Upload', category: 'input', description: 'File upload input', keywords: ['file', 'upload', 'attachment'] },
  { type: 'color', label: 'Color Picker', icon: 'Palette', category: 'input', description: 'Color selection input', keywords: ['color', 'picker', 'palette'] },
  { type: 'slider', label: 'Slider', icon: 'Minus', category: 'input', description: 'Range slider input', keywords: ['slider', 'range', 'scale'] },
  
  // Choice Fields
  { type: 'select', label: 'Dropdown', icon: 'ChevronDown', category: 'choice', description: 'Select from dropdown', keywords: ['select', 'dropdown', 'choose'] },
  { type: 'radio', label: 'Radio Button', icon: 'Circle', category: 'choice', description: 'Single choice selection', keywords: ['radio', 'option', 'single'] },
  { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare', category: 'choice', description: 'Multiple choice selection', keywords: ['checkbox', 'multiple', 'check'] },
  { type: 'rating', label: 'Rating', icon: 'Star', category: 'choice', description: 'Star rating input', keywords: ['rating', 'stars', 'review'] },
  { type: 'toggle', label: 'Toggle', icon: 'ToggleLeft', category: 'choice', description: 'On/off toggle switch', keywords: ['toggle', 'switch', 'boolean'] },
  
  // Layout & Display
  { type: 'heading', label: 'Heading', icon: 'Type', category: 'layout', description: 'Section heading text', keywords: ['heading', 'title', 'header'] },
  { type: 'paragraph', label: 'Paragraph', icon: 'FileText', category: 'layout', description: 'Paragraph text block', keywords: ['paragraph', 'text', 'content'] },
  { type: 'divider', label: 'Divider', icon: 'Minus', category: 'layout', description: 'Visual separator line', keywords: ['divider', 'separator', 'line'] },
  { type: 'section', label: 'Section', icon: 'Layout', category: 'layout', description: 'Collapsible section container', keywords: ['section', 'container', 'group'] },
  
  // Advanced Fields
  { type: 'signature', label: 'Signature', icon: 'PenTool', category: 'advanced', description: 'Digital signature pad', keywords: ['signature', 'sign', 'digital'] },
  { type: 'richtext', label: 'Rich Text', icon: 'FileText', category: 'advanced', description: 'Rich text editor', keywords: ['richtext', 'editor', 'wysiwyg'] },
  { type: 'matrix', label: 'Matrix', icon: 'Grid', category: 'advanced', description: 'Matrix/grid input table', keywords: ['matrix', 'grid', 'table'] },
  { type: 'calculation', label: 'Calculation', icon: 'Calculator', category: 'advanced', description: 'Auto-calculated field', keywords: ['calculation', 'formula', 'compute'] },
  { type: 'repeating', label: 'Repeating Section', icon: 'Copy', category: 'advanced', description: 'Dynamic repeating fields', keywords: ['repeating', 'dynamic', 'loop'] },
  
  // Integrations
  { type: 'lookup', label: 'Lookup', icon: 'Database', category: 'integrations', description: 'External data lookup', keywords: ['lookup', 'search', 'external'] },
  { type: 'payment', label: 'Payment', icon: 'CreditCard', category: 'integrations', description: 'Payment processing', keywords: ['payment', 'credit', 'purchase'] },
  { type: 'location', label: 'Location', icon: 'Target', category: 'integrations', description: 'GPS location picker', keywords: ['location', 'gps', 'map'] },
];

export const defaultTemplates = [
  {
    id: 'contact-info',
    name: 'Contact Information',
    description: 'Name, email, and phone fields',
    category: 'templates',
    icon: 'Users',
    field: { type: 'text', label: 'Full Name', required: true }
  },
  {
    id: 'address-block',
    name: 'Address Block',
    description: 'Complete address fields',
    category: 'templates',
    icon: 'Target',
    field: { type: 'text', label: 'Street Address', required: true }
  },
  {
    id: 'feedback-rating',
    name: 'Feedback & Rating',
    description: 'Rating with comment field',
    category: 'templates',
    icon: 'Star',
    field: { type: 'rating', label: 'Rate your experience', required: true }
  }
];

export const DEVICE_CLASSES = {
  desktop: 'max-w-4xl',
  tablet: 'max-w-2xl',
  mobile: 'max-w-sm'
} as const; 