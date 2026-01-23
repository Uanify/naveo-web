"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Tremor Raw Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Callout } from "@/components/ui/Callout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { RiErrorWarningFill } from "@remixicon/react";

export function OnboardingForm() {
  const [companyName, setCompanyName] = useState("");
  const [countryCode, setCountryCode] = useState("+52");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      // Step 1: Create/Update company using upsert to avoid conflicts
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .upsert(
          {
            business_name: companyName,
            admin_email: user.email,
            subscription_active: false,
          },
          { onConflict: "admin_email" }
        )
        .select()
        .single();

      if (companyError) throw companyError;

      // Step 2: Link user profile with the new company
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          company_id: company.id,
          role: "admin",
          phone: `${countryCode}${phoneNumber}`,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Redirect to dashboard on success
      window.location.href = "/orders";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm w-full">
      <div className="flex flex-col text-center gap-2 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          Completa tu perfil
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Necesitamos unos últimos detalles antes de comenzar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Callout
            variant="error"
            title="Error de configuración"
            icon={RiErrorWarningFill}
          >
            {error}
          </Callout>
        )}
        <div className="space-y-2">
          <Label htmlFor="companyName">Nombre de la empresa</Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Mi Empresa S.A."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Número de teléfono</Label>
          <div className="flex gap-2">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+52">🇲🇽 +52</SelectItem>
                <SelectItem value="+1">🇺🇸 +1</SelectItem>
                <SelectItem value="+34">🇪🇸 +34</SelectItem>
                <SelectItem value="+57">🇨🇴 +57</SelectItem>
                <SelectItem value="+54">🇦🇷 +54</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="4771234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="flex-1"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            isLoading={loading}
            loadingText="Guardando..."
            className="w-full cursor-pointer"
          >
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}
