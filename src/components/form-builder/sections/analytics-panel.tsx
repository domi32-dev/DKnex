'use client';

import { BarChart, FileText, Clock, Target, Users } from 'lucide-react';
import { FormField, FormPage } from '../types';

interface AnalyticsPanelProps {
  fields: FormField[];
  showAnalytics: boolean;
  isMultiStep?: boolean;
  pages?: FormPage[];
}

export function AnalyticsPanel({ fields, showAnalytics, isMultiStep = false, pages = [] }: AnalyticsPanelProps) {
  if (!showAnalytics) return null;

  const requiredFields = fields.filter(f => f.required).length;
  const conditionalFields = fields.filter(f => f.conditionalLogic?.enabled).length;
  const advancedFields = fields.filter(f => ['signature', 'richtext', 'matrix', 'calculation', 'section', 'repeating', 'payment'].includes(f.type)).length;
  const completionTime = Math.ceil(fields.length * 0.5);
  const avgFieldsPerPage = isMultiStep && pages.length > 0 ? Math.round(fields.length / pages.length) : fields.length;

  return (
    <div className="border-b bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/30 dark:to-purple-950/30 px-6 py-4">
      <div>
        <h3 className="text-base font-semibold mb-3 text-blue-800 dark:text-blue-200 flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Form Analytics {isMultiStep && <span className="text-sm font-normal text-muted-foreground">• Multi-step Form</span>}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {isMultiStep && (
            <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Pages</h4>
              </div>
              <p className="text-xl font-bold text-blue-600">{pages.length}</p>
            </div>
          )}
          <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Fields</h4>
            </div>
            <p className="text-xl font-bold text-purple-600">{fields.length}</p>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-green-600" />
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Required Fields</h4>
            </div>
            <p className="text-xl font-bold text-green-600">{requiredFields}</p>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <BarChart className="w-4 h-4 text-orange-600" />
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Conditional Fields</h4>
            </div>
            <p className="text-xl font-bold text-orange-600">{conditionalFields}</p>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-red-600" />
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Advanced Fields</h4>
            </div>
            <p className="text-xl font-bold text-red-600">{advancedFields}</p>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {isMultiStep ? 'Avg. Fields/Page' : 'Completion Est.'}
              </h4>
            </div>
            <p className="text-xl font-bold text-indigo-600">
              {isMultiStep ? avgFieldsPerPage : `${completionTime}min`}
            </p>
          </div>
        </div>
        
        {/* Multi-step specific analytics */}
        {isMultiStep && pages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {pages.map((page) => {
                const pageFields = fields.filter(f => f.pageId === page.id);
                return (
                  <div key={page.id} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded border">
                    <h5 className="text-xs font-medium truncate">{page.title}</h5>
                    <p className="text-sm font-bold text-blue-600">{pageFields.length} fields</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 