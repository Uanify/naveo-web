"use client";

import { RiLoader4Line } from "@remixicon/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Divider } from "@/components/ui/Divider";
import { CredentialsModal } from "@/components/drivers/CredentialsModal";
import { DriverFormProps, useDriverForm } from "@/hooks/useDriverForm";

export function DriverForm({ initialData }: DriverFormProps) {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    credentials,
    showCredentialsModal,
    handleCloseCredentialsModal,
    isEditing,
    router,
  } = useDriverForm({ initialData });

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 font-geist">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">
            Acceso a la App
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            El PIN se genera automáticamente en el servidor y no puede
            modificarse.
          </p>
        </div>

        <div className="sm:max-w-3xl md:col-span-2">
          <div className="max-w-xs">
            <Label
              htmlFor="pin"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              PIN
            </Label>

            <div className="mt-2">
              <Input
                id="pin"
                name="pin"
                type="text"
                value={isEditing ? formData.pin : "Se genera al guardar"}
                readOnly
                className="text-lg tracking-[0.3em] font-mono font-bold bg-gray-50 dark:bg-gray-900 cursor-not-allowed uppercase"
              />
            </div>

            <p className="mt-2 text-[11px] text-gray-400 italic">
              * Se muestra solo en edición o en el modal al crear el conductor.
            </p>
          </div>
        </div>
      </div>

      <Divider className="my-10" />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 font-geist">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">
            Perfil del Conductor
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Información operativa y de contacto.
          </p>
        </div>

        <div className="sm:max-w-3xl md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-4">
              <Label htmlFor="full_name" className="font-medium">
                Nombre completo
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Ej. Roberto Díaz"
                required
                className="mt-2"
              />
            </div>

            <div className="col-span-full sm:col-span-2">
              <Label htmlFor="phone" className="font-medium">
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="477 123 4567"
                className="mt-2"
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <Label htmlFor="vehicle_plate" className="font-medium">
                Placas / Unidad
              </Label>
              <Input
                id="vehicle_plate"
                name="vehicle_plate"
                value={formData.vehicle_plate}
                onChange={handleChange}
                placeholder="ABC-1234"
                className="mt-2 uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 flex items-center justify-end space-x-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="cursor-pointer"
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading && <RiLoader4Line className="size-4 animate-spin mr-2" />}
          {isEditing ? "Actualizar Conductor" : "Crear Conductor"}
        </Button>
      </div>

      {credentials && (
        <CredentialsModal
          fleetCode={credentials.fleetCode}
          pin={credentials.pin}
          isOpen={showCredentialsModal}
          onClose={handleCloseCredentialsModal}
        />
      )}
    </form>
  );
}
