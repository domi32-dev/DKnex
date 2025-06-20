'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import FormBuilder from '@/components/mask-builder/FormBuilder';
import { Button } from '@/components/ui/button';

export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params?.formId as string;
  const [formName] = useState(formId === 'new' ? 'New Form' : `Form ${formId}`);

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving form...');
  };

  const handleCancel = () => {
    router.push('/forms');
  };

  return (
    <div className="fixed inset-0 bg-background z-[10000] flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{formName}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Save Form
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <FormBuilder onFormChange={() => {}} />
      </div>
    </div>
  );
} 