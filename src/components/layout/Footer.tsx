import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-12 pb-12">
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col h-full justify-between">
        {/* Top Links */}
        <div className="flex flex-col md:flex-row justify-between items-start w-full gap-12 mb-12">
          <div className="flex flex-col gap-6 text-sm font-medium text-gray-300">
            <a
              href="/terms-conditions"
              className="hover:text-white transition-colors"
            >
              Términos y Condiciones
            </a>
            <a
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Políticas de Privacidad
            </a>
          </div>
          <div className="flex flex-col gap-6 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white transition-colors">
              X (Twitter)
            </a>
            <a
              href="mailto:info@naveo.mx"
              className="hover:text-white transition-colors"
            >
              info@naveo.mx
            </a>
          </div>
        </div>

        {/* Bottom Logo & Copyright */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-8 md:gap-0">
          {/* Big Logo Container */}
          <div className="relative w-full max-w-xl h-20 md:h-32">
            <Image
              src="/naveo-logo.svg"
              alt="naveo"
              fill
              className="object-contain object-left invert"
            />
          </div>

          <div className="text-sm text-gray-400 whitespace-nowrap md:mb-4">
            © 2026 Naveo MX
          </div>
        </div>
      </div>
    </footer>
  );
}
