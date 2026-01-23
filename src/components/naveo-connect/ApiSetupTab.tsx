"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RiFileCopyLine,
  RiEyeLine,
  RiEyeOffLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { FormCard, FormRow } from "../profile/FormSettings";

export function ApiSetupTab() {
  const supabase = createClient();
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);


  const baseUrl = `https://xjhnzysfnoahsjirdxdn.supabase.co/functions/v1`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  // 1. CARGAR DATOS INICIALES
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener la API Key más reciente
      const { data: keyData } = await supabase
        .from("api_keys")
        .select("key_value")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (keyData) setApiKey(keyData.key_value);

    } catch (error) {
      console.error("Error cargando Naveo Connect:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. GENERAR NUEVA API KEY
  const handleGenerateKey = async () => {
    setIsGenerating(true);
    const newKey = `nv_live_${crypto.randomUUID().replace(/-/g, "")}`;

    try {
      // Obtenemos el company_id del usuario actual (asumiendo que tienes una función o helper)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user?.id)
        .single();

      const { error } = await supabase.from("api_keys").insert({
        company_id: profile?.company_id,
        key_value: newKey,
        label: "Generada desde el Panel Web",
      });

      if (error) throw error;

      setApiKey(newKey);
      toast.success("Nueva API Key generada. Actualiza tus sistemas externos.");
    } catch (e) {
      toast.error("Error al generar la llave");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Cargando configuración...
      </div>
    );

  return (
    <div className="flex flex-col gap-12 font-geist">
      {/* TARJETA 1: ENDPOINTS */}
      <FormCard
        title="Endpoints de la API"
        description="Utiliza estas URLs en tu sistema externo para enviar datos a Naveo."
        showButtons={false}
      >
        <FormRow
          label="Recibir Pedidos"
          description="Endpoint para el método POST de incoming-order."
        >
          <div className="flex items-center gap-2">
            <Input
              value={`${baseUrl}/incoming-order`}
              disabled
              className="font-mono text-xs bg-gray-50"
            />
            <Button
              variant="ghost"
              onClick={() =>
                handleCopy(`${baseUrl}/incoming-order`, "Endpoint de pedidos")
              }
              className="cursor-pointer shrink-0"
              type="button"
            >
              <RiFileCopyLine className="size-4 text-gray-500" />
            </Button>
          </div>
        </FormRow>

        <FormRow
          label="Sincronizar Sucursales"
          description="Endpoint para el método POST de sync-branches."
        >
          <div className="flex items-center gap-2">
            <Input
              value={`${baseUrl}/sync-branches`}
              disabled
              className="font-mono text-xs bg-gray-50"
            />
            <Button
              variant="ghost"
              onClick={() =>
                handleCopy(`${baseUrl}/sync-branches`, "Endpoint de sucursales")
              }
              className="cursor-pointer shrink-0"
              type="button"
            >
              <RiFileCopyLine className="size-4 text-gray-500" />
            </Button>
          </div>
        </FormRow>
      </FormCard>

      {/* TARJETA 2: API KEY */}
      <FormCard
        title="Llaves de API"
        saveLabel="Generar nueva llave"
        onSave={handleGenerateKey}
        isPending={isGenerating}
      >
        <FormRow label="API Key Activa" description="Header 'x-api-key'.">
          <div className="flex items-center gap-2">
            <Input
              type={showKey ? "text" : "password"}
              value={apiKey || "Sin llave activa"}
              readOnly
              className="font-mono"
            />
            <Button
              variant="ghost"
              onClick={() => setShowKey(!showKey)}
              className="cursor-pointer"
            >
              {showKey ? (
                <RiEyeOffLine className="size-4" />
              ) : (
                <RiEyeLine className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                toast.success("Copiado");
              }}
              className="cursor-pointer"
            >
              <RiFileCopyLine className="size-4" />
            </Button>
          </div>
        </FormRow>
      </FormCard>
    </div>
  );
}
