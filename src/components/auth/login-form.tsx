"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Callout } from "@/components/ui/Callout";

import { RiErrorWarningFill } from "@remixicon/react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
    } else {
      router.push("/orders");
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(translateAuthError(error.message));
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-2 mb-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          Inicia sesión en tu cuenta
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completa los siguientes campos para iniciar sesión
        </p>
      </div>
      {/* TODO: Descomentar en futuras versiones */}
      {/* <div className="flex flex-col gap-4">
        <Button
          variant="secondary"
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 cursor-pointer"
        >
          <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
          <span>Iniciar sesión con Google</span>
        </Button>

        <div className="flex items-center gap-4 my-2">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          <span className="text-xs text-gray-400 uppercase font-medium">o</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>
      </div> */}

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <Callout
            variant="error"
            title="Error de inicio de sesión"
            icon={RiErrorWarningFill}
          >
            {error}
          </Callout>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
            isLoading={loading}
            loadingText="Iniciando sesión..."
          >
            Iniciar sesión
          </Button>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
