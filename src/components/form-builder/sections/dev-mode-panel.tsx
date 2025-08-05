'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Code, 
  Play, 
  Save, 
  FileCode,
  Palette,
  Zap,
  Eye,
  EyeOff,
  Terminal,
  AlertTriangle,
  Download,
  Upload,
  Trash2,
  Package,
  Wand2,
  Sparkles
} from 'lucide-react';
import { CustomFieldType, DevModeSettings } from '../types';

interface DevModePanelProps {
  showDevMode: boolean;
  onAddCustomFieldType: (customField: CustomFieldType) => void;
  onCloseDevMode: () => void;
  customFieldTypes: CustomFieldType[];
  editingComponentId?: string | null;
}

const DEFAULT_HTML = `<div class="custom-field">
  <label for="{{fieldId}}" class="field-label">
    {{label}}
    {{#if required}}<span class="required">*</span>{{/if}}
  </label>
  <input 
    id="{{fieldId}}" 
    name="{{fieldId}}" 
    type="text" 
    placeholder="{{placeholder}}"
    class="field-input"
    {{#if required}}required{{/if}}
  />
</div>`;

const DEFAULT_CSS = `.custom-field {
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.required {
  color: #ef4444;
}

.field-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-input:invalid {
  border-color: #ef4444;
}`;

const DEFAULT_JS = `// Custom field initialization
function initCustomField(element, fieldData) {
  const input = element.querySelector('.field-input');
  
  // Add custom validation
  input.addEventListener('blur', function() {
    validateField(this, fieldData.validation);
  });
  
  // Add custom interactions
  input.addEventListener('input', function() {
    // Custom input handling
    console.log('Input changed:', this.value);
    
    // Trigger custom events
    element.dispatchEvent(new CustomEvent('fieldChange', {
      detail: { value: this.value, fieldId: fieldData.id }
    }));
  });
}

function validateField(input, validation) {
  // Custom validation logic
  if (validation && validation.customRule) {
    try {
      // Safe evaluation of custom validation
      const isValid = new Function('value', 'return ' + validation.customRule)(input.value);
      input.setCustomValidity(isValid ? '' : (validation.customMessage || 'Custom validation failed'));
    } catch (error) {
      console.error('Validation error:', error);
      input.setCustomValidity('Validation rule error');
    }
  }
}

// Export for form builder
window.customFieldHandlers = window.customFieldHandlers || {};
window.customFieldHandlers.init = initCustomField;`;

