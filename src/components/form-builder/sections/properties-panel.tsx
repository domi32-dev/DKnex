'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  X, 
  Plus, 
  Trash2, 
  GitBranch, 
  MousePointer 
} from 'lucide-react';
import { FormField } from '../types';


interface PropertiesPanelProps {
  selectedField: FormField | null;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
  onDuplicateField: (fieldId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function PropertiesPanel({ 
  selectedField, 
  onUpdateField, 
  onDeleteField, 
  onDuplicateField, 
  onClose, 
  isOpen 
}: PropertiesPanelProps) {
  const updateField = (updates: Partial<FormField>) => {
    if (selectedField) {
      onUpdateField(selectedField.id, updates);
    }
  };

  const renderFieldEditor = () => {
    if (!selectedField) return null;

    return (
      <div className="space-y-6">
        {/* Field Basic Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Basic Settings</h4>
            <Badge variant="outline" className="text-xs">
              {selectedField.type}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="field-label" className="text-xs font-medium">Field Label</Label>
              <Input
                id="field-label"
                value={selectedField.label}
                onChange={(e) => updateField({ label: e.target.value })}
                className="focus:ring-primary/20"
              />
            </div>

            {['text', 'email', 'number', 'phone', 'url', 'textarea'].includes(selectedField.type) && (
              <div className="space-y-1">
                <Label htmlFor="field-placeholder" className="text-xs font-medium">Placeholder Text</Label>
                <Input
                  id="field-placeholder"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => updateField({ placeholder: e.target.value })}
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
                  onCheckedChange={(checked) => updateField({ required: checked })}
                />
              </div>
            )}

            {/* Field Width Control */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Field Width</Label>
              <Select
                value={selectedField.width || 'full'}
                onValueChange={(value) => updateField({ width: value as 'full' | 'half' | 'third' | 'quarter' })}
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
            </div>
          </div>
        </div>

        {/* Field-specific settings */}
        {['select', 'checkbox', 'radio'].includes(selectedField.type) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Options</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                  updateField({ options: newOptions });
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {selectedField.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(selectedField.options || [])];
                      newOptions[index] = e.target.value;
                      updateField({ options: newOptions });
                    }}
                    className="flex-1 focus:ring-primary/20"
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = selectedField.options?.filter((_, i) => i !== index);
                      updateField({ options: newOptions });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditional Logic */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Conditional Logic</h4>
            <Switch
              checked={selectedField.conditionalLogic?.enabled ?? false}
              onCheckedChange={(checked) => updateField({
                conditionalLogic: {
                  enabled: checked,
                  rules: selectedField.conditionalLogic?.rules || []
                }
              })}
            />
          </div>
          
          {selectedField.conditionalLogic?.enabled && (
            <div className="p-3 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {selectedField.conditionalLogic.rules?.length || 0} rule(s) configured
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // This function is not provided in the new_code, so it's commented out.
                    // onOpenFieldLogicEditor(selectedField); 
                  }}
                >
                  <GitBranch className="w-4 h-4 mr-1" />
                  Edit Rules
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Settings */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Advanced Settings</h4>
          
          {/* Validation Rules */}
          {['text', 'email', 'number', 'textarea', 'phone', 'url'].includes(selectedField.type) && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Validation</Label>
              <div className="grid grid-cols-2 gap-2">
                {['text', 'textarea'].includes(selectedField.type) && (
                  <>
                    <Input
                      type="number"
                      placeholder="Min length"
                      value={selectedField.validation?.minLength || ''}
                      onChange={(e) => updateField({
                        validation: {
                          ...selectedField.validation,
                          minLength: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Max length"
                      value={selectedField.validation?.maxLength || ''}
                      onChange={(e) => updateField({
                        validation: {
                          ...selectedField.validation,
                          maxLength: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                    />
                  </>
                )}
                
                {selectedField.type === 'number' && (
                  <>
                    <Input
                      type="number"
                      placeholder="Min value"
                      value={selectedField.validation?.min || ''}
                      onChange={(e) => updateField({
                        validation: {
                          ...selectedField.validation,
                          min: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Max value"
                      value={selectedField.validation?.max || ''}
                      onChange={(e) => updateField({
                        validation: {
                          ...selectedField.validation,
                          max: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Custom CSS */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Custom CSS Classes</Label>
            <Input
              value={selectedField.style?.customCSS || ''}
              onChange={(e) => updateField({
                style: {
                  ...selectedField.style,
                  customCSS: e.target.value
                }
              })}
              placeholder="custom-class another-class"
              className="font-mono text-sm"
            />
          </div>
        </div>


      </div>
    );
  };

  return (
    <div className={`w-80 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-l border-slate-200 dark:border-slate-700 overflow-y-auto transition-all duration-300 ${
      selectedField ? 'block' : 'hidden lg:block'
    }`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            {selectedField ? 'Field Properties' : 'Properties'}
          </h3>
          {selectedField && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {selectedField ? renderFieldEditor() : (
          <div className="text-center py-8">
            <MousePointer className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Select a field to edit its properties
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Double-click field labels to edit inline
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 