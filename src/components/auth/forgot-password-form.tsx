"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { translateAuthError } from "@/lib/auth-errors";

// Importación de tus componentes Tremor Raw
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { Callout } from "../ui/Callout";

// Iconos (opcionales, usualmente usados en los bloques de Tremor)
import { RiErrorWarningFill, RiCheckboxCircleFill } from "@remixicon/react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
    } else {
      router.push("/verify-new-password");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex flex-col gap-2 text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          Recuperar contraseña
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Introduce tu correo electrónico para recibir un enlace de
          restablecimiento.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        {error && (
          <Callout
            variant="error"
            title="Hubo un error"
            icon={RiErrorWarningFill}
          >
            {error}
          </Callout>
        )}

        {message && (
          <Callout
            variant="success"
            title="Correo enviado"
            icon={RiCheckboxCircleFill}
          >
            {message}
          </Callout>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
          isLoading={loading}
          loadingText="Enviando..."
        >
          Enviar enlace de recuperación
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Recordaste tu contraseña?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
