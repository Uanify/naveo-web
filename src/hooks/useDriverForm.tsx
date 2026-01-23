import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createDriver, updateDriver } from "@/lib/actions/drivers";

export interface DriverFormData {
  id?: string;
  full_name: string;
  phone: string;
  vehicle_plate: string;
  pin: string;
}

export interface DriverFormProps {
  initialData: Partial<DriverFormData>;
}

export function useDriverForm({ initialData }: DriverFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{
    fleetCode: string;
    pin: string;
  } | null>(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  const generateAlphaNumericPIN = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  const [formData, setFormData] = useState<DriverFormData>({
    full_name: "",
    phone: "",
    vehicle_plate: "",
    pin: initialData.pin || generateAlphaNumericPIN(),
    ...initialData,
  });

  const isEditing = !!initialData.id;

  const normalizedInitial = {
    id: initialData.id,
    full_name: initialData.full_name ?? "",
    phone: initialData.phone ?? "",
    vehicle_plate: initialData.vehicle_plate ?? "",
    pin: initialData.pin ?? "",
  };

  useEffect(() => {
    if (initialData.id) {
      setFormData((prev) => ({ ...prev, ...normalizedInitial }));
    }
  }, [initialData]);

  const handleRefreshPIN = () => {
    setFormData((prev) => ({ ...prev, pin: generateAlphaNumericPIN() }));
    toast.info("Nuevo PIN generado");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && formData.id) {
        await updateDriver(formData.id, formData);
        toast.success("Conductor actualizado con éxito");
        router.push("/drivers");
        router.refresh();
      } else {
        const result = await createDriver(formData);
        toast.success("Conductor creado con éxito");

        setCredentials({
          fleetCode: result.fleetCode,
          pin: formData.pin,
        });
        setShowCredentialsModal(true);
      }
    } catch (error: any) {
      console.error("Error saving driver:", error);
      toast.error(error.message || "Error al guardar el conductor");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCredentialsModal = () => {
    setShowCredentialsModal(false);
    router.push("/drivers");
    router.refresh();
  };
  return {
    formData,
    handleChange,
    handleSubmit,
    handleRefreshPIN,
    loading,
    credentials,
    showCredentialsModal,
    handleCloseCredentialsModal,
    isEditing,
    router,
  };
}
