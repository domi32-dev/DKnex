'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Edit, 
  Play, 
  Monitor, 
  Tablet, 
  Smartphone 
} from 'lucide-react';
import { FormField } from '../types';
import { FieldRenderer } from './field-renderer';
import { groupFieldsIntoRows, getFieldWidthClass } from '../utils';

interface PreviewModeProps {
  formName: string;
  fields: FormField[];
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  onExitPreview: () => void;
}

export function PreviewMode({
  formName,
  fields,
  previewDevice,
  setPreviewDevice,
  onExitPreview
}: PreviewModeProps) {
  const deviceClasses = {
    desktop: 'max-w-4xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm'
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
              <CardTitle className="text-3xl font-bold text-center">
                {formName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-8">
              {groupFieldsIntoRows(fields).map((row, rowIndex) => (
                <div key={`preview-row-${rowIndex}`} className="flex flex-wrap -mr-2">
                  {row.map((field) => (
                    <div key={field.id} className={`${getFieldWidthClass(field.width)} mb-4`}>
                      <div className="space-y-3">
                        {!['heading', 'paragraph', 'divider'].includes(field.type) && (
                          <Label className="text-base font-semibold text-foreground block">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-2">*</span>}
                          </Label>
                        )}
                        <FieldRenderer field={field} isPreview={true} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              <Button className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white">
                Submit Form
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 