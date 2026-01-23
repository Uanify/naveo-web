"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FormCard, FormRow } from "@/components/profile/FormSettings";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { ProfileFormData } from "@/types/user";
import { CopyIcon } from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<ProfileFormData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    phone: "",
    email: "",
    role: "",
    company_id: "",
    business_name: "",
    fleet_code: "",
    wallet_balance: 0,
    subscription_active: false,
    subscription_expiry: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data } = await supabase
        .from("profiles")
        .select(
          `
          full_name, phone, role,
          companies (id, business_name, fleet_code, subscription_active, subscription_expiry, wallet_balance)
        `
        )
        .eq("id", user.id)
        .single();

      if (data) {
        const company = Array.isArray(data.companies)
          ? data.companies[0]
          : data.companies;

        const flattened = {
          full_name: data.full_name || "",
          phone: data.phone || "",
          email: user.email ?? "",
          role: data.role,
          company_id: company?.id,
          business_name: company?.business_name || "",
          fleet_code: company?.fleet_code || "N/A",
          wallet_balance: company?.wallet_balance || 0,
          subscription_active: company?.subscription_active,
          subscription_expiry: company?.subscription_expiry,
        };
        setInitialData(flattened);
        setFormData(flattened);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  // --- Lógica de cambios independiente ---
  const hasPersonalChanges = useMemo(() => {
    if (!initialData) return false;
    return (
      formData.full_name !== initialData.full_name ||
      formData.phone !== initialData.phone
    );
  }, [formData.full_name, formData.phone, initialData]);

  const hasAccountChanges = useMemo(() => {
    if (!initialData) return false;
    return formData.business_name !== initialData.business_name;
  }, [formData.business_name, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Funciones de guardado independientes ---
  const handleSavePersonal = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: formData.full_name, phone: formData.phone })
        .eq("id", user?.id);

      if (error) throw error;

      setInitialData((prev) =>
        prev
          ? { ...prev, full_name: formData.full_name, phone: formData.phone }
          : null
      );
      toast.success("Datos personales actualizados");
    } catch (e) {
      toast.error("Error al actualizar datos personales");
    }
  };

  const handleSaveAccount = async () => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({ business_name: formData.business_name })
        .eq("id", formData.company_id);

      if (error) throw error;

      setInitialData((prev) =>
        prev ? { ...prev, business_name: formData.business_name } : null
      );
      toast.success("Datos de la cuenta actualizados");
    } catch (e) {
      toast.error("Error al actualizar datos de la cuenta");
    }
  };

  const handleDisableAccount = async () => {
    const toastId = toast.loading("Deshabilitando cuenta...");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: false })
        .eq("id", initialData?.id);

      if (error) throw error;

      toast.success("Cuenta deshabilitada. Cerrando sesión...", {
        id: toastId,
      });

      await supabase.auth.signOut();

      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Error al deshabilitar la cuenta", {
        id: toastId,
      });
    }
  };

  const handleCopyFleetCode = () => {
    navigator.clipboard.writeText(formData.fleet_code);
    toast.success("Código de flotilla copiado");
  };

  if (loading)
    return <div className="p-20 text-center font-geist">Cargando...</div>;

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto pt-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-2xl">Perfil</h1>
        <p className="text-sm font-medium text-gray-500">
          Configura tu cuenta, ve información de tu suscripción y saldo.
        </p>
      </div>

      <div className="flex flex-col gap-12 mt-8 font-geist">
        <FormCard
          onSave={handleSavePersonal}
          onCancel={() =>
            initialData &&
            setFormData((prev) => ({
              ...prev,
              full_name: initialData.full_name,
              phone: initialData.phone,
            }))
          }
          title="Datos personales"
          showButtons={hasPersonalChanges}
        >
          <FormRow label="Nombre completo" description="Nombre en el sistema.">
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
            />
          </FormRow>
          <FormRow label="Email" description="No se puede cambiar el email.">
            <Input type="email" disabled value={formData.email} />
          </FormRow>
          <FormRow label="Teléfono" description="Contacto directo.">
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </FormRow>
        </FormCard>

        <FormCard
          onSave={handleSaveAccount}
          onCancel={() =>
            initialData &&
            setFormData((prev) => ({
              ...prev,
              business_name: initialData.business_name,
            }))
          }
          title="Datos de la cuenta"
          showButtons={hasAccountChanges}
        >
          <FormRow label="Rol" description="Tu nivel de acceso.">
            <Input value={formData.role} disabled className="capitalize" />
          </FormRow>
          <FormRow label="Compañía" description="Nombre legal de tu empresa.">
            <Input
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
            />
          </FormRow>
          <FormRow
            label="Número de flotilla"
            description="Código para choferes."
          >
            <div className="flex items-center gap-2">
              <Input
                value={formData.fleet_code}
                disabled
                className="font-mono"
              />
              <Button
                variant="ghost"
                onClick={handleCopyFleetCode}
                className="cursor-pointer flex items-center gap-2"
              >
                <CopyIcon className="size-4" />
                Copiar
              </Button>
            </div>
          </FormRow>
        </FormCard>

        {/* <FormCard
          title="Suscripción y Saldo"
          showButtons={false}
          description={
            <span>
              Si quieres añadir más saldo o gestionar tu suscripción, puedes
              hacerlo en la página de{" "}
              <Link
                href="/subscription-wallet"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Suscripción y saldo
              </Link>
            </span>
          }
        >
          <FormRow label="Estado" description="Estado de tu pago.">
            <Badge
              variant={formData.subscription_active ? "success" : "warning"}
            >
              {formData.subscription_active ? "Activa" : "Pendiente"}
            </Badge>
          </FormRow>
          <FormRow label="Saldo" description="Saldo para envíos.">
            <div className="font-medium text-base text-gray-900">
              ${(formData.wallet_balance ?? 0).toFixed(2)} MXN
            </div>
          </FormRow>
        </FormCard> */}

        {/* <FormCard
          title="Eliminar cuenta"
          variant="danger"
          showButtons={false}
          description="Elimine de forma permanente su cuenta y su información."
        >
          <FormRow
            label="Acción irreversible"
            description="Se borrarán todos los datos."
          >
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                className="cursor-pointer"
              >
                Eliminar cuenta
              </Button>
            </div>
          </FormRow>
        </FormCard> */}
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás completamente seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Escribe{" "}
              <span className="font-bold text-red-600">borrar</span> para
              confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Escribe 'borrar' aquí"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== "borrar"}
              onClick={handleDisableAccount}
              className="cursor-pointer"
            >
              Confirmar eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
