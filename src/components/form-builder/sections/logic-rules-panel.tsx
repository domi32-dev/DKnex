'use client';

import { Button } from '@/components/ui/button';
import { GitBranch, Edit } from 'lucide-react';
import { FormField } from '../types';

interface LogicRulesPanelProps {
  fields: FormField[];
  showLogicRules: boolean;
  onSelectField: (field: FormField) => void;
}

export function LogicRulesPanel({ fields, showLogicRules, onSelectField }: LogicRulesPanelProps) {
  if (!showLogicRules) return null;

  const fieldsWithLogic = fields.filter(f => f.conditionalLogic?.enabled);

  return (
    <div className="border-b bg-purple-50 dark:bg-purple-950/20 px-6 py-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Conditional Logic Rules
        </h3>
        {fieldsWithLogic.length > 0 ? (
          <div className="space-y-3">
            {fieldsWithLogic.map(field => (
              <div key={field.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium">{field.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Action: <span className="font-medium text-purple-600">{field.conditionalLogic?.action}</span>
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelectField(field)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Rules
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No conditional logic rules defined yet</p>
            <p className="text-sm text-gray-500">Add conditional logic to fields in the properties panel</p>
          </div>
        )}
      </div>
    </div>
  );
} 