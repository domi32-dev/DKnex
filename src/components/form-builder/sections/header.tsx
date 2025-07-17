'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Layers, 
  BookOpen, 
  BarChart, 
  GitBranch, 
  Upload, 
  Download, 
  Settings 
} from 'lucide-react';
import { FormField, FormPage } from '../types';

interface HeaderProps {
  formName: string;
  setFormName: (name: string) => void;
  fields: FormField[];
  pages: FormPage[];
  isMultiStep: boolean;
  setIsMultiStep: (isMultiStep: boolean) => void;
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  showLogicRules: boolean;
  setShowLogicRules: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  historyIndex: number;
  historyLength: number;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onSave: () => void;
  onImport: () => void;
  onExport: () => void;
  onShowNotification: (message: string) => void;
}

export function Header({
  formName,
  setFormName,
  fields,
  pages,
  isMultiStep,
  setIsMultiStep,
  showAnalytics,
  setShowAnalytics,
  showLogicRules,
  setShowLogicRules,
  showSettings,
  setShowSettings,
  historyIndex,
  historyLength,
  onUndo,
  onRedo,
  onPreview,
  onSave,
  onImport,
  onExport,
  onShowNotification
}: HeaderProps) {
  return (
    <>
      {/* Main Header */}
      <div className="flex items-center justify-between p-6 border-b bg-card sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="text-2xl font-bold border-none bg-transparent p-0 focus:ring-0 shadow-none"
            placeholder="Form Title"
          />
          <Badge variant="outline" className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {fields.length} fields
          </Badge>
          {isMultiStep && (
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {pages.length} pages
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUndo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRedo}
                  disabled={historyIndex >= historyLength - 1}
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <Button
            variant="outline"
            onClick={onPreview}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Form
          </Button>
        </div>
      </div>

      {/* Advanced Toolbar */}
      <div className="border-b bg-muted/30 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="multi-step"
                checked={isMultiStep}
                onCheckedChange={setIsMultiStep}
              />
              <Label htmlFor="multi-step" className="text-sm font-medium">Multi-step Form</Label>
            </div>

            <Button 
              variant={showAnalytics ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart className="w-4 h-4" />
              <span>Analytics</span>
            </Button>

            <Button 
              variant={showLogicRules ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowLogicRules(!showLogicRules)}
            >
              <GitBranch className="w-4 h-4" />
              <span>Logic Rules</span>
              <Badge variant="secondary" className="text-xs">
                {fields.filter(f => f.conditionalLogic?.enabled).length}
              </Badge>
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-background rounded-lg p-1 border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onImport}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import form</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onExport}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export form</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Button 
              variant={showSettings ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 