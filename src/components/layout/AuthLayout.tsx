import Image from "next/image";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-svh flex flex-col items-center justify-between py-12 px-4">
      <div>
        <Image src="/naveo-logo.svg" alt="Logo" width={100} height={100} />
      </div>
      <div className="w-full flex justify-center max-w-sm md:max-w-3xl">
        {children}
      </div>
      <div className="w-full flex justify-center">
        <p className="text-gray-500 text-sm">© 2026 Naveo MX</p>
      </div>
    </div>
  );
}

export default AuthLayout;
