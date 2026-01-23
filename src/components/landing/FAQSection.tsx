"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const faqs = [
  {
    question: "¿Mis datos y los de mis clientes están seguros con Naveo?",
    answer:
      "Sí, la seguridad es nuestra prioridad. Utilizamos encriptación de grado bancario para proteger toda tu información y la de tus clientes. Tus datos nunca se comparten con tercero.",
  },
  {
    question: "¿Qué tipo de empresas pueden usar Naveo?",
    answer:
      "Naveo está diseñado para cualquier empresa con operaciones de logística de última milla, desde flotas pequeñas de 2-3 vehículos hasta grandes operaciones de 50 unidades. Es ideal para paquetería, distribución de alimentos, farmacias, y retail.",
  },
  {
    question: "¿Cómo se calcula el saldo para los viajes?",
    answer:
      "El saldo funciona bajo un modelo de prepago flexible. Pagas la mensualidad del plan y puedes añadir saldo a tu cuenta para realizar viajes, los costos van de $1-$3 MXN por viaje dependiendo la distancia. No hay costos ocultos ni mensualidades forzosas.",
  },
  {
    question: "¿Cuánto tiempo tarda implementar el sistema?",
    answer:
      "La instalación del sistema está listo para ser usado en 2 días hábiles, a las 2 semanas podrás ver resultados reales.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full flex justify-center bg-white py-24">
      <div className="w-full max-w-4xl px-4 flex flex-col gap-12">
        <h2 className="text-4xl md:text-5xl font-medium text-black">
          Preguntas frecuentes
        </h2>
        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full flex justify-between items-center py-6 text-left focus:outline-none cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg text-[#111111]">{faq.question}</span>
                <ChevronDown
                  className={`transform transition-transform duration-300 text-black ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-40 opacity-100 mb-6"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-[#525151] leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
