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
  Code,
  Sparkles,
  Wand2,
  Bot,
  Building
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
  ai: {
    label: 'AI-Powered',
    icon: 'Brain',
    description: 'AI-enhanced smart fields',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  custom: {
    label: 'Custom Components',
    icon: 'Code',
    description: 'Developer-created custom fields',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  },
  premium: {
    label: 'Premium Features',
    icon: 'Crown',
    description: 'Advanced premium functionality',
    color: 'bg-yellow-500'
  }
};

// Icon mapping for category icons
export const categoryIconMap = {
  Type,
  CheckSquare,
  Layout,
  Zap,
  Database,
  Brain,
  Code,
  Crown
} as const;

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
  
  // AI-Powered Fields
  { type: 'ai-text', label: 'AI Smart Text', icon: 'Brain', category: 'ai', description: 'AI-enhanced text input with suggestions', keywords: ['ai', 'smart', 'suggestions', 'text'] },
  { type: 'ai-validation', label: 'AI Validator', icon: 'Sparkles', category: 'ai', description: 'AI-powered field validation', keywords: ['ai', 'validation', 'smart', 'check'] },
  { type: 'ai-content', label: 'AI Content Gen', icon: 'Wand2', category: 'ai', description: 'AI content generation field', keywords: ['ai', 'content', 'generate', 'auto'] },
  { type: 'ai-assistant', label: 'AI Assistant', icon: 'Bot', category: 'ai', description: 'Conversational AI helper', keywords: ['ai', 'assistant', 'chat', 'help'] },
  
  // Custom Components
  { type: 'custom', label: 'Custom Component', icon: 'Code', category: 'custom', description: 'Developer-created custom field', keywords: ['custom', 'code', 'developer', 'html'] },
];

// AI Integration Constants
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GEMINI: 'gemini',
  CUSTOM: 'custom'
} as const;

export const AI_FEATURES = {
  FIELD_SUGGESTIONS: 'field_suggestions',
  CONTENT_GENERATION: 'content_generation',
  SMART_VALIDATION: 'smart_validation',
  FORM_OPTIMIZATION: 'form_optimization',
  ACCESSIBILITY_CHECK: 'accessibility_check',
  UX_ANALYSIS: 'ux_analysis'
} as const;

// Platform Export Options
export const PLATFORM_EXPORTS = [
  {
    id: 'sharepoint-spfx',
    name: 'SharePoint SPFx',
    description: 'Export as SharePoint Framework web part',
    icon: Building,
    category: 'enterprise',
    supportedFeatures: ['Basic fields', 'Validation', 'Responsive design', 'SharePoint integration'],
    preview: '/previews/sharepoint-spfx.png',
    documentation: 'https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/overview'
  },
  {
    id: 'sharepoint-direct',
    name: 'SharePoint Direct Upload',
    description: 'Upload form directly to SharePoint Lists/Libraries',
    icon: Building,
    category: 'enterprise',
    supportedFeatures: ['Direct upload', 'SharePoint Lists', 'Form validation', 'One-click deployment'],
    preview: '/previews/sharepoint-direct.png',
    documentation: 'https://docs.microsoft.com/en-us/graph/api/resources/sharepoint'
  },
  {
    id: 'react',
    name: 'React Component',
    description: 'Export as reusable React component',
    icon: '⚛️',
    category: 'framework' as const,
    supportedFeatures: ['All field types', 'Custom styling', 'TypeScript', 'Hooks integration'],
    preview: '/previews/react.png',
    documentation: 'https://reactjs.org/docs/components-and-props.html'
  },
  {
    id: 'vue',
    name: 'Vue Component',
    description: 'Export as Vue.js component',
    icon: '💚',
    category: 'framework' as const,
    supportedFeatures: ['All field types', 'Vue 3 Composition API', 'TypeScript', 'Custom styling'],
    preview: '/previews/vue.png',
    documentation: 'https://vuejs.org/guide/introduction.html'
  },
  {
    id: 'angular',
    name: 'Angular Component',
    description: 'Export as Angular component',
    icon: '🅰️',
    category: 'framework' as const,
    supportedFeatures: ['All field types', 'Reactive forms', 'TypeScript', 'Material design'],
    preview: '/previews/angular.png',
    documentation: 'https://angular.io/guide/forms-overview'
  },
  {
    id: 'wordpress',
    name: 'WordPress Plugin',
    description: 'Export as WordPress plugin',
    icon: '📝',
    category: 'cms' as const,
    supportedFeatures: ['Basic fields', 'WordPress integration', 'Admin panel', 'Database storage'],
    preview: '/previews/wordpress.png',
    documentation: 'https://developer.wordpress.org/plugins/'
  },
  {
    id: 'drupal',
    name: 'Drupal Module',
    description: 'Export as Drupal module',
    icon: '🌐',
    category: 'cms' as const,
    supportedFeatures: ['Basic fields', 'Drupal integration', 'Content types', 'Views integration'],
    preview: '/previews/drupal.png',
    documentation: 'https://www.drupal.org/docs/develop'
  },
  {
    id: 'salesforce',
    name: 'Salesforce Lightning',
    description: 'Export as Salesforce Lightning component',
    icon: '☁️',
    category: 'enterprise' as const,
    supportedFeatures: ['Basic fields', 'Salesforce integration', 'Apex controllers', 'Lightning design'],
    preview: '/previews/salesforce.png',
    documentation: 'https://developer.salesforce.com/docs/component-library/overview/components'
  },
  {
    id: 'html-css-js',
    name: 'HTML/CSS/JS',
    description: 'Export as standalone HTML form',
    icon: '🌐',
    category: 'framework' as const,
    supportedFeatures: ['All field types', 'Custom styling', 'No dependencies', 'Easy deployment'],
    preview: '/previews/html.png',
    documentation: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
  },
  {
    id: 'flutter',
    name: 'Flutter Widget',
    description: 'Export as Flutter form widget',
    icon: '📱',
    category: 'framework' as const,
    supportedFeatures: ['Basic fields', 'Material design', 'Cross-platform', 'State management'],
    preview: '/previews/flutter.png',
    documentation: 'https://flutter.dev/docs/development/ui/widgets'
  },
  {
    id: 'react-native',
    name: 'React Native',
    description: 'Export as React Native component',
    icon: '📱',
    category: 'framework' as const,
    supportedFeatures: ['Basic fields', 'Native components', 'Cross-platform', 'Expo compatible'],
    preview: '/previews/react-native.png',
    documentation: 'https://reactnative.dev/docs/components-and-apis'
  }
] as const;

export const DEV_MODE_THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  HIGH_CONTRAST: 'high-contrast',
  CUSTOM: 'custom'
} as const;

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