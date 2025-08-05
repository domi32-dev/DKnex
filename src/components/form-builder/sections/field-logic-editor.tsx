'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { FormField, LogicRule, LogicAction } from '../types';

interface FieldLogicEditorProps {
  field: FormField;
  allFields: FormField[];
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onShowNotification: (message: string) => void;
}

export function FieldLogicEditor({ 
  field, 
  allFields, 
  onUpdateField, 
  onShowNotification 
}: FieldLogicEditorProps) {
  const [selectedRule, setSelectedRule] = useState<LogicRule | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createNewRule = useCallback(() => {
    const newRule: LogicRule = {
      id: generateId(),
      name: 'New Rule',
      enabled: true,
      triggerField: '',
      triggerCondition: 'equals',
      triggerValue: '',
      actions: [],
      priority: (field.conditionalLogic?.rules?.length || 0) + 1
    };
    
    const updatedRules = [...(field.conditionalLogic?.rules || []), newRule];
    onUpdateField(field.id, {
      conditionalLogic: {
        enabled: true,
        rules: updatedRules
      }
    });
    setSelectedRule(newRule);
  }, [field, onUpdateField]);

  const updateRule = useCallback((ruleId: string, updates: Partial<LogicRule>) => {
    const updatedRules = field.conditionalLogic?.rules?.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ) || [];
    
    onUpdateField(field.id, {
      conditionalLogic: {
        enabled: field.conditionalLogic?.enabled || false,
        rules: updatedRules
      }
    });
    
    if (selectedRule?.id === ruleId) {
      setSelectedRule(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [field, selectedRule, onUpdateField]);

  const deleteRule = useCallback((ruleId: string) => {
    const updatedRules = field.conditionalLogic?.rules?.filter(rule => rule.id !== ruleId) || [];
    
    onUpdateField(field.id, {
      conditionalLogic: {
        enabled: updatedRules.length > 0,
        rules: updatedRules
      }
    });
    
    if (selectedRule?.id === ruleId) {
      setSelectedRule(null);
    }
    onShowNotification('Logic rule deleted');
  }, [field, selectedRule, onUpdateField, onShowNotification]);

  const addAction = useCallback((ruleId: string) => {
    const newAction: LogicAction = {
      id: generateId(),
      targetField: '',
      action: 'show',
      value: ''
    };
    
    const rule = field.conditionalLogic?.rules?.find(r => r.id === ruleId);
    if (rule) {
      const updatedActions = [...rule.actions, newAction];
      updateRule(ruleId, { actions: updatedActions });
    }
  }, [field, updateRule]);

  const updateAction = useCallback((ruleId: string, actionId: string, updates: Partial<LogicAction>) => {
    const rule = field.conditionalLogic?.rules?.find(r => r.id === ruleId);
    if (rule) {
      const updatedActions = rule.actions.map(action =>
        action.id === actionId ? { ...action, ...updates } : action
      );
      updateRule(ruleId, { actions: updatedActions });
    }
  }, [field, updateRule]);

  const deleteAction = useCallback((ruleId: string, actionId: string) => {
    const rule = field.conditionalLogic?.rules?.find(r => r.id === ruleId);
    if (rule) {
      const updatedActions = rule.actions.filter(action => action.id !== actionId);
      updateRule(ruleId, { actions: updatedActions });
    }
  }, [field, updateRule]);

  const getFieldOptions = useCallback(() => {
    return allFields
      .filter(f => f.id !== field.id) // Exclude current field
      .map(f => ({
        value: f.id,
        label: f.label || f.type
      }));
  }, [allFields, field.id]);

  const getConditionOptions = () => [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does not contain' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' }
  ];

  const getActionOptions = () => [
    { value: 'show', label: 'Show field', icon: Eye },
    { value: 'hide', label: 'Hide field', icon: EyeOff },
    { value: 'enable', label: 'Enable field' },
    { value: 'disable', label: 'Disable field' },
    { value: 'set_value', label: 'Set value' },
    { value: 'set_required', label: 'Make required' },
    { value: 'set_optional', label: 'Make optional' }
  ];

  const getTriggerField = (fieldId: string) => {
    return allFields.find(f => f.id === fieldId);
  };

  const rules = field.conditionalLogic?.rules || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Conditional Logic</h3>
          <Badge variant="outline" className="text-xs">
            {rules.length} rules
          </Badge>
        </div>
        <Switch
          checked={field.conditionalLogic?.enabled || false}
          onCheckedChange={(checked) => {
            onUpdateField(field.id, {
              conditionalLogic: {
                enabled: checked,
                rules: checked ? rules : []
              }
            });
          }}
        />
      </div>

      {field.conditionalLogic?.enabled && (
        <div className="space-y-4">
          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <Card 
                key={rule.id} 
                className={`cursor-pointer transition-all ${
                  selectedRule?.id === rule.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedRule(rule)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked) => updateRule(rule.id, { enabled: checked })}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{rule.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {rule.actions.length} actions
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getTriggerField(rule.triggerField)?.label || 'Select field'} {rule.triggerCondition} &quot;{rule.triggerValue}&quot;
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRule(rule.id);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Rule */}
          <Button 
            onClick={createNewRule}
            variant="outline"
            size="sm"
            className="w-full border-dashed"
          >
            <Plus className="w-3 h-3 mr-2" />
            Add Logic Rule
          </Button>

          {/* Rule Editor */}
          {selectedRule && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Edit Rule</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRule(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rule Name */}
                <div className="space-y-2">
                  <Label htmlFor="rule-name" className="text-xs">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={selectedRule.name}
                    onChange={(e) => updateRule(selectedRule.id, { name: e.target.value })}
                    placeholder="Enter rule name"
                    className="h-8 text-sm"
                  />
                </div>

                {/* Trigger Field */}
                <div className="space-y-2">
                  <Label className="text-xs">When this field</Label>
                  <Select
                    value={selectedRule.triggerField}
                    onValueChange={(value) => updateRule(selectedRule.id, { triggerField: value })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select a field" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFieldOptions().map((fieldOption) => (
                        <SelectItem key={fieldOption.value} value={fieldOption.value}>
                          {fieldOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trigger Condition */}
                <div className="space-y-2">
                  <Label className="text-xs">Condition</Label>
                  <Select
                    value={selectedRule.triggerCondition}
                    onValueChange={(value: LogicRule['triggerCondition']) => updateRule(selectedRule.id, { triggerCondition: value })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getConditionOptions().map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trigger Value */}
                {!['is_empty', 'is_not_empty'].includes(selectedRule.triggerCondition) && (
                  <div className="space-y-2">
                    <Label className="text-xs">Value</Label>
                    <Input
                      value={selectedRule.triggerValue}
                      onChange={(e) => updateRule(selectedRule.id, { triggerValue: e.target.value })}
                      placeholder="Enter value"
                      className="h-8 text-sm"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Then do this</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAction(selectedRule.id)}
                      className="h-6 text-xs"
                    >
                      <Plus className="w-2 h-2 mr-1" />
                      Add Action
                    </Button>
                  </div>

                  <ScrollArea className="max-h-32">
                    <div className="space-y-2">
                      {selectedRule.actions.map((action) => (
                        <div key={action.id} className="p-2 border rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Select
                              value={action.targetField}
                              onValueChange={(value) => updateAction(selectedRule.id, action.id, { targetField: value })}
                            >
                              <SelectTrigger className="w-24 h-6 text-xs">
                                <SelectValue placeholder="Field" />
                              </SelectTrigger>
                              <SelectContent>
                                {getFieldOptions().map((fieldOption) => (
                                  <SelectItem key={fieldOption.value} value={fieldOption.value}>
                                    {fieldOption.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={action.action}
                              onValueChange={(value: LogicAction['action']) => updateAction(selectedRule.id, action.id, { action: value })}
                            >
                              <SelectTrigger className="w-24 h-6 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getActionOptions().map((actionOption) => (
                                  <SelectItem key={actionOption.value} value={actionOption.value}>
                                    {actionOption.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {action.action === 'set_value' && (
                              <Input
                                value={action.value || ''}
                                onChange={(e) => updateAction(selectedRule.id, action.id, { value: e.target.value })}
                                placeholder="Value"
                                className="flex-1 h-6 text-xs"
                              />
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAction(selectedRule.id, action.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-2 h-2" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 