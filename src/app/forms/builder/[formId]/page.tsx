import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FormBuilderWrapper } from "@/components/form-builder/form-builder-wrapper";

interface PageProps {
  params: Promise<{
    formId: string;
  }>;
  searchParams: Promise<{
    responsive?: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ formId: string }> }) {
  const resolvedParams = await params;
  const isNew = resolvedParams.formId === 'new';
  return {
    title: isNew ? "Create New Form | FormFlow" : "Edit Form | FormFlow",
  };
}

export default function FormBuilderPage({ params, searchParams }: PageProps) {
  return (
    <DashboardShell>
      <div className="w-full max-w-none">
        <FormBuilderWrapper params={params} searchParams={searchParams} />
      </div>
    </DashboardShell>
  );
} 