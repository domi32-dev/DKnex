'use client';

import { ModernFormBuilder } from './modern-form-builder';
import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Monitor, Smartphone, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/translations';
import { FormField } from './types';

interface FormBuilderWrapperProps {
  params: Promise<{
    formId: string;
  }>;
  searchParams: Promise<{
    responsive?: string;
  }>;
}

export function FormBuilderWrapper({ params, searchParams }: FormBuilderWrapperProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const { t } = useTranslation();
  
  const isNew = resolvedParams.formId === 'new';
  const isResponsive = resolvedSearchParams.responsive === 'true';
  const [initialFields, setInitialFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load existing form data if not new
  useEffect(() => {
    if (!isNew) {
      // Simulate loading existing form data
      // In a real app, you'd fetch from your API
      const loadForm = async () => {
        try {
          // Example: const response = await fetch(`/api/forms/${resolvedParams.formId}`);
          // const formData = await response.json();
          // setInitialFields(formData.fields || []);
          
          // For demo purposes, load some advanced sample fields for existing forms
          const sampleFields: FormField[] = [
            {
              id: 'field_1',
              type: 'section',
              label: 'Personal Information',
              required: false,
              width: 'full',
              sectionSettings: {
                collapsible: true,
                defaultCollapsed: false,
                description: 'Please provide your personal details'
              }
            },
            {
              id: 'field_2',
              type: 'text',
              label: 'First Name',
              required: true,
              width: 'half',
              validation: {
                minLength: 2,
                maxLength: 30,
                customMessage: 'First name must be 2-30 characters'
              }
            },
            {
              id: 'field_3',
              type: 'text',
              label: 'Last Name',
              required: true,
              width: 'half',
              validation: {
                minLength: 2,
                maxLength: 30,
                customMessage: 'Last name must be 2-30 characters'
              }
            },
            {
              id: 'field_4',
              type: 'email',
              label: 'Email Address',
              required: true,
              width: 'half',
              validation: {
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                customMessage: 'Please enter a valid email address'
              }
            },
            {
              id: 'field_5',
              type: 'phone',
              label: 'Phone Number',
              required: false,
              width: 'half'
            },
            {
              id: 'field_6',
              type: 'select',
              label: 'Country',
              required: true,
              width: 'third',
              options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Other'],
              conditionalLogic: {
                enabled: true,
                rules: []
              }
            },
            {
              id: 'field_7',
              type: 'number',
              label: 'Age',
              required: false,
              width: 'third',
              validation: {
                min: 18,
                max: 99,
                customMessage: 'Age must be between 18 and 99'
              }
            },
            {
              id: 'field_8',
              type: 'rating',
              label: 'Experience Level',
              required: false,
              width: 'third'
            },
            {
              id: 'field_9',
              type: 'matrix',
              label: 'Skills Assessment',
              required: false,
              width: 'full',
              matrixSettings: {
                rows: ['JavaScript', 'React', 'Node.js', 'Python', 'Database Design'],
                columns: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                inputType: 'radio'
              }
            },
            {
              id: 'field_10',
              type: 'file',
              label: 'Resume/CV',
              required: true,
              width: 'half',
              fileSettings: {
                maxSize: 5,
                allowedTypes: ['application/pdf', '.doc', '.docx'],
                maxFiles: 1,
                showPreview: true
              }
            },
            {
              id: 'field_11',
              type: 'signature',
              label: 'Digital Signature',
              required: true,
              width: 'half'
            },
            {
              id: 'field_12',
              type: 'calculation',
              label: 'Experience Score',
              required: false,
              width: 'quarter',
              calculations: {
                enabled: true,
                formula: 'field_7 * 2',
                dependsOn: ['field_7']
              }
            },
            {
              id: 'field_13',
              type: 'richtext',
              label: 'Cover Letter',
              placeholder: 'Write your cover letter here...',
              required: false,
              width: 'full'
            },
            {
              id: 'field_14',
              type: 'textarea',
              label: 'Additional Comments',
              required: false,
              width: 'full',
              placeholder: 'Any additional information you\'d like to share...',
              validation: {
                maxLength: 500,
                customMessage: 'Comments must be under 500 characters'
              }
            }
          ];
          
          setInitialFields(sampleFields);
        } catch (error) {
          console.error('Error loading form:', error);
          setInitialFields([]);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadForm();
    } else {
      setIsLoading(false);
    }
  }, [isNew, resolvedParams.formId]);

  const handleSave = async (fields: FormField[], formName: string) => {
    console.log('Saving form:', { formName, fields, isResponsive });
    
    // Example API call:
    // const response = await fetch('/api/forms', {
    //   method: isNew ? 'POST' : 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     id: isNew ? undefined : resolvedParams.formId,
    //     name: formName, 
    //     fields, 
    //     isResponsive 
    //   })
    // });
  };

  // Mobile Preview Component
  const MobilePreview = () => {
    const sampleForm = {
      name: isNew ? (t('formBuilder.mobilePreview.newForm') || 'New Form') : (t('formBuilder.mobilePreview.contactForm') || 'Contact Form'),
      description: t('formBuilder.mobilePreview.description') || 'This is a preview of your form on mobile devices',
      fields: initialFields.length > 0 ? initialFields : [
        { id: '1', type: 'text' as const, label: t('formBuilder.mobilePreview.fields.name') || 'Name', required: true, placeholder: t('formBuilder.mobilePreview.placeholders.name') || 'Enter your name' },
        { id: '2', type: 'email' as const, label: t('formBuilder.mobilePreview.fields.email') || 'Email', required: true, placeholder: t('formBuilder.mobilePreview.placeholders.email') || 'Enter your email' },
        { id: '3', type: 'textarea' as const, label: t('formBuilder.mobilePreview.fields.message') || 'Message', required: false, placeholder: t('formBuilder.mobilePreview.placeholders.message') || 'Enter your message' },
      ]
    };

    return (
      <div className="min-h-screen p-4 space-y-6">
        {/* Desktop Recommendation Banner */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                  {t('formBuilder.mobilePreview.banner.title') || 'Form Building Works Best on Desktop'}
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {t('formBuilder.mobilePreview.banner.description') || 'You\'re viewing a mobile preview. For full editing capabilities, please use a desktop or laptop computer.'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Monitor className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {t('formBuilder.mobilePreview.banner.recommendation') || 'Recommended: Desktop or laptop (1024px+ screen)'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Preview */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {t('formBuilder.mobilePreview.previewLabel') || 'Mobile Preview'}
              </span>
            </div>
            <CardTitle className="text-xl">{sampleForm.name}</CardTitle>
            <p className="text-muted-foreground text-sm">{sampleForm.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleForm.fields.map((field: FormField) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[100px] resize-vertical text-sm"
                    disabled
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="text-sm"
                    disabled
                  />
                )}
              </div>
            ))}
            
            <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" disabled>
              {t('formBuilder.mobilePreview.submitButton') || 'Submit Form (Preview)'}
            </Button>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">{t('formBuilder.mobilePreview.whyDesktop.title') || 'Why Desktop?'}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t('formBuilder.mobilePreview.whyDesktop.dragDrop') || 'Drag-and-drop form building'}</li>
              <li>• {t('formBuilder.mobilePreview.whyDesktop.customization') || 'Advanced field customization'}</li>
              <li>• {t('formBuilder.mobilePreview.whyDesktop.panels') || 'Multiple panels and toolbars'}</li>
              <li>• {t('formBuilder.mobilePreview.whyDesktop.positioning') || 'Precise positioning and sizing'}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-8 max-w-full overflow-hidden">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('formBuilder.loading') || 'Loading form...'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show mobile preview on mobile devices
  if (isMobile) {
    return <MobilePreview />;
  }

  // Show full form builder on desktop
  return (
    <div className="min-h-screen">
      <ModernFormBuilder
        formId={isNew ? undefined : resolvedParams.formId}
        initialFields={initialFields}
        onSave={handleSave}
      />
    </div>
  );
} 