import { Sidebar } from "@/components/layout/navigation/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `
      full_name,
      role,
      companies (
        business_name
      )
    `,
    )
    .eq("id", user.id)
    .single();

  const userData = {
    fullName: profile?.full_name || "Usuario",
    email: user.email || "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    companyName: (profile?.companies as any)?.business_name || "Naveo MX",
    avatarUrl: user.user_metadata?.avatar_url || null,
  };

  return (
    <div
      className="overflow-y-scroll scroll-auto antialiased selection:bg-blue-100 selection:text-blue-700 dark:bg-gray-950"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-screen-2xl">
        <Sidebar userData={userData} />

        <div className="relative">
          <div className="p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
            <main className="lg:pl-72">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
