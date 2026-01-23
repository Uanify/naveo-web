import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/Navbar";

export default function TermsConditions() {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl pt-32 md:pt-[180px] mx-auto px-6 py-12 font-sans text-slate-800">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Última actualización: 2 de enero de 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            1. Aceptación de los Términos
          </h2>
          <p className="leading-relaxed">
            Al acceder y utilizar la plataforma Naveo, usted acepta cumplir y
            estar sujeto a los siguientes términos y condiciones. Si no está de
            acuerdo con alguna parte de estos términos, no podrá utilizar
            nuestros servicios de gestión logística.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            2. Descripción del Servicio
          </h2>
          <p className="leading-relaxed">
            Naveo proporciona una plataforma de software como servicio (SaaS)
            para la optimización de logística de última milla. Actuamos como un
            centro de mando que conecta sucursales, conductores y clientes
            finales mediante herramientas de rastreo en tiempo real, cálculo de
            rutas y gestión de inventario en tránsito. Naveo{" "}
            <strong>no es una empresa de transporte</strong> ni un empleador de
            repartidores; somos el proveedor tecnológico de la operación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            3. Registro y Uso de Cuentas
          </h2>
          <p className="mb-4">
            Para utilizar Naveo, las empresas y conductores deben registrarse y
            mantener una cuenta activa. Usted es responsable de:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
            <li>
              Toda la actividad que ocurra bajo su cuenta de administrador o
              repartidor.
            </li>
            <li>
              Garantizar que la información proporcionada (direcciones,
              teléfonos, nombres) sea precisa y actualizada.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            4. Tarifas y Pagos
          </h2>
          <p className="mb-4">
            El uso de Naveo está sujeto a tarifas por transacción de envío
            basadas en la distancia real recorrida, calculada mediante nuestra
            integración con Mapbox:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Tarifa Base:</strong> Se aplicará un cargo automático al
              generar cada envío según el tabulador de distancia vigente ($1.00,
              $2.00 o $3.00 USD según corresponda).
            </li>
            <li>
              <strong>Saldos:</strong> El sistema opera bajo un modelo de saldo
              prepagado o facturación mensual, según el plan contratado.
            </li>
            <li>
              <strong>Reembolsos:</strong> Los envíos generados y procesados por
              el sistema no son sujetos a reembolso una vez que la ruta ha sido
              iniciada por el conductor.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            5. Uso de Herramientas de Navegación
          </h2>
          <p className="leading-relaxed">
            Las funciones de navegación y mapas son proporcionadas por Mapbox.
            Aunque buscamos la máxima precisión, Naveo no se hace responsable
            por retrasos derivados de información de tráfico incorrecta, cierres
            viales o errores en el sistema GPS del dispositivo móvil del
            conductor. El conductor debe siempre priorizar la seguridad vial y
            las leyes de tránsito locales sobre las instrucciones de la
            aplicación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            6. Limitación de Responsabilidad
          </h2>
          <p className="leading-relaxed">
            Naveo no será responsable por daños indirectos, incidentales o
            consecuentes derivados de la pérdida de mercancía, fallos en la
            entrega o mal comportamiento de los repartidores. Nuestra
            responsabilidad se limita exclusivamente al funcionamiento técnico
            de la plataforma de mando.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            7. Modificaciones
          </h2>
          <p className="leading-relaxed">
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. El uso continuado de la plataforma después de dichas
            modificaciones constituirá su aceptación de los nuevos términos.
          </p>
        </section>

        <section className="border-t pt-8 mt-12">
          <p className="text-sm text-slate-600 italic">
            Para cualquier consulta legal o aclaración sobre estos términos, por
            favor contáctenos en: <strong>legal@naveo.mx</strong>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
