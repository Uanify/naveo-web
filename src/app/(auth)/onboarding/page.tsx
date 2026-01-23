import { OnboardingForm } from "@/components/auth/onboarding-form";
import AuthLayout from "@/components/layout/AuthLayout";

export default function OnboardingPage() {
  return (
    <AuthLayout>
      <OnboardingForm />
    </AuthLayout>
  );
}
