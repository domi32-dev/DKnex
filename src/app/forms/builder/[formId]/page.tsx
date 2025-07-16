import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FormBuilderWrapper } from "@/components/form-builder/form-builder-wrapper";
import { AuroraBackground } from "@/components/ui/aurora-background";

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
      <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
      <div className="relative z-10">
        <FormBuilderWrapper params={params} searchParams={searchParams} />
      </div>
    </DashboardShell>
  );
} 