'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTranslation } from '@/i18n/translations';
import { Heart } from 'lucide-react';

// Import types and utilities
import { FormField, FormPage, FieldTemplate, CustomFieldType } from './types';
import { defaultTemplates as defaultTemplatesData } from './constants';
import { generateId, getVisibleFields, shouldFieldBeVisible } from './utils';

// Import components
import { Header } from './sections/header';
import { AnalyticsPanel } from './sections/analytics-panel';
import { LogicRulesPanel } from './sections/logic-rules-panel';
import { AIAssistantPanel } from './sections/ai-assistant-panel';
import { DevModePanel } from './sections/dev-mode-panel';
import { Sidebar } from './sections/sidebar';
import { FormCanvas } from './sections/form-canvas';
import { PropertiesPanel } from './sections/properties-panel';
import { PreviewMode } from './sections/preview-mode';
import { SettingsPanel } from './sections/settings-panel';
import { FieldLogicEditor } from './sections/field-logic-editor';
import { ExportPanel } from './sections/export-panel';
import { Button } from '@/components/ui/button';
import { X, GitBranch } from 'lucide-react';

interface FormBuilderProps {
  formId?: string;
  initialFields?: FormField[];
  onSave?: (fields: FormField[], formName: string, pages?: FormPage[]) => void;
}

