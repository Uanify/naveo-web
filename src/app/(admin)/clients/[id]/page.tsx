import { ClientForm } from "@/components/clients/ClientForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !client) {
    console.error("Error fetching client or not found:", error);
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-800">Editar Cliente</h1>
        <p className="text-sm text-gray-600">
          Modifica los detalles del cliente.
        </p>
      </div>

      <div>
        <ClientForm initialData={client} />
      </div>
    </div>
  );
}
