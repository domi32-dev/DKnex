'use client';

import { ModernFormBuilder } from './modern-form-builder';
import { use, useState, useEffect } from 'react';

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
  
  const isNew = resolvedParams.formId === 'new';
  const isResponsive = resolvedSearchParams.responsive === 'true';
  const [initialFields, setInitialFields] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isLoading, setIsLoading] = useState(!isNew);

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
          const sampleFields = [
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
                conditions: [],
                action: 'show'
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

  const handleSave = async (fields: any[], formName: string) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernFormBuilder
      formId={isNew ? undefined : resolvedParams.formId}
      initialFields={initialFields}
      onSave={handleSave}
    />
  );
} 