'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  GitBranch, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Workflow, 
  Database, 
  Mail, 
  ExternalLink,
  MessageSquare,
  Webhook
} from 'lucide-react';
import { FormField, LogicRule, FormLogic, FormLogicAction } from '../types';

interface LogicRulesPanelProps {
  fields: FormField[];
  onClose: () => void;
  onShowNotification: (message: string) => void;
  onUpdateField?: (fieldId: string, updates: Partial<FormField>) => void;
}

export function LogicRulesPanel({ 
  fields, 
  onClose,
  onShowNotification,
  onUpdateField
}: LogicRulesPanelProps) {
  const [formLogic, setFormLogic] = useState<FormLogic[]>([]);
  const [selectedFormLogic, setSelectedFormLogic] = useState<FormLogic | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Get all field rules across all fields
  const getAllFieldRules = useCallback(() => {
    const allRules: { field: FormField; rule: LogicRule }[] = [];
    fields.forEach(field => {
      if (field.conditionalLogic?.enabled && field.conditionalLogic.rules) {
        field.conditionalLogic.rules.forEach(rule => {
          allRules.push({ field, rule });
        });
      }
    });
    return allRules;
  }, [fields]);

  const createNewFormLogic = useCallback(() => {
    const newFormLogic: FormLogic = {
      id: generateId(),
      name: 'New Workflow',
      type: 'save_workflow',
      enabled: true,
      conditions: [],
      actions: [],
      priority: formLogic.length + 1
    };
    setFormLogic(prev => [...prev, newFormLogic]);
    setSelectedFormLogic(newFormLogic);
  }, [formLogic.length]);

  const updateFormLogic = useCallback((logicId: string, updates: Partial<FormLogic>) => {
    setFormLogic(prev => prev.map(logic => 
      logic.id === logicId ? { ...logic, ...updates } : logic
    ));
    if (selectedFormLogic?.id === logicId) {
      setSelectedFormLogic(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedFormLogic]);

  const deleteFormLogic = useCallback((logicId: string) => {
    setFormLogic(prev => prev.filter(logic => logic.id !== logicId));
    if (selectedFormLogic?.id === logicId) {
      setSelectedFormLogic(null);
    }
    onShowNotification('Form logic deleted');
  }, [selectedFormLogic, onShowNotification]);

  const addFormLogicAction = useCallback((logicId: string) => {
    const newAction: FormLogicAction = {
      id: generateId(),
      type: 'save_data',
      config: {}
    };
    updateFormLogic(logicId, {
      actions: [...(formLogic.find(l => l.id === logicId)?.actions || []), newAction]
    });
  }, [formLogic, updateFormLogic]);

  const getFormLogicTypeOptions = () => [
    { value: 'save_workflow', label: 'Save Workflow', icon: Database },
    { value: 'validation_workflow', label: 'Validation Workflow', icon: AlertTriangle },
    { value: 'notification_workflow', label: 'Notification Workflow', icon: Mail },
    { value: 'redirect_workflow', label: 'Redirect Workflow', icon: ExternalLink }
  ];

  const getFormLogicActionOptions = () => [
    { value: 'save_data', label: 'Save Data', icon: Database },
    { value: 'send_email', label: 'Send Email', icon: Mail },
    { value: 'redirect', label: 'Redirect', icon: ExternalLink },
    { value: 'show_message', label: 'Show Message', icon: MessageSquare },
    { value: 'trigger_webhook', label: 'Trigger Webhook', icon: Webhook }
  ];

  const getActionIcon = (type: string) => {
    const action = getFormLogicActionOptions().find(a => a.value === type);
    return action?.icon || Settings;
  };

  const getFormLogicTypeIcon = (type: string) => {
    const logicType = getFormLogicTypeOptions().find(t => t.value === type);
    return logicType?.icon || Workflow;
  };

  const allFieldRules = getAllFieldRules();

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-5xl max-h-[85vh] mx-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Form Logic Rules
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage conditional logic and workflows for your form
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="text-xs">Overview ({allFieldRules.length + formLogic.length})</TabsTrigger>
              <TabsTrigger value="field-rules" className="text-xs">Field Rules ({allFieldRules.length})</TabsTrigger>
              <TabsTrigger value="form-logic" className="text-xs">Form Logic ({formLogic.length})</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Logic Summary
                  </CardTitle>
                  <CardDescription>Overview of all logic rules and workflows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Field Rules Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Field Rules</span>
                      <Badge variant="outline">{allFieldRules.length}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Conditional logic rules applied to individual fields
                    </p>
                  </div>

                  {/* Form Logic Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Form Workflows</span>
                      <Badge variant="outline">{formLogic.length}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Complex workflows that trigger on form submission
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Field Rules Tab */}
            <TabsContent value="field-rules" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Field Rules</CardTitle>
                  <CardDescription>Conditional logic applied to individual fields</CardDescription>
                </CardHeader>
                <CardContent>
                  {allFieldRules.length === 0 ? (
                    <div className="text-center py-8">
                      <GitBranch className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No field rules configured</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allFieldRules.map(({ field, rule }) => (
                        <div key={`${field.id}-${rule.id}`} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{field.label}</span>
                              <span className="text-muted-foreground ml-2">→ {rule.triggerCondition}</span>
                            </div>
                            <Badge variant="secondary">Field Rule</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Form Logic Tab */}
            <TabsContent value="form-logic" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Form Workflows</h3>
                <Button onClick={createNewFormLogic} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Workflow
                </Button>
              </div>

              <div className="grid gap-4">
                {formLogic.map((logic) => {
                  const LogicIcon = getFormLogicTypeIcon(logic.type);
                  return (
                    <Card 
                      key={logic.id} 
                      className={`cursor-pointer transition-all ${
                        selectedFormLogic?.id === logic.id 
                          ? 'ring-2 ring-primary' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedFormLogic(logic)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <LogicIcon className="w-5 h-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium">{logic.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {getFormLogicTypeOptions().find(t => t.value === logic.type)?.label}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={logic.enabled} 
                              onCheckedChange={(checked) => updateFormLogic(logic.id, { enabled: checked })}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFormLogic(logic.id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Selected Logic Details */}
              {selectedFormLogic && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Workflow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Workflow Name */}
                    <div className="space-y-2">
                      <Label>Workflow Name</Label>
                      <Input
                        value={selectedFormLogic.name}
                        onChange={(e) => updateFormLogic(selectedFormLogic.id, { name: e.target.value })}
                        placeholder="Enter workflow name"
                      />
                    </div>

                    {/* Workflow Type */}
                    <div className="space-y-2">
                      <Label>Workflow Type</Label>
                      <Select
                        value={selectedFormLogic.type}
                        onValueChange={(value: 'save_workflow' | 'validation_workflow' | 'notification_workflow' | 'redirect_workflow') => updateFormLogic(selectedFormLogic.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getFormLogicTypeOptions().map((option) => {
                            const Icon = option.icon;
                            return (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-3 h-3" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Actions</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addFormLogicAction(selectedFormLogic.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Action
                        </Button>
                      </div>

                      <ScrollArea className="max-h-48">
                        <div className="space-y-2">
                          {selectedFormLogic.actions.map((action) => {
                            const ActionIcon = getActionIcon(action.type);
                            return (
                              <div key={action.id} className="p-3 border rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <ActionIcon className="w-4 h-4 text-blue-500" />
                                  <Select
                                    value={action.type}
                                    onValueChange={(value: 'save_data' | 'send_email' | 'redirect' | 'show_message' | 'trigger_webhook') => {
                                      const updatedActions = selectedFormLogic.actions.map(a =>
                                        a.id === action.id ? { ...a, type: value } : a
                                      );
                                      updateFormLogic(selectedFormLogic.id, { actions: updatedActions });
                                    }}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getFormLogicActionOptions().map((option) => {
                                        const Icon = option.icon;
                                        return (
                                          <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                              <Icon className="w-3 h-3" />
                                              {option.label}
                                            </div>
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedActions = selectedFormLogic.actions.filter(a => a.id !== action.id);
                                      updateFormLogic(selectedFormLogic.id, { actions: updatedActions });
                                    }}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 