import AuthLayout from "@/components/layout/AuthLayout";
import { VerifyAccount } from "@/components/auth/verify-account";

export default function VerifyAccountPage() {
  return (
    <AuthLayout>
      <VerifyAccount />
    </AuthLayout>
  );
}
