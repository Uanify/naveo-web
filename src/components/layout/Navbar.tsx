"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOpen
          ? "bg-white h-screen"
          : " backdrop-blur-md"
      }`}
    >
      {/* Desktop Layout (Original Design) */}
      <div className="hidden md:flex flex-col w-full max-w-6xl mx-auto px-4 py-6 gap-6">
        <div className="flex justify-start">
          <Link href="/">
            <Image
              src="/naveo-logo.svg"
              alt="naveo-logo"
              width={74}
              height={16}
            />
          </Link>
        </div>
        <div className="flex items-center justify-between w-full">
          <ul className="flex gap-8 text-base font-medium text-gray-600">
            <li className="hover:text-black cursor-pointer transition-colors">
              <Link href="/">Inicio</Link>
            </li>
            <li className="hover:text-black cursor-pointer transition-colors">
              <Link href="#features">Características</Link>
            </li>
            <li className="hover:text-black cursor-pointer transition-colors">
              <Link href="#pricing">Precio</Link>
            </li>
            <li className="hover:text-black cursor-pointer transition-colors">
              <Link href="#faq">FAQ</Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-5 py-2.5 cursor-pointer rounded-full font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all">
              Iniciar sesión
            </Link>
            <Link
              href="https://wa.me/524774122683?text=Hola!%20Me%20gustaría%20agendar%20una%20demo%20de%20Naveo"
              target="_blank"
              className="bg-black text-white px-6 py-2.5 cursor-pointer rounded-full font-semibold hover:bg-gray-900 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Agendar demo
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col w-full h-full">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/naveo-logo.svg"
              alt="naveo-logo"
              width={74}
              height={16}
            />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu content */}
        <div
          className={`flex flex-col px-6 transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen
              ? "opacity-100 translate-y-0 h-full py-8"
              : "opacity-0 -translate-y-4 h-0"
          }`}
        >
          <ul className="flex flex-col gap-6 text-2xl font-semibold text-gray-900">
            <li>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="#features" onClick={() => setIsOpen(false)}>
                Características
              </Link>
            </li>
            <li>
              <Link href="#pricing" onClick={() => setIsOpen(false)}>
                Precio
              </Link>
            </li>
            <li>
              <Link href="#faq" onClick={() => setIsOpen(false)}>
                FAQ
              </Link>
            </li>
          </ul>

          <div className="mt-auto mb-10 flex flex-col gap-4">
            <Link href="/login" className="w-full text-center px-6 py-4 rounded-full font-semibold text-gray-800 border-2 border-gray-100 hover:bg-gray-50 active:scale-[0.98] transition-all">
              Iniciar sesión
            </Link>
            <Link
              href="https://wa.me/524774122683?text=Hola!%20Me%20gustaría%20agendar%20una%20demo%20de%20Naveo"
              target="_blank"
              className="w-full bg-black text-white px-6 py-4 rounded-full font-bold text-center shadow-xl active:scale-[0.98] transition-all"
              onClick={() => setIsOpen(false)}
            >
              Agendar demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
