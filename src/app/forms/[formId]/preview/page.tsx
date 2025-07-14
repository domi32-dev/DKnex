import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FormPreviewWrapper } from "@/components/form-builder/form-preview-wrapper";

interface PageProps {
  params: Promise<{
    formId: string;
  }>;
}

export async function generateMetadata({ params: _params }: { params: Promise<{ formId: string }> }) {
  return {
    title: `Form Preview | FormFlow`,
  };
}

export default function FormPreviewPage({ params }: PageProps) {
  return (
    <DashboardShell>
      <FormPreviewWrapper params={params} />
    </DashboardShell>
  );
} 