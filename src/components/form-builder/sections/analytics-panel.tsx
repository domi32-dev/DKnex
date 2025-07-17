'use client';

import { BarChart } from 'lucide-react';
import { FormField } from '../types';

interface AnalyticsPanelProps {
  fields: FormField[];
  showAnalytics: boolean;
}

export function AnalyticsPanel({ fields, showAnalytics }: AnalyticsPanelProps) {
  if (!showAnalytics) return null;

  return (
    <div className="border-b bg-blue-50 dark:bg-blue-950/20 px-6 py-4">
      <div>
        <h3 className="text-base font-semibold mb-3 text-blue-800 dark:text-blue-200 flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Form Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Fields</h4>
            <p className="text-xl font-bold text-blue-600">{fields.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Required Fields</h4>
            <p className="text-xl font-bold text-green-600">{fields.filter(f => f.required).length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Conditional Fields</h4>
            <p className="text-xl font-bold text-purple-600">{fields.filter(f => f.conditionalLogic?.enabled).length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Advanced Fields</h4>
            <p className="text-xl font-bold text-orange-600">
              {fields.filter(f => ['signature', 'richtext', 'matrix', 'calculation', 'section', 'repeating', 'payment'].includes(f.type)).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Completion Est.</h4>
            <p className="text-xl font-bold text-indigo-600">{Math.ceil(fields.length * 0.5)}min</p>
          </div>
        </div>
      </div>
    </div>
  );
} 