'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Save, 
  X, 
  Palette, 
  Shield, 
  Upload,
  Download,
  Trash2
} from 'lucide-react';

interface SettingsPanelProps {
  formName: string;
  setFormName: (name: string) => void;
  onClose: () => void;
  onShowNotification: (message: string) => void;
}

export function SettingsPanel({ 
  formName, 
  setFormName, 
  onClose, 
  onShowNotification 
}: SettingsPanelProps) {
  const [formDescription, setFormDescription] = useState('');
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [successMessage, setSuccessMessage] = useState('Thank you for your submission!');
  const [theme, setTheme] = useState('default');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableAnalytics, setEnableAnalytics] = useState(false);
  const [requireSSL, setRequireSSL] = useState(true);
  const [maxSubmissions, setMaxSubmissions] = useState([100]);

  const handleSaveSettings = () => {
    onShowNotification('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    setFormDescription('');
    setSubmitButtonText('Submit');
    setSuccessMessage('Thank you for your submission!');
    setTheme('default');
    setPrimaryColor('#3b82f6');
    setEnableNotifications(true);
    setEnableAnalytics(false);
    setRequireSSL(true);
    setMaxSubmissions([100]);
    onShowNotification('Settings reset to defaults');
  };

  const handleExportSettings = () => {
    const settings = {
      formName,
      formDescription,
      submitButtonText,
      successMessage,
      theme,
      primaryColor,
      enableNotifications,
      enableAnalytics,
      requireSSL,
      maxSubmissions: maxSubmissions[0]
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formName.replace(/\s+/g, '_').toLowerCase()}_settings.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onShowNotification('Settings exported successfully!');
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            setFormName(settings.formName || formName);
            setFormDescription(settings.formDescription || '');
            setSubmitButtonText(settings.submitButtonText || 'Submit');
            setSuccessMessage(settings.successMessage || 'Thank you for your submission!');
            setTheme(settings.theme || 'default');
            setPrimaryColor(settings.primaryColor || '#3b82f6');
            setEnableNotifications(settings.enableNotifications ?? true);
            setEnableAnalytics(settings.enableAnalytics ?? false);
            setRequireSSL(settings.requireSSL ?? true);
            setMaxSubmissions([settings.maxSubmissions || 100]);
            onShowNotification('Settings imported successfully!');
          } catch {
            onShowNotification('Error importing settings. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="w-full h-full bg-white dark:bg-slate-800 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Form Settings
            </h2>
            <p className="text-sm text-muted-foreground">Configure form options and behavior</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
            <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
                <CardDescription>Configure basic form details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="form-name">Form Name</Label>
                  <Input
                    id="form-name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter form name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea
                    id="form-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Optional form description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submit-button">Submit Button Text</Label>
                  <Input
                    id="submit-button"
                    value={submitButtonText}
                    onChange={(e) => setSubmitButtonText(e.target.value)}
                    placeholder="Submit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="success-message">Success Message</Label>
                  <Textarea
                    id="success-message"
                    value={successMessage}
                    onChange={(e) => setSuccessMessage(e.target.value)}
                    placeholder="Thank you for your submission!"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Theme & Styling
                </CardTitle>
                <CardDescription>Customize the visual appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10 rounded-md border border-input bg-background p-1"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="p-4 border rounded-lg space-y-2" style={{ borderColor: primaryColor }}>
                    <div className="text-sm font-medium">Sample Form Field</div>
                    <div className="h-8 bg-muted rounded border" />
                    <div 
                      className="h-8 rounded text-white text-sm flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {submitButtonText}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security & Limits
                </CardTitle>
                <CardDescription>Configure advanced form behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">Send notifications on form submission</div>
                  </div>
                  <Switch
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics Tracking</Label>
                    <div className="text-sm text-muted-foreground">Track form performance metrics</div>
                  </div>
                  <Switch
                    checked={enableAnalytics}
                    onCheckedChange={setEnableAnalytics}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require SSL</Label>
                    <div className="text-sm text-muted-foreground">Only accept secure connections</div>
                  </div>
                  <Switch
                    checked={requireSSL}
                    onCheckedChange={setRequireSSL}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Submissions: {maxSubmissions[0]}</Label>
                  <Slider
                    value={maxSubmissions}
                    onValueChange={setMaxSubmissions}
                    max={1000}
                    min={1}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>1000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Import & Export</CardTitle>
                <CardDescription>Manage your form settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleImportSettings} className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import
                  </Button>
                  <Button variant="outline" onClick={handleExportSettings} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <Button onClick={handleSaveSettings} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button variant="outline" onClick={handleResetSettings} className="w-full text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 