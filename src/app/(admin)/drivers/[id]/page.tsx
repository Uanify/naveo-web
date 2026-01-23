import { DriverForm } from "@/components/drivers/DriverForm";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";

interface EditDriverPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDriverPage({ params }: EditDriverPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const adminAuth = createAdminClient();

  const { data: driver, error } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
        phone,
        driver_details (
          vehicle_plate,
          pin
        )
      `,
    )
    .eq("id", id)
    .single();

  if (error || !driver) {
    console.error("Error fetching driver or not found:", error);
    notFound();
  }

  // Auth email (solo lectura)
  const {
    data: { user },
  } = await adminAuth.auth.admin.getUserById(id);
  const email = user?.email || "No disponible";

  const detailsRaw = (driver as any).driver_details;
  const details = Array.isArray(detailsRaw) ? detailsRaw[0] : detailsRaw;

  const formattedData = {
    id: driver.id,
    full_name: driver.full_name ?? "",
    phone: driver.phone ?? "",
    vehicle_plate: details?.vehicle_plate ?? "",
    pin: details?.pin ?? "",
    // email si lo quieres mostrar luego en el form, agrégalo aquí
  };

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-800">
          Editar Conductor
        </h1>
        <p className="text-sm text-gray-600">
          Modifica los detalles del conductor. El correo no se puede cambiar
          aquí.
        </p>
        <p className="text-xs text-gray-400">Email: {email}</p>
      </div>

      <DriverForm initialData={formattedData} />
    </div>
  );
}