export function DevModePanel({
  showDevMode,
  onAddCustomFieldType,
  onCloseDevMode,
  customFieldTypes,
  editingComponentId
}: DevModePanelProps) {
  const [activeTab, setActiveTab] = useState('info');
  
  // Find the component to edit
  const editingComponent = editingComponentId 
    ? customFieldTypes.find(comp => comp.id === editingComponentId)
    : null;
  
  const [componentInfo, setComponentInfo] = useState({
    name: editingComponent?.name || 'My Custom Component',
    description: editingComponent?.description || 'A custom form component',
    category: editingComponent?.category || 'custom',
    version: editingComponent?.version || '1.0.0'
  });
  const [htmlCode, setHtmlCode] = useState(editingComponent?.template.html || DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(editingComponent?.template.css || DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(editingComponent?.template.javascript || DEFAULT_JS);
  const [isEditing, setIsEditing] = useState(!!editingComponentId);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [settings, setSettings] = useState<DevModeSettings>({
    enabled: true,
    codeEditor: {
      theme: 'dark',
      fontSize: 14,
      wordWrap: true,
      minimap: false
    },
    sandbox: {
      allowNetworkRequests: false,
      allowLocalStorage: true,
      allowedDomains: [],
      maxExecutionTime: 5000
    },
    debugging: {
      enableConsole: true,
      enableInspector: false,
      logLevel: 'info'
    }
  });

  const previewRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = useCallback(() => {
    if (!previewRef.current) return;

    const previewDoc = previewRef.current.contentDocument;
    if (!previewDoc) return;

    try {
      const combinedHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                padding: 1rem; 
                margin: 0; 
                background: #f8fafc;
              }
              ${cssCode}
            </style>
          </head>
          <body>
            ${htmlCode.replace(/\{\{(\w+)\}\}/g, (match, key) => {
              const replacements: Record<string, string> = {
                fieldId: 'preview-field',
                label: 'Preview Field',
                placeholder: 'Enter value...',
                required: 'true'
              };
              return replacements[key] || match;
            })}
            <script>
              ${jsCode}
              
              // Override console for debugging
              const originalConsole = console;
              console.log = function(...args) {
                parent.postMessage({
                  type: 'console',
                  level: 'log',
                  message: args.join(' ')
                }, '*');
                originalConsole.log(...args);
              };
              
              console.error = function(...args) {
                parent.postMessage({
                  type: 'console',
                  level: 'error',
                  message: args.join(' ')
                }, '*');
                originalConsole.error(...args);
              };

              // Initialize the custom field
              document.addEventListener('DOMContentLoaded', function() {
                const element = document.querySelector('.custom-field');
                if (element && window.customFieldHandlers && window.customFieldHandlers.init) {
                  window.customFieldHandlers.init(element, {
                    id: 'preview-field',
                    label: 'Preview Field',
                    required: true,
                    validation: {}
                  });
                }
              });
            </script>
          </body>
        </html>
      `;

      previewDoc.open();
      previewDoc.write(combinedHTML);
      previewDoc.close();

      setErrors([]);
    } catch (error) {
      setErrors([`Preview Error: ${(error as Error).message}`]);
    }
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode, jsCode, updatePreview]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleOutput(prev => [...prev.slice(-19), `[${event.data.level}] ${event.data.message}`]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const saveCustomComponent = () => {
    if (!componentInfo.name.trim()) {
      setErrors(['Component name is required']);
      return;
    }

    const componentData: CustomFieldType = {
      id: editingComponentId || `custom-${Date.now()}`,
      name: componentInfo.name.trim(),
      description: componentInfo.description.trim(),
      category: componentInfo.category,
      icon: <Code className="w-4 h-4" />,
      template: {
        html: htmlCode,
        css: cssCode,
        javascript: jsCode,
        props: []
      },
      preview: 'Custom component preview',
      author: 'Developer',
      version: componentInfo.version,
      dependencies: []
    };

    onAddCustomFieldType(componentData);
    
    // Reset form
    setComponentInfo({
      name: 'My Custom Component',
      description: 'A custom form component',
      category: 'custom',
      version: '1.0.0'
    });
    setHtmlCode(DEFAULT_HTML);
    setCssCode(DEFAULT_CSS);
    setJsCode(DEFAULT_JS);
    setConsoleOutput([]);
    setErrors([]);
    setIsEditing(false);
    
    // Close dev mode
    onCloseDevMode();
  };

  const exportComponent = () => {
    const component = {
      ...componentInfo,
      template: {
        html: htmlCode,
        css: cssCode,
        javascript: jsCode
      },
      settings: settings,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(component, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentInfo.name.replace(/\s+/g, '_').toLowerCase()}_component.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importComponent = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const component = JSON.parse(e.target?.result as string);
            setComponentInfo({
              name: component.name || 'Imported Component',
              description: component.description || 'Imported custom component',
              category: component.category || 'custom',
              version: component.version || '1.0.0'
            });
            setHtmlCode(component.template?.html || DEFAULT_HTML);
            setCssCode(component.template?.css || DEFAULT_CSS);
            setJsCode(component.template?.javascript || DEFAULT_JS);
            if (component.settings) {
              setSettings(component.settings);
            }
                      } catch (error) {
              setErrors([`Import Error: ${(error as Error).message}`]);
            }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (!showDevMode) return null;

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 bg-black/50 z-[50] flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl h-[90vh] bg-gradient-to-br from-white/98 to-blue-50/98 dark:from-gray-900/98 dark:to-blue-950/98 backdrop-blur-xl border-2 border-blue-300/60 dark:border-blue-700/60 shadow-2xl">
        <CardHeader className="pt-6 pb-4 px-6 border-b-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/80 dark:to-cyan-950/80 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              Component Studio
              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300 font-semibold">
                Dev Mode
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPreviewVisible(!previewVisible)}
                className="hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                {previewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCloseDevMode}
                className="hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 text-gray-500"
              >
                ✕
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground font-medium">
            Create custom form components that will be available in your form builder
          </p>
        </CardHeader>
        
        <CardContent className="p-0 h-[calc(90vh-100px)]">
          <div className="flex h-full">
            {/* Component Builder */}
            <div className="flex-1 flex flex-col">
                             <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                 <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <TabsList className="grid grid-cols-5 w-80">
                    <TabsTrigger value="info" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Info
                    </TabsTrigger>
                    <TabsTrigger value="html" className="text-xs">
                      <FileCode className="w-3 h-3 mr-1" />
                      HTML
                    </TabsTrigger>
                    <TabsTrigger value="css" className="text-xs">
                      <Palette className="w-3 h-3 mr-1" />
                      CSS
                    </TabsTrigger>
                    <TabsTrigger value="js" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      JS
                    </TabsTrigger>
                    <TabsTrigger value="console" className="text-xs">
                      <Terminal className="w-3 h-3 mr-1" />
                      Console
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={updatePreview}>
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={exportComponent}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={importComponent}>
                      <Upload className="w-4 h-4" />
                    </Button>
                                         <Button 
                       onClick={saveCustomComponent}
                       className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                     >
                       <Save className="w-4 h-4 mr-2" />
                       {isEditing ? 'Update Component' : 'Save Component'}
                     </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="info" className="mt-0 h-full p-4">
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="component-name">Component Name</Label>
                        <Input
                          id="component-name"
                          value={componentInfo.name}
                          onChange={(e) => setComponentInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter component name"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="component-description">Description</Label>
                        <Textarea
                          id="component-description"
                          value={componentInfo.description}
                          onChange={(e) => setComponentInfo(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this component does"
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="component-category">Category</Label>
                        <Select
                          value={componentInfo.category}
                          onValueChange={(value) => setComponentInfo(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="custom">Custom Components</SelectItem>
                            <SelectItem value="input">Input Fields</SelectItem>
                            <SelectItem value="choice">Choice Fields</SelectItem>
                            <SelectItem value="layout">Layout & Display</SelectItem>
                            <SelectItem value="advanced">Advanced Fields</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="component-version">Version</Label>
                        <Input
                          id="component-version"
                          value={componentInfo.version}
                          onChange={(e) => setComponentInfo(prev => ({ ...prev, version: e.target.value }))}
                          placeholder="1.0.0"
                          className="mt-1"
                        />
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Wand2 className="w-4 h-4" />
                          Template Variables
                        </h4>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <p><code>{'{{fieldId}}'}</code> - Unique field identifier</p>
                          <p><code>{'{{label}}'}</code> - Field label text</p>
                          <p><code>{'{{placeholder}}'}</code> - Placeholder text</p>
                          <p><code>{'{{required}}'}</code> - Required field status</p>
                          <p><code>{'{{options}}'}</code> - Field options array</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="html" className="mt-0 h-full">
                    <Textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      className="h-full resize-none font-mono text-sm border-0 rounded-none focus:ring-0"
                      placeholder="Enter your HTML markup here..."
                    />
                  </TabsContent>

                  <TabsContent value="css" className="mt-0 h-full">
                    <Textarea
                      value={cssCode}
                      onChange={(e) => setCssCode(e.target.value)}
                      className="h-full resize-none font-mono text-sm border-0 rounded-none focus:ring-0"
                      placeholder="Enter your CSS styles here..."
                    />
                  </TabsContent>

                  <TabsContent value="js" className="mt-0 h-full">
                    <Textarea
                      value={jsCode}
                      onChange={(e) => setJsCode(e.target.value)}
                      className="h-full resize-none font-mono text-sm border-0 rounded-none focus:ring-0"
                      placeholder="Enter your JavaScript code here..."
                    />
                  </TabsContent>

                  <TabsContent value="console" className="mt-0 h-full">
                    <div className="h-full p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Console Output</h3>
                        <Button variant="ghost" size="sm" onClick={() => setConsoleOutput([])}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {errors.length > 0 && (
                        <div className="mb-4">
                          {errors.map((error, index) => (
                            <div key={index} className="flex items-center gap-2 text-red-600 text-sm mb-1">
                              <AlertTriangle className="w-4 h-4" />
                              {error}
                            </div>
                          ))}
                        </div>
                      )}

                      <ScrollArea className="h-64 bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                        {consoleOutput.length === 0 ? (
                          <div className="text-gray-500">Console output will appear here...</div>
                        ) : (
                          consoleOutput.map((output, index) => (
                            <div key={index} className="mb-1">{output}</div>
                          ))
                        )}
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

                         {/* Live Preview */}
             {previewVisible && (
               <div className="w-96 border-l-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                   <h3 className="font-semibold mb-2 flex items-center gap-2">
                     <Eye className="w-4 h-4 text-blue-500" />
                     Live Preview
                   </h3>
                   <p className="text-sm text-muted-foreground">
                     See how your component will look in forms
                   </p>
                 </div>
                
                <div className="h-[calc(100%-80px)]">
                  <iframe
                    ref={previewRef}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                    title="Component Preview"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 