export function ModernFormBuilder({ formId: _formId, initialFields = [], onSave }: FormBuilderProps) {
  const { t } = useTranslation();
  
  // Core state
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [pages, setPages] = useState<FormPage[]>([{ id: 'page-1', title: 'Page 1', order: 1 }]);
  const [currentPage, setCurrentPage] = useState('page-1');
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [formName, setFormName] = useState<string>(t('formBuilder.untitledForm' as keyof typeof t) || 'Untitled Form');
  
  // Form values for conditional logic
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  // UI state
  const [previewMode, setPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isMultiStep, setIsMultiStep] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showLogicRules, setShowLogicRules] = useState(false);
  const [showFieldLogicEditor, setShowFieldLogicEditor] = useState(false);
  const [editingFieldForLogic, setEditingFieldForLogic] = useState<FormField | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLogicBuilder, setShowLogicBuilder] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  
  // AI & Dev Mode state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [customFieldTypes, setCustomFieldTypes] = useState<CustomFieldType[]>(() => {
    // Load custom components from localStorage on init
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dknex-custom-components');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Failed to load custom components:', error);
        return [];
      }
    }
    return [];
  });
  
  const [notification, setNotification] = useState<string | null>(null);
  
  // Sidebar state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  
  // History state
  const [history, setHistory] = useState<{ fields: FormField[]; timestamp: number }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Inline editing state
  const [isInlineEditing, setIsInlineEditing] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [fieldTemplates, setFieldTemplates] = useState<FieldTemplate[]>([]);
  
  const inlineEditRef = useRef<HTMLInputElement>(null);

  // Notification helper
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // History management
  const addToHistory = useCallback((newFields: FormField[]) => {
    const newHistory = [...history.slice(0, historyIndex + 1), { fields: newFields, timestamp: Date.now() }];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setFields(prevState.fields);
      setHistoryIndex(historyIndex - 1);
      showNotification('Undone');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setFields(nextState.fields);
      setHistoryIndex(historyIndex + 1);
      showNotification('Redone');
    }
  }, [history, historyIndex]);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (fields.length > 0) {
        localStorage.setItem(`form_draft_${formName}`, JSON.stringify({ fields, formName, pages }));
      }
    }, 30000);
    return () => clearInterval(autoSave);
  }, [fields, formName, pages]);

  // Field management
  const addField = useCallback((type: FormField['type'], template?: FieldTemplate, customId?: string) => {
    const baseField: FormField = template?.field ? {
      ...template.field,
      id: generateId(),
      type,
      required: template.field.required || false,
      pageId: currentPage
    } as FormField : {
      id: generateId(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      placeholder: '',
      options: type === 'select' || type === 'checkbox' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
      validation: {},
      style: {},
      width: 'full',
      pageId: currentPage,
      // Initialize AI and dev mode settings for new fields
      aiSettings: {
        enabled: false,
        suggestions: [],
        autoComplete: false,
        smartValidation: false,
        contentGeneration: false,
        optimizationHints: []
      },
      customComponent: type === 'custom' ? {
        enabled: true,
        id: customId || '', // Set the custom component ID
        html: '',
        css: '',
        javascript: '',
        props: {},
        events: [],
        dependencies: []
      } : undefined
    };
    
    if (type === 'rating') {
      baseField.options = ['1', '2', '3', '4', '5'];
    }
    
    const newFields = [...fields, baseField];
    setFields(newFields);
    addToHistory(newFields);
    setSelectedField(baseField);
    showNotification(`${type} field added`);
    

  }, [fields, currentPage, addToHistory]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    const newFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    setFields(newFields);
    addToHistory(newFields);
    
    if (selectedField?.id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [fields, selectedField, addToHistory]);

  const deleteField = useCallback((fieldId: string) => {
    const newFields = fields.filter(field => field.id !== fieldId);
    setFields(newFields);
    addToHistory(newFields);
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
    showNotification('Field deleted');
  }, [fields, selectedField, addToHistory]);

  const duplicateField = useCallback((field: FormField) => {
    const newField = { ...field, id: generateId(), label: `${field.label} Copy` };
    const newFields = [...fields, newField];
    setFields(newFields);
    addToHistory(newFields);
    showNotification('Field duplicated');
  }, [fields, addToHistory]);

  // Custom field management
  const addCustomFieldType = useCallback((customField: CustomFieldType) => {
    let newCustomFieldTypes;
    
    // Check if we're updating an existing component
    if (editingComponentId && customFieldTypes.some(comp => comp.id === editingComponentId)) {
      newCustomFieldTypes = customFieldTypes.map(comp => 
        comp.id === editingComponentId ? customField : comp
      );
      showNotification(`✨ Custom component "${customField.name}" updated successfully!`);
    } else {
      newCustomFieldTypes = [...customFieldTypes, customField];
      showNotification(`✨ Custom component "${customField.name}" created and added to your library!`);
    }
    
    setCustomFieldTypes(newCustomFieldTypes);
    
    // Save to localStorage
    try {
      localStorage.setItem('dknex-custom-components', JSON.stringify(newCustomFieldTypes));
    } catch (error) {
      console.error('Failed to save custom component:', error);
    }
    
    // Reset editing state
    setEditingComponentId(null);
  }, [customFieldTypes, editingComponentId]);

  const closeDevMode = useCallback(() => {
    setShowDevMode(false);
    setDevModeEnabled(false);
    setEditingComponentId(null);
  }, []);

  // Edit custom component
  const editCustomFieldType = useCallback((componentId: string) => {
    const componentToEdit = customFieldTypes.find(comp => comp.id === componentId);
    if (componentToEdit) {
      setEditingComponentId(componentId);
      setShowDevMode(true);
      setDevModeEnabled(true);
    }
  }, [customFieldTypes]);

  // Delete custom component
  const deleteCustomFieldType = useCallback((componentId: string) => {
    const newCustomFieldTypes = customFieldTypes.filter(comp => comp.id !== componentId);
    setCustomFieldTypes(newCustomFieldTypes);
    
    // Update localStorage
    try {
      localStorage.setItem('dknex-custom-components', JSON.stringify(newCustomFieldTypes));
    } catch (error) {
      console.error('Failed to delete custom component:', error);
    }
    
    showNotification(`🗑️ Custom component deleted from your library`);
  }, [customFieldTypes]);

  // Clear all custom components
  const clearAllCustomComponents = useCallback(() => {
    setCustomFieldTypes([]);
    
    // Clear localStorage
    try {
      localStorage.removeItem('dknex-custom-components');
    } catch (error) {
      console.error('Failed to clear custom components:', error);
    }
    
    showNotification(`🧹 All custom components cleared from your library`);
  }, []);

  const openFieldLogicEditor = useCallback((field: FormField) => {
    setEditingFieldForLogic(field);
    setShowFieldLogicEditor(true);
  }, []);

  const closeFieldLogicEditor = useCallback(() => {
    setShowFieldLogicEditor(false);
    setEditingFieldForLogic(null);
  }, []);

  // Multi-step form management
  const addPage = useCallback(() => {
    const newPageNumber = pages.length + 1;
    const newPage: FormPage = {
      id: `page-${newPageNumber}`,
      title: `Page ${newPageNumber}`,
      order: newPageNumber
    };
    const newPages = [...pages, newPage];
    setPages(newPages);
    setCurrentPage(newPage.id);
    showNotification(`Page ${newPageNumber} added`);
  }, [pages]);

  const deletePage = useCallback((pageId: string) => {
    if (pages.length <= 1) {
      showNotification('Cannot delete the last page');
      return;
    }
    
    const pageToDelete = pages.find(p => p.id === pageId);
    if (!pageToDelete) return;
    
    // Remove fields associated with this page
    const newFields = fields.filter(field => field.pageId !== pageId);
    setFields(newFields);
    addToHistory(newFields);
    
    // Remove the page
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
    
    // If we're deleting the current page, switch to the first available page
    if (currentPage === pageId) {
      setCurrentPage(newPages[0].id);
    }
    
    showNotification(`${pageToDelete.title} deleted`);
  }, [pages, fields, currentPage, addToHistory]);

  const updatePageTitle = useCallback((pageId: string, title: string) => {
    const newPages = pages.map(page => 
      page.id === pageId ? { ...page, title } : page
    );
    setPages(newPages);
  }, [pages]);

  const switchToPage = useCallback((pageId: string) => {
    setCurrentPage(pageId);
    setSelectedField(null); // Clear selection when switching pages
  }, []);

  // Get fields for current page with conditional logic
  const getCurrentPageFields = useCallback(() => {
    let pageFields = fields;
    
    // Filter by page if multi-step
    if (isMultiStep) {
      pageFields = fields.filter(field => field.pageId === currentPage);
    }
    
    // Apply conditional logic to determine visible fields
    return getVisibleFields(pageFields, formValues);
  }, [fields, isMultiStep, currentPage, formValues]);

  // Handle form value changes for conditional logic
  const handleFormValueChange = useCallback((fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  // Inline editing
  const startInlineEdit = useCallback((fieldId: string) => {
    setIsInlineEditing(fieldId);
    setTimeout(() => {
      inlineEditRef.current?.focus();
      inlineEditRef.current?.select();
    }, 100);
  }, []);

  const finishInlineEdit = useCallback((fieldId: string, newLabel: string) => {
    if (newLabel.trim()) {
      updateField(fieldId, { label: newLabel.trim() });
    }
    setIsInlineEditing(null);
  }, [updateField]);

  // Drag and drop
  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source } = result;
    
    if (!destination) return;
    if (source.droppableId !== 'form-fields' || destination.droppableId !== 'form-fields') return;
    if (source.index === destination.index) return;

    try {
      const newFields = [...fields];
      const [movedField] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, movedField);
      setFields(newFields);
      addToHistory(newFields);
    } catch (error) {
      console.error('Drag and drop error:', error);
    }
  }, [fields, addToHistory]);

  // Actions
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(fields, formName, pages);
    }
    showNotification('Form saved successfully!');
  }, [fields, formName, pages, onSave]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.fields && Array.isArray(data.fields)) {
              setFields(data.fields);
              setFormName(data.formName || 'Imported Form');
              addToHistory(data.fields);
              showNotification('Form imported successfully!');
            } else {
              showNotification('Invalid form data format');
            }
          } catch (_error) {
            showNotification('Error parsing JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [addToHistory]);

  const handleExport = useCallback(() => {
    setShowExportPanel(true);
  }, []);

  const handleExportToJSON = useCallback(() => {
    const formData = {
      formName,
      fields,
      pages,
      isMultiStep,
      customFieldTypes,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formName.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Form exported successfully!');
  }, [formName, fields, pages, isMultiStep, customFieldTypes]);

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Preview mode
  if (previewMode) {
    return (
      <PreviewMode
        formName={formName}
        fields={fields}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        onExitPreview={() => setPreviewMode(false)}
        isMultiStep={isMultiStep}
        pages={pages}
        customFieldTypes={customFieldTypes}
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Optimized Background Effects for Both Modes */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-blue-50/50 dark:from-blue-950/40 dark:via-purple-950/30 dark:to-blue-950/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.12),transparent_70%)] pointer-events-none" />
        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right flex items-center gap-2">
            <Heart className="w-4 h-4" />
            {notification}
          </div>
        )}
        
        {/* Header */}
        <Header
          formName={formName}
          setFormName={setFormName}
          fields={fields}
          pages={pages}
          isMultiStep={isMultiStep}
          setIsMultiStep={setIsMultiStep}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
          showLogicRules={showLogicRules}
          setShowLogicRules={setShowLogicRules}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          showAIAssistant={showAIAssistant}
          setShowAIAssistant={setShowAIAssistant}
          showDevMode={showDevMode}
          setShowDevMode={setShowDevMode}
          devModeEnabled={devModeEnabled}
          setDevModeEnabled={setDevModeEnabled}
          historyIndex={historyIndex}
          historyLength={history.length}
          onUndo={undo}
          onRedo={redo}
          onPreview={() => setPreviewMode(true)}
          onSave={handleSave}
          onImport={handleImport}
          onExport={handleExport}
          onShowNotification={showNotification}
        />

        {/* Analytics Panel */}
        <AnalyticsPanel 
          fields={fields} 
          showAnalytics={showAnalytics}
          isMultiStep={isMultiStep}
          pages={pages}
        />

                            {/* Logic Rules Panel */}
                    {showLogicRules && (
                      <LogicRulesPanel
                        fields={fields}
                        showLogicRules={showLogicRules}
                        onClose={() => setShowLogicRules(false)}
                        onShowNotification={showNotification}
                        onUpdateField={updateField}
                      />
                    )}

        {/* Field Logic Editor Panel */}
        {showFieldLogicEditor && editingFieldForLogic && (
          <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[80vh] mx-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <GitBranch className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Field Logic Editor
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Configure conditional logic for "{editingFieldForLogic.label}"
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeFieldLogicEditor}
                  className="hover:bg-white/50 dark:hover:bg-slate-800/50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
                <FieldLogicEditor
                  field={editingFieldForLogic}
                  allFields={fields}
                  onUpdateField={updateField}
                  onShowNotification={showNotification}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex flex-col lg:flex-row ${showAnalytics || showLogicRules ? 'h-[calc(100vh-280px)]' : 'h-[calc(100vh-125px)]'} relative z-10`}>
          {/* Sidebar */}
          <Sidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            collapsedCategories={collapsedCategories}
            toggleCategory={toggleCategory}
            showTemplates={showTemplates}
            setShowTemplates={setShowTemplates}
            fieldTemplates={fieldTemplates}
            customFieldTypes={customFieldTypes}
            onDeleteCustomFieldType={deleteCustomFieldType}
            onEditCustomFieldType={editCustomFieldType}
            onAddField={addField}
            onShowOnboarding={() => setShowOnboarding(true)}
          />

          {/* Form Canvas */}
          <FormCanvas
            fields={getCurrentPageFields()}
            selectedField={selectedField}
            currentTheme={currentTheme}
            isInlineEditing={isInlineEditing}
            isMultiStep={isMultiStep}
            pages={pages}
            currentPage={currentPage}
            formValues={formValues}
            onDragEnd={onDragEnd}
            onSelectField={setSelectedField}
            onUpdateField={updateField}
            onDeleteField={deleteField}
            onDuplicateField={duplicateField}
            onStartInlineEdit={startInlineEdit}
            onFinishInlineEdit={finishInlineEdit}
            onFormValueChange={handleFormValueChange}
            onAddField={addField}
            onShowOnboarding={() => setShowOnboarding(true)}
            onAddPage={addPage}
            onDeletePage={deletePage}
            onUpdatePageTitle={updatePageTitle}
            onSwitchToPage={switchToPage}
            customFieldTypes={customFieldTypes}
          />

                                {/* Properties Panel */}
                      {!showAIAssistant && (
                        <PropertiesPanel
                          selectedField={selectedField}
                          onUpdateField={updateField}
                          onDeselectField={() => setSelectedField(null)}
                          showLogicBuilder={showLogicBuilder}
                          setShowLogicBuilder={setShowLogicBuilder}
                          allFields={fields}
                          onShowNotification={showNotification}
                          onOpenFieldLogicEditor={openFieldLogicEditor}
                        />
                      )}

          {/* AI Assistant Panel */}
          {showAIAssistant && (
            <AIAssistantPanel
              fields={fields}
              showAIAssistant={showAIAssistant}
              onSelectField={setSelectedField}
              onAddField={addField}
              onUpdateField={updateField}
            />
          )}
        </div>

        {/* Export Panel */}
        <ExportPanel
          isOpen={showExportPanel}
          onClose={() => setShowExportPanel(false)}
          formData={{
            formName,
            fields,
            pages,
            settings: {
              theme: currentTheme,
              primaryColor: '#007bff',
              submitButtonText: 'Submit',
              successMessage: 'Form submitted successfully!',
              enableNotifications: true,
              enableAnalytics: true
            },
            customFieldTypes,
            isMultiStep
          }}
        />

        {/* Dev Mode Modal */}
        <DevModePanel
          showDevMode={showDevMode}
          onAddCustomFieldType={addCustomFieldType}
          onCloseDevMode={closeDevMode}
          customFieldTypes={customFieldTypes}
          editingComponentId={editingComponentId}
        />

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] mx-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
              <SettingsPanel
                formName={formName}
                setFormName={setFormName}
                onClose={() => setShowSettings(false)}
                onShowNotification={showNotification}
              />
            </div>
          </div>
        )}

      </div>
    </TooltipProvider>
  );
} 