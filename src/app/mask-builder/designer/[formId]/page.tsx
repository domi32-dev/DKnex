'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import FormBuilder from '@/components/mask-builder/FormBuilder';
import { Button } from '@/components/ui/button';

export default function DesignerPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params?.formId as string;
  const [formName] = useState('Form Designer'); // You can fetch the real name if needed

  // Optionally, fetch form data by formId here

  return (
    <div className="fixed inset-0 bg-background z-[10000] flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{formName} (ID: {formId})</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/mask-builder')}>
            Cancel
          </Button>
          <Button variant="default" onClick={() => {/* TODO: Save logic */}}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <FormBuilder onFormChange={() => {}} />
      </div>
    </div>
  );
} 