import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="w-full flex items-center justify-center bg-[#FBFAF9] min-h-screen md:h-[90vh] py-20 md:py-0"
    >
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 justify-between px-6 md:px-0">
        <div className="flex flex-col gap-6 max-w-xl lg:max-w-[416px] justify-center">
          <h1 className="text-4xl md:text-5xl font-medium leading-tight text-black">
            Paga solo por lo que usas, sin sorpresas a fin de mes.
          </h1>
          <p className="text-lg max-w-md text-[#525151]">
            Naveo tiene un plan claro y transparente, sin contratos forzosos.
            Paga una suscripción fija y solo recarga el saldo que tu operación
            necesite para los mapas y el rastreo.
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
        <div className="flex flex-col sm:flex-row justify-center gap-5 items-center flex-1 w-full">
          <div className="flex flex-col gap-6 bg-white p-6 pt-10 rounded-2xl border min-h-[456px] border-[#E9E9E9] w-full sm:w-1/2 lg:w-auto">
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-medium">
                $1,800.00 MXN{" "}
                <span className="text-[#525151] text-lg">/mes</span>
              </p>
              <p className="text-sm text-[#525151]">
                + Saldo para mapas y notificaciones ($1-$3 MXN por viaje)
              </p>
            </div>
            <ul className="flex flex-col gap-5 text-sm md:text-base">
              <li>✓ Plataforma Web de Administración</li>
              <li>✓ App Móvil para Choferes (Android/iOS)</li>
              <li>✓ Optimización de Rutas Inteligente</li>
              <li>✓ Rastreo Web para Clientes Finales</li>
              <li>✓ Soporte Técnico Prioritario</li>
              <li>✓ Usuarios y Sucursales Ilimitados</li>
            </ul>
          </div>
          <div className="flex flex-col gap-6 bg-white p-6 pt-10 rounded-2xl border min-h-[456px] border-[#E9E9E9] w-full sm:w-1/2 lg:w-auto">
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-medium">Prueba piloto</p>
              <p className="text-sm text-[#525151]">
                Valida el sistema con datos reales
              </p>
            </div>
            <ul className="flex flex-col gap-5 text-sm md:text-base">
              <li>✓ Todas las funciones del plan de pago</li>
              <li>✓ Acceso total por 15 días</li>
              <li>✓ Hasta 5 unidades conectadas</li>
              <li>✓ Incluye $100 MXN de saldo inicial</li>
              <li>✓ Sin compromiso de compra</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
