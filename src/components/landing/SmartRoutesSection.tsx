import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SmartRoutesSection() {
  return (
    <section
      id="features"
      className="w-full flex items-center justify-center bg-[#FFFFFF] min-h-screen md:h-screen py-20 md:py-0"
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between px-6 md:px-0 gap-12 md:gap-0">
        <div className="flex flex-col gap-6 max-w-xl justify-center">
          <h1 className="text-4xl md:text-6xl font-medium leading-tight text-black">
            Rutas inteligentes, <br className="hidden md:block" /> seguras y
            eficientes.
          </h1>
          <p className="text-lg max-w-md text-[#525151]">
            Asigna pedidos en segundos, optimiza los trayectos de tus unidades y
            mantén informados a tus clientes automáticamente.
          </p>
          <Link
            href="https://wa.me/524774122683?text=Hola!%20Me%20gustaría%20agendar%20una%20demo%20de%20Naveo"
            target="_blank"
            className="bg-black text-white pr-4 pl-6 py-2.5 rounded-full font-semibold flex items-center gap-2 w-fit hover:bg-gray-900 transition-colors shadow-lg active:scale-95"
          >
            Agendar demo
            <ChevronRight />
          </Link>
        </div>
        <div className="flex justify-center md:justify-end items-center md:items-start w-full md:w-auto overflow-hidden">
          <div className="relative h-[500px] w-full max-w-[500px] md:h-[674px] md:w-[430px] md:max-w-none">
            <Image
              src="/banner-2-naveo.png"
              alt="banner naveo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
