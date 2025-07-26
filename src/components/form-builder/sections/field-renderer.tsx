'use client';

import { useEffect, useRef } from 'react';
import { FormField, CustomFieldType } from '../types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  ChevronDown, 
  Target, 
  CreditCard, 
  Copy, 
  Plus, 
  PenTool 
} from 'lucide-react';

// Custom Component Renderer with JavaScript execution
interface CustomComponentRendererProps {
  html: string;
  css: string;
  javascript: string;
  fieldId: string;
  fieldData: FormField;
  formValues: Record<string, any>;
  onValueChange?: (fieldId: string, value: any) => void;
}

function CustomComponentRenderer({
  html,
  css,
  javascript,
  fieldId,
  fieldData,
  formValues,
  onValueChange
}: CustomComponentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    try {
      // Clear previous content
      container.innerHTML = html;

      // Create a safe evaluation context
      const safeContext = {
        element: container,
        fieldData,
        formValues,
        onValueChange,
        console: console, // Allow console for debugging
        document: {
          querySelector: container.querySelector.bind(container),
          querySelectorAll: container.querySelectorAll.bind(container),
          addEventListener: container.addEventListener.bind(container),
          removeEventListener: container.removeEventListener.bind(container)
        }
      };

      // Execute JavaScript in a controlled way
      if (javascript && javascript.trim()) {
        const safeJS = `
          (function(element, fieldData, formValues, onValueChange, console, document) {
            ${javascript}
            
            // Auto-initialize if initCustomField function exists
            if (typeof initCustomField === 'function') {
              initCustomField(element, fieldData);
            }
          })(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        `;
        
        const func = new Function(safeJS);
        func(
          safeContext.element,
          safeContext.fieldData,
          safeContext.formValues,
          safeContext.onValueChange,
          safeContext.console,
          safeContext.document
        );
      }

      // Add event listeners for form inputs within the custom component
      const inputs = container.querySelectorAll('input, select, textarea');
      inputs.forEach((input) => {
        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          onValueChange?.(fieldId, target.value);
        });
        
        input.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          onValueChange?.(fieldId, target.value);
        });
      });

    } catch (error) {
      console.error('Error executing custom component JavaScript:', error);
      container.innerHTML = `<div style="color: red; padding: 8px; border: 1px solid red; border-radius: 4px;">
        Error in custom component: ${(error as Error).message}
      </div>`;
    }
  }, [html, javascript, fieldId, fieldData, formValues, onValueChange]);

  return (
    <div 
      ref={containerRef}
      className="custom-component-container"
      style={{ width: '100%' }}
    />
  );
}

interface FieldRendererProps {
  field: FormField;
  isPreview?: boolean;
  formValues?: Record<string, any>;
  onValueChange?: (fieldId: string, value: any) => void;
  customFieldTypes?: CustomFieldType[];
}

