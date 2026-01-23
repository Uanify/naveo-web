"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError, validatePassword } from "@/lib/auth-errors";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Callout } from "@/components/ui/Callout";

import { RiErrorWarningFill, RiCheckLine } from "@remixicon/react";
import { cx } from "@/lib/utils";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const passwordReqs = [
    { label: "8+ caracteres", met: password.length >= 8 },
    { label: "Mayúscula", met: /[A-Z]/.test(password) },
    { label: "Minúscula", met: /[a-z]/.test(password) },
    { label: "Número", met: /[0-9]/.test(password) },
    {
      label: "Carácter especial",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const { isValid, message: pwdMsg } = validatePassword(password);
    if (!isValid) {
      setError(pwdMsg);
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
    } else {
      router.push("/orders");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-sm w-full">
      <div className="flex flex-col text-center gap-2 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          Restablecer contraseña
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Introduce tu nueva contraseña y confirma que sea la misma.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        {error && (
          <Callout
            variant="error"
            title="Error de validación"
            icon={RiErrorWarningFill}
          >
            {error}
          </Callout>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full"
          />

          {/* Password Requirements Grid */}
          {password.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2">
              {passwordReqs.map((req, i) => (
                <div
                  key={i}
                  className={cx(
                    "flex items-center gap-1.5 text-xs transition-colors",
                    req.met
                      ? "text-emerald-600 dark:text-emerald-500"
                      : "text-gray-400 dark:text-gray-600"
                  )}
                >
                  {req.met ? (
                    <RiCheckLine className="size-3.5 shrink-0" />
                  ) : (
                    <div className="size-1 rounded-full bg-current ml-1.5 mr-1" />
                  )}
                  {req.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
          isLoading={loading}
          loadingText="Restableciendo..."
        >
          Restablecer contraseña
        </Button>
      </form>
    </div>
  );
}
