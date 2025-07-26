'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Edit, 
  Play, 
  Monitor, 
  Tablet, 
  Smartphone,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X
} from 'lucide-react';
import { FormField, FormPage, CustomFieldType } from '../types';
import { FieldRenderer } from './field-renderer';
import { groupFieldsIntoRows, getFieldWidthClass, getVisibleFields } from '../utils';

interface PreviewModeProps {
  formName: string;
  fields: FormField[];
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  onExitPreview: () => void;
  isMultiStep?: boolean;
  pages?: FormPage[];
  customFieldTypes?: CustomFieldType[];
}

export function PreviewMode({
  formName,
  fields,
  previewDevice,
  setPreviewDevice,
  onExitPreview,
  isMultiStep = false,
  pages = [],
  customFieldTypes = []
}: PreviewModeProps) {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(
    isMultiStep && pages.length > 0 ? pages[0].id : ''
  );
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const deviceClasses = {
    desktop: 'max-w-4xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm'
  };

  // Get fields for current page with conditional logic
  const getCurrentPageFields = () => {
    let pageFields = fields;
    
    // Filter by page if multi-step
    if (isMultiStep) {
      pageFields = fields.filter(field => field.pageId === currentPreviewPage);
    }
    
    // Apply conditional logic to determine visible fields
    return getVisibleFields(pageFields, formValues);
  };

  // Get current page info
  const getCurrentPage = () => {
    if (!isMultiStep) return null;
    return pages.find(page => page.id === currentPreviewPage);
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (!isMultiStep) return;
    const currentIndex = pages.findIndex(page => page.id === currentPreviewPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPreviewPage(pages[currentIndex + 1].id);
    }
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (!isMultiStep) return;
    const currentIndex = pages.findIndex(page => page.id === currentPreviewPage);
    if (currentIndex > 0) {
      setCurrentPreviewPage(pages[currentIndex - 1].id);
    }
  };

  const isFirstPage = () => {
    if (!isMultiStep) return true;
    return pages.findIndex(page => page.id === currentPreviewPage) === 0;
  };

  const isLastPage = () => {
    if (!isMultiStep) return true;
    return pages.findIndex(page => page.id === currentPreviewPage) === pages.length - 1;
  };

  // Handle form value changes
  const handleFormValueChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Validate required fields on current page
  const validateCurrentPage = () => {
    const currentFields = getCurrentPageFields();
    const requiredFields = currentFields.filter(field => field.required);
    
    for (const field of requiredFields) {
      const value = formValues[field.id];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateCurrentPage()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would typically send to your backend
      const submissionData = {
        formName,
        formValues,
        submittedAt: new Date().toISOString(),
        pages: isMultiStep ? pages : undefined
      };

      console.log('Form submitted:', submissionData);
      
      // You could send to an API here:
      // const response = await fetch('/api/forms/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submissionData)
      // });

      setSubmitStatus('success');
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-6 border-b bg-card sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">{formName}</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Play className="w-3 h-3 mr-1" />
            Preview Mode
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Device Toggle */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={onExitPreview}
            variant="outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="py-12">
        <div className={`mx-auto px-6 ${deviceClasses[previewDevice]}`}>
          <Card className="shadow-lg">
            <CardHeader className="pb-8">
              <div className="text-center">
                <CardTitle className="text-3xl font-bold mb-2">
                  {formName}
                </CardTitle>
                {isMultiStep && (
                  <div className="flex items-center justify-center space-x-4">
                    <Badge variant="outline" className="text-sm">
                      Page {pages.findIndex(p => p.id === currentPreviewPage) + 1} of {pages.length}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      {getCurrentPage()?.title}
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-8">
              {groupFieldsIntoRows(getCurrentPageFields()).map((row, rowIndex) => (
                <div key={`preview-row-${rowIndex}`} className="flex flex-wrap -mr-2">
                  {row.map((field) => (
                    <div key={field.id} className={`${getFieldWidthClass(field.width)} mb-4`}>
                      <div className="space-y-3">
                                                 {!['heading', 'paragraph', 'divider', 'custom'].includes(field.type) && (
                           <Label className="text-base font-semibold text-foreground block">
                             {field.label}
                             {field.required && <span className="text-red-500 ml-2">*</span>}
                           </Label>
                         )}
                        <FieldRenderer 
                          field={field} 
                          isPreview={true} 
                          formValues={formValues}
                          onValueChange={handleFormValueChange}
                          customFieldTypes={customFieldTypes} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              {/* Multi-step Navigation or Submit */}
              {isMultiStep ? (
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={goToPreviousPage}
                    disabled={isFirstPage()}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    {pages.map((page, index) => (
                      <div
                        key={page.id}
                        className={`w-3 h-3 rounded-full ${
                          page.id === currentPreviewPage
                            ? 'bg-blue-600'
                            : index < pages.findIndex(p => p.id === currentPreviewPage)
                            ? 'bg-green-600'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {isLastPage() ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white flex items-center gap-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (validateCurrentPage()) {
                          goToNextPage();
                        } else {
                          alert('Please fill in all required fields before continuing.');
                        }
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </Button>
              )}

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Form submitted successfully!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">Thank you for your submission. Your response has been recorded.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">Submission failed</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">There was an error submitting your form. Please try again.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 