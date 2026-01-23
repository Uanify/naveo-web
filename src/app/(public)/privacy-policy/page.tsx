import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/Navbar";

export default function PrivacyPolicy() {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl pt-32 md:pt-[180px] mx-auto px-6 py-12 font-sans text-slate-800">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          Política de Privacidad
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Última actualización: 2 de enero de 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            1. Quiénes Somos
          </h2>
          <p className="leading-relaxed">
            Naveo (en adelante, "nosotros" o "la Plataforma") es un centro de
            mando para logística de última milla. Nuestra misión es optimizar
            las rutas de entrega y facilitar la gestión operativa entre
            sucursales, repartidores y clientes finales.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            2. Información que Recolectamos
          </h2>
          <p className="mb-4">
            Para que Naveo funcione correctamente, recolectamos los siguientes
            datos:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Datos de Ubicación (Crucial):</strong> Recolectamos
              coordenadas GPS exactas de los conductores para el seguimiento en
              tiempo real y la navegación paso a paso.
            </li>
            <li>
              <strong>Información de Contacto:</strong> Nombres, direcciones y
              números de teléfono de clientes y sucursales.
            </li>
            <li>
              <strong>Datos Operativos:</strong> Kilómetros recorridos, tiempos
              de entrega, tarifas generadas y estadísticas de eficiencia de la
              flotilla.
            </li>
            <li>
              <strong>Identificadores de Dispositivo:</strong> Información sobre
              el dispositivo móvil para asegurar la estabilidad de la App del
              Conductor.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            3. Uso de la Información
          </h2>
          <p className="mb-4">Utilizamos tus datos para:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Calcular rutas óptimas y distancias reales a través de Mapbox.
            </li>
            <li>Proporcionar navegación guiada por voz a los conductores.</li>
            <li>Generar reportes de eficiencia y facturación de envíos.</li>
            <li>
              Garantizar la seguridad de la mercancía mediante el rastreo en
              vivo.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">
            4. Compartición de Datos con Terceros
          </h2>
          <p className="mb-4">
            Naveo no vende tu información. Sin embargo, compartimos datos con
            proveedores esenciales:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Mapbox:</strong> Para servicios de mapas, geocodificación
              y navegación GPS.
            </li>
            <li>
              <strong>Supabase:</strong> Para el almacenamiento seguro de datos
              y autenticación de usuarios.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium mb-4 text-black">5. Seguridad</h2>
          <p className="leading-relaxed">
            Implementamos medidas de seguridad de grado industrial a través de
            Supabase, incluyendo el cifrado de datos en tránsito y en reposo,
            para proteger la integridad de tu operación logística.
          </p>
        </section>

        <section className="border-t pt-8 mt-12">
          <p className="text-sm text-slate-600 italic">
            Al utilizar Naveo, aceptas el procesamiento de tu información según
            lo descrito en esta política. Para dudas sobre el manejo de tus
            datos, contáctanos en: <strong>soporte@naveo.mx</strong>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
