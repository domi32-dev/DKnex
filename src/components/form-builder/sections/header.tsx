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
  Settings,
  Brain,
  Code
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
  showAIAssistant: boolean;
  setShowAIAssistant: (show: boolean) => void;
  showDevMode: boolean;
  setShowDevMode: (show: boolean) => void;
  devModeEnabled: boolean;
  setDevModeEnabled: (enabled: boolean) => void;
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
  showAIAssistant,
  setShowAIAssistant,
  showDevMode,
  setShowDevMode,
  devModeEnabled,
  setDevModeEnabled,
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
    <div className="border-b border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section: Form Info & Tools */}
        <div className="flex items-center space-x-6">
          {/* Form Title & Badges */}
          <div className="flex items-center space-x-3">
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="text-xl font-bold border-none bg-transparent p-0 focus:ring-0 shadow-none bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent placeholder:text-muted-foreground"
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

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Form Tools */}
          <div className="flex items-center space-x-4">
            {/* Multi-step Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="multi-step"
                checked={isMultiStep}
                onCheckedChange={setIsMultiStep}
              />
              <Label htmlFor="multi-step" className="text-sm font-medium">Multi-step</Label>
            </div>

            {/* Analytics */}
            <Button 
              size="sm" 
              variant="ghost"
              className={`flex items-center space-x-1 h-8 px-3 ${
                showAnalytics 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart className="w-4 h-4" />
              <span className="text-sm">Analytics</span>
            </Button>

            {/* Logic Rules */}
            <Button 
              size="sm" 
              variant="ghost"
              className={`flex items-center space-x-1 h-8 px-3 ${
                showLogicRules 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setShowLogicRules(!showLogicRules)}
            >
              <GitBranch className="w-4 h-4" />
              <span className="text-sm">Logic</span>
              <Badge variant="secondary" className="text-xs">
                {fields.filter(f => f.conditionalLogic?.enabled).length}
              </Badge>
            </Button>

            {/* AI Assistant */}
            <Button 
              size="sm" 
              variant="ghost"
              className={`flex items-center space-x-1 h-8 px-3 ${
                showAIAssistant 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm">AI</span>
              <Badge variant="secondary" className="text-xs bg-purple-500 text-white ml-1">
                β
              </Badge>
            </Button>

            {/* Studio Mode */}
            <Button 
              size="sm" 
              variant="ghost"
              className={`flex items-center space-x-1 h-8 px-3 ${
                showDevMode 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                setShowDevMode(!showDevMode);
                setDevModeEnabled(!showDevMode);
                onShowNotification(!showDevMode ? 'Studio Mode activated!' : 'Studio Mode closed');
              }}
            >
              <Code className="w-4 h-4" />
              <span className="text-sm">Studio</span>
              <Badge variant="secondary" className="text-xs bg-cyan-500 text-white ml-1">
                β
              </Badge>
            </Button>
          </div>
        </div>

        {/* Right Section: Actions */}
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
                  className="h-8 w-8 p-0"
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
                  className="h-8 w-8 p-0"
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Import/Export */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onImport}
                  className="h-8 w-8 p-0"
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
                  className="h-8 w-8 p-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export to platforms</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Preview */}
          <Button
            variant="outline"
            onClick={onPreview}
            className="flex items-center gap-2 h-9"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>

          {/* Settings */}
          <Button 
            size="sm" 
            variant="ghost"
            className={`flex items-center space-x-1 h-9 px-3 ${
              showSettings 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </Button>
          
          {/* Save */}
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg flex items-center gap-2 h-9"
          >
            <Save className="w-4 h-4" />
            Save Form
          </Button>
        </div>
      </div>
    </div>
  );
} 