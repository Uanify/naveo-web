import AuthLayout from "@/components/layout/AuthLayout";
import { VerifyNewPassword } from "@/components/auth/verify-new-password";

export default function VerifyNewPasswordPage() {
  return (
    <AuthLayout>
      <VerifyNewPassword />
    </AuthLayout>
  );
}
