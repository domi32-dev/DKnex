'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { use } from 'react';

interface FormPreviewWrapperProps {
  params: Promise<{
    formId: string;
  }>;
}

export function FormPreviewWrapper({ params }: FormPreviewWrapperProps) {
  const resolvedParams = use(params);

  // In a real app, you would fetch the form data here
  const sampleForm = {
    id: resolvedParams.formId,
    name: "Contact Form",
    description: "Get in touch with us",
    fields: [
      {
        id: "1",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "Enter your full name"
      },
      {
        id: "2", 
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "Enter your email"
      },
      {
        id: "3",
        type: "textarea",
        label: "Message",
        required: true,
        placeholder: "Tell us how we can help"
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/forms">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{sampleForm.name} - Preview</h1>
            <p className="text-muted-foreground">This is how your form will appear to users</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Live Preview
          </Button>
                     <Link href={`/forms/builder/${resolvedParams.formId}`}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Edit Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Form Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Desktop Preview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Desktop View</h2>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{sampleForm.name}</CardTitle>
              <p className="text-muted-foreground">{sampleForm.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {sampleForm.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[100px] resize-vertical"
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
                             <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Submit Form
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Preview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Mobile View</h2>
          <div className="max-w-sm mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{sampleForm.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{sampleForm.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleForm.fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <Label htmlFor={`mobile-${field.id}`} className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={`mobile-${field.id}`}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[80px] resize-vertical text-sm"
                      />
                    ) : (
                      <Input
                        id={`mobile-${field.id}`}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="text-sm"
                      />
                    )}
                  </div>
                ))}
                                 <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm text-white">
                  Submit Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Form Details</h4>
              <p className="text-muted-foreground">ID: {sampleForm.id}</p>
              <p className="text-muted-foreground">Fields: {sampleForm.fields.length}</p>
              <p className="text-muted-foreground">Required Fields: {sampleForm.fields.filter(f => f.required).length}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Submission Settings</h4>
              <p className="text-muted-foreground">Email notifications: Enabled</p>
              <p className="text-muted-foreground">Auto-response: Disabled</p>
              <p className="text-muted-foreground">Captcha: Disabled</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Styling</h4>
              <p className="text-muted-foreground">Theme: Default</p>
              <p className="text-muted-foreground">Responsive: Yes</p>
              <p className="text-muted-foreground">Custom CSS: None</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 