import { SignUpForm } from "@/components/auth/sign-up-form";
import AuthLayout from "@/components/layout/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
