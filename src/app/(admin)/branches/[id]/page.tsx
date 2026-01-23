import { BranchForm } from "@/components/branches/BranchForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface EditBranchPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBranchPage({ params }: EditBranchPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: branch, error } = await supabase
    .from("branches")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !branch) {
    console.error("Error fetching branch or not found:", error);
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-800">Editar Sucursal</h1>
        <p className="text-sm text-gray-600">
          Modifica los detalles de la sucursal.
        </p>
      </div>

      <div>
        <BranchForm initialData={branch} />
      </div>
    </div>
  );
}