export function FieldRenderer({ field, isPreview = false, formValues = {}, onValueChange, customFieldTypes = [] }: FieldRendererProps) {
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
          value={formValues[field.id] || ''}
          onChange={(e) => onValueChange?.(field.id, e.target.value)}
          className={baseInputClass}
          disabled={!isPreview}
        />
      );
    
    case 'textarea':
      return (
        <textarea
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          required={field.required}
          value={formValues[field.id] || ''}
          onChange={(e) => onValueChange?.(field.id, e.target.value)}
          className={`${baseInputClass} min-h-[120px] resize-vertical`}
          disabled={!isPreview}
        />
      );
    
    case 'select':
      return (
        <Select 
          disabled={!isPreview}
          value={formValues[field.id] || ''}
          onValueChange={(value) => onValueChange?.(field.id, value)}
        >
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
      const checkboxValues = formValues[field.id] || [];
      return (
        <div className="space-y-3">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`${field.id}_${index}`}
                checked={checkboxValues.includes(option)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...checkboxValues, option]
                    : checkboxValues.filter((v: string) => v !== option);
                  onValueChange?.(field.id, newValues);
                }}
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
                value={option}
                checked={formValues[field.id] === option}
                onChange={(e) => onValueChange?.(field.id, e.target.value)}
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
    
    case 'time':
      return (
        <Input
          type="time"
          required={field.required}
          className={baseInputClass}
          disabled={!isPreview}
        />
      );
    
    case 'datetime':
      return (
        <Input
          type="datetime-local"
          required={field.required}
          className={baseInputClass}
          disabled={!isPreview}
        />
      );
    
    case 'file':
      return (
        <div className="space-y-2">
          <Input
            type="file"
            required={field.required}
            className={baseInputClass}
            disabled={!isPreview}
            multiple={field.fileSettings?.maxFiles ? field.fileSettings.maxFiles > 1 : false}
          />
          {field.fileSettings && (
            <div className="text-xs text-muted-foreground">
              Max size: {field.fileSettings.maxSize}MB, Max files: {field.fileSettings.maxFiles}
            </div>
          )}
        </div>
      );
    
    case 'color':
      return (
        <div className="flex items-center space-x-3">
          <Input
            type="color"
            className="w-16 h-12 rounded-lg border-2 cursor-pointer"
            disabled={!isPreview}
          />
          <Input
            type="text"
            placeholder="#000000"
            className={`${baseInputClass} flex-1`}
            disabled={!isPreview}
          />
        </div>
      );
    
    case 'slider':
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={field.validation?.min || 0}
            max={field.validation?.max || 100}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={!isPreview}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{field.validation?.min || 0}</span>
            <span>{field.validation?.max || 100}</span>
          </div>
        </div>
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
    
    case 'section':
      return (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              {field.sectionSettings?.icon && (
                <div className="w-6 h-6 flex items-center justify-center">
                  {field.sectionSettings.icon}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg text-foreground">{field.label}</h3>
                {field.sectionSettings?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{field.sectionSettings.description}</p>
                )}
              </div>
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
    
    case 'signature':
      return (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30">
          <PenTool className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">Digital Signature Pad</p>
          <p className="text-xs text-muted-foreground">Click here to sign</p>
          <div className="mt-4 h-24 bg-background border rounded flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Signature area</span>
          </div>
        </div>
      );
    
    case 'location':
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter location or address"
              className={baseInputClass}
              disabled={!isPreview}
            />
            <Button variant="outline" size="sm" disabled={!isPreview}>
              <Target className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-32 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <div className="text-center">
              <Target className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Map will appear here</p>
            </div>
          </div>
        </div>
      );
    
    case 'payment':
      return (
        <div className="space-y-4 p-4 border-2 border-dashed border-green-200 rounded-lg bg-green-50/50">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Payment Processing</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Card Number" disabled={!isPreview} />
            <Input placeholder="MM/YY" disabled={!isPreview} />
            <Input placeholder="Cardholder Name" disabled={!isPreview} />
            <Input placeholder="CVV" disabled={!isPreview} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-bold text-lg">$0.00</span>
          </div>
        </div>
      );
    
    case 'repeating':
      return (
        <div className="space-y-4 p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Copy className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Repeating Section</span>
            </div>
            <Badge variant="secondary">Dynamic</Badge>
          </div>
          <div className="space-y-2">
            <Input placeholder="Item 1" disabled={!isPreview} />
            <Button variant="outline" size="sm" disabled={!isPreview}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      );
    
    case 'custom':
      // Handle custom field types
      const customFieldType = customFieldTypes.find(type => type.id === field.customComponent?.id);
      if (customFieldType) {
        // Process template variables in preview mode
        const processTemplate = (html: string) => {
          if (!isPreview) return html;
          
          let processedHtml = html;
          
          // Escape HTML for safe insertion
          const escapeHtml = (text: string) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
          };
          
          // Replace basic template variables with actual field values
          processedHtml = processedHtml.replace(/\{\{label\}\}/g, escapeHtml(field.label || ''));
          processedHtml = processedHtml.replace(/\{\{placeholder\}\}/g, escapeHtml(field.placeholder || ''));
          processedHtml = processedHtml.replace(/\{\{id\}\}/g, field.id);
          processedHtml = processedHtml.replace(/\{\{type\}\}/g, field.type);
          processedHtml = processedHtml.replace(/\{\{required\}\}/g, field.required ? 'required' : '');
          
          // Handle simple required asterisk
          processedHtml = processedHtml.replace(/\{\{#if required\}\}\*\{\{\/if\}\}/g, field.required ? '*' : '');
          
          // Handle conditional blocks for required fields
          processedHtml = processedHtml.replace(/\{\{#if required\}\}(.*?)\{\{\/if\}\}/gs, (match, content) => {
            return field.required ? content : '';
          });
          
          // Handle conditional blocks for NOT required fields
          processedHtml = processedHtml.replace(/\{\{#unless required\}\}(.*?)\{\{\/unless\}\}/gs, (match, content) => {
            return !field.required ? content : '';
          });
          
          // Handle options for select/radio/checkbox fields
          if (field.options && field.options.length > 0) {
            const optionsHtml = field.options.map(option => 
              `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`
            ).join('');
            processedHtml = processedHtml.replace(/\{\{#each options\}\}(.*?)\{\{\/each\}\}/gs, optionsHtml);
            
            // Replace simple options placeholder
            processedHtml = processedHtml.replace(/\{\{options\}\}/g, optionsHtml);
          } else {
            // Remove options blocks if no options
            processedHtml = processedHtml.replace(/\{\{#each options\}\}(.*?)\{\{\/each\}\}/gs, '');
            processedHtml = processedHtml.replace(/\{\{options\}\}/g, '');
          }
          
          // Handle field width
          processedHtml = processedHtml.replace(/\{\{width\}\}/g, field.width || 'full');
          
          // Clean up any remaining empty template blocks
          processedHtml = processedHtml.replace(/\{\{[^}]*\}\}/g, '');
          
          return processedHtml;
        };

                 // In preview mode, render the field content with JavaScript execution
         if (isPreview) {
           return (
             <div className="custom-field-preview">
               {/* Inject custom CSS if available */}
               {customFieldType.template.css && (
                 <style dangerouslySetInnerHTML={{ __html: customFieldType.template.css }} />
               )}
               <CustomComponentRenderer 
                 html={processTemplate(customFieldType.template.html)}
                 css={customFieldType.template.css}
                 javascript={customFieldType.template.javascript}
                 fieldId={field.id}
                 fieldData={field}
                 formValues={formValues}
                 onValueChange={onValueChange}
               />
             </div>
           );
         }

         // In editor mode, show with wrapper and labels
         return (
           <div className="space-y-2 p-4 border-2 border-dashed border-purple-200 rounded-lg bg-purple-50/50">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                 <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                   Custom Component
                 </Badge>
                 <span className="font-medium text-purple-800">{customFieldType.name}</span>
               </div>
             </div>
             <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
               {customFieldType.description}
             </div>
           </div>
         );
      }
      return (
        <div className="p-4 border-2 border-dashed border-red-200 rounded-lg bg-red-50/50">
          <span className="text-red-600">Custom component not found</span>
        </div>
      );
    
    default:
      return null;
  }
} 