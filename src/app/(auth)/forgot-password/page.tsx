import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import AuthLayout from "@/components/layout/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
