"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError, validatePassword } from "@/lib/auth-errors";
import { cx } from "@/lib/utils";

// Tremor Raw Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Callout } from "@/components/ui/Callout";

// Icons
import {
  RiErrorWarningFill,
  RiCheckboxCircleFill,
  RiCheckLine,
} from "@remixicon/react";

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const { isValid, message: setupPwdMsg } = validatePassword(password);
    if (!isValid) {
      setError(setupPwdMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
    } else {
      router.push("/verify-account");
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
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

  return (
    <div className="flex flex-col max-w-sm mx-auto w-full">
      <div className="text-center flex flex-col gap-2 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          Crea tu cuenta en Naveo
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Introduce tus datos para crear tu cuenta.
        </p>
      </div>

      {/* TODO: Descomentar en futuras versiones */}
      {/* <div className="flex flex-col gap-4">
        <Button
          variant="secondary"
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2"
        >
          <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
          <span>Registrarse con Google</span>
        </Button>

        <div className="flex items-center gap-4 my-2">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          <span className="text-xs text-gray-400 uppercase font-medium">o</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>
      </div> */}

      <form onSubmit={handleSignUp} className="space-y-4">
        {error && (
          <Callout
            variant="error"
            title="Error al registrarse"
            icon={RiErrorWarningFill}
          >
            {error}
          </Callout>
        )}

        {message && (
          <Callout
            variant="success"
            title="Cuenta creada"
            icon={RiCheckboxCircleFill}
          >
            {message}
          </Callout>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Juan Pérez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full"
          />
        </div>

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
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full"
          />

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

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
            isLoading={loading}
            loadingText="Creando cuenta..."
          >
            Crear cuenta
          </Button>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
