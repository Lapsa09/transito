import Image from 'next/image'
import React from 'react'
import ImageModal from './ImageModal'
import Link from 'next/link'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { FaAngleUp } from 'react-icons/fa'

function SectionWho() {
  return (
    <header className="bg-green-700 text-white py-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center">¿Quiénes Somos?</h1>
        <p className="mt-2 text-lg">
          El Observatorio Vial de Vicente López surge con la misión de mejorar
          la recopilación y el almacenamiento de datos viales. Bajo la dirección
          de la Subsecretaría, hemos logrado optimizar el análisis y la
          organización de la información, lo que nos permite tomar decisiones
          más informadas y efectivas.Nuestra iniciativa ha despertado un
          creciente interés en otras áreas de la dependencia, que han comenzado
          a implementar nuestras tecnologías para mejorar sus propios procesos.
          Así, estamos construyendo un nuevo ecosistema de información, más
          eficiente y colaborativo, que beneficia a toda la comunidad.
        </p>
      </div>
    </header>
  )
}

function SectionHistory() {
  return (
    <section id="history" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Inicios del Observatorio Vial de Vicente López
        </h2>

        <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
          {/* <!-- Step 1 --> */}
          <div className="flex flex-col bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-1/2 flex-1">
            <h3 className="text-2xl font-semibold mb-4">Antes</h3>
            <p>Los datos se cargaban manualmente en Excel.</p>
            <ul className="mb-4">
              <li>Solo una persona podía ingresar información a la vez.</li>{' '}
              <li>
                No se podía utilizar la misma plantilla simultáneamente por
                múltiples usuarios.
              </li>
              <li>
                Limitaciones en la colaboración y actualización en tiempo real.
              </li>
              <li>
                Dependencia de la disponibilidad física del archivo y del equipo
                donde está almacenado.
              </li>
            </ul>

            <Image
              src="/about/before.jpeg"
              alt="Antes"
              width={1500}
              height={1500}
              className="rounded-lg mx-auto mt-auto"
            />
          </div>

          {/* <!-- Arrow Icon --> */}
          <div className="hidden md:block self-center text-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>

          {/* <!-- Step 2 --> */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-1/2 flex-1">
            <h3 className="text-2xl font-semibold mb-4">Ahora</h3>
            <p>Los datos se pueden cargar desde Internet.</p>
            <ul className="mb-4">
              <li>
                Acceso desde cualquier parte del mundo y en cualquier momento.
              </li>
              <li>
                Permite la carga de información por múltiples usuarios
                simultáneamente.
              </li>
              <li>
                Facilita el trabajo desde casa (home office), una característica
                muy requerida durante la pandemia de COVID-19.
              </li>
              <li>
                Actualización y sincronización en tiempo real de los datos.
              </li>
              <li>Mejora la colaboración y la eficiencia del equipo.</li>
              <li>Mayor seguridad en el almacenamiento y manejo de datos.</li>
              <li>
                Reducción del riesgo de errores humanos mediante validaciones y
                automatizaciones.
              </li>
              <li>
                Interfaz más amigable y accesible desde diferentes dispositivos
                (computadoras, tablets, teléfonos inteligentes).
              </li>
            </ul>
            <Image
              src="/about/after.jpeg"
              alt="Paso 2"
              width={1500}
              height={1500}
              className="rounded-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionDashboards() {
  return (
    <section id="dashboards" className="py-12 bg-gray-50">
      <h2 className="text-3xl font-semibold text-green-700 mb-4 text-center">
        Tableros del Observatorio Vial de Vicente López
      </h2>
      <div className="grid grid-cols-1">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 mt-5 gap-8 items-center">
          {/* <!-- Text Content --> */}
          <div>
            <h3 className="my-6 text-2xl font-semibold text-green-700">
              Se crea el primer tablero de estadísticas generales
            </h3>
            <p className="text-lg">
              Los tableros permiten presentar la información de manera clara y
              concisa, facilitando la comprensión de los datos por parte de
              todos
            </p>
          </div>
          {/* <!-- Image Content --> */}
          <ImageModal
            img="/about/Tablero general.png"
            alt="Tablero General"
            className="rounded-lg shadow-lg"
            height={3000}
            width={4500}
          />
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 mt-5 gap-8 items-center">
          {/* <!-- Text Content --> */}
          <div>
            <h3 className="text-2xl font-semibold text-green-700 mt-6">
              Tablero de denuncias telefónicas
            </h3>
          </div>
          {/* <!-- Image Content --> */}
          <div className="text-center">
            <ImageModal
              img="/about/Denuncias telefónicas.png"
              alt="Tablero Denuncias"
              className="rounded-lg shadow-lg"
              height={3000}
              width={4500}
            />
          </div>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 mt-5 gap-8 items-center">
          {/* <!-- Text Content --> */}

          <h3 className="text-2xl font-semibold text-green-700 mt-6">
            Tablero de vehículos abandonados
          </h3>

          {/* <!-- Image Content --> */}
          <div className="text-center">
            <ImageModal
              img="/about/Abandonados.png"
              alt="Tablero Abandonados"
              className="rounded-lg shadow-lg"
              height={3000}
              width={4500}
            />
          </div>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 mt-5 gap-8 items-center">
          {/* <!-- Text Content --> */}
          <Image
            src="/about/sigisvi.png"
            alt="Logo sigisvi"
            height={300}
            width={300}
            className="mx-auto mix-blend-multiply"
          />
          {/* <!-- Image Content --> */}
          <ImageModal
            img="/about/sigisvi1.png"
            alt="Sigisvi"
            height={3000}
            width={4500}
            className="rounded-lg shadow-lg p-4 bg-white"
          />
        </div>

        <div className="flex flex-wrap justify-center">
          <div className="px-4 mt-5 gap-8">
            {/* <!-- Text Content --> */}
            <h3 className="text-2xl font-semibold text-green-700 mt-6">
              Tablero de Accidentes
            </h3>

            {/* <!-- Image Content --> */}

            <ImageModal
              img="/about/tablero accidentes.jpg"
              alt="Tablero accidentes"
              className="rounded-lg shadow-lg"
              height={2500}
              width={2500}
            />
          </div>
          <div className="px-4 mt-5 gap-8">
            {/* <!-- Text Content --> */}

            <h3 className="text-2xl font-semibold text-green-700 mt-6">
              Tablero de paseo de la costa
            </h3>

            {/* <!-- Image Content --> */}

            <ImageModal
              img="/about/tablero paseo de la costa.jpg"
              alt="Tablero Paseo de la Costa"
              className="rounded-lg shadow-lg"
              height={3000}
              width={4500}
            />
          </div>
          <div className="px-4 mt-5 gap-8">
            <h3 className="text-2xl font-semibold text-green-700 mt-6">
              Tablero de servicios públicos
            </h3>

            {/* <!-- Image Content --> */}

            <ImageModal
              img="/about/Servicios Públicos.png"
              alt="Tablero Servicios Públicos"
              className="rounded-lg shadow-lg"
              height={3000}
              width={4500}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionExpansion() {
  return (
    <section id="expansion" className="py-12 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Expansion del Observatorio Vial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">
              App de Servicios Pagos
            </h3>
            <Image
              src="/about/Servicios pagos.png"
              height={300}
              width={400}
              alt="Servicios Pagos"
              className="rounded-lg mx-auto"
            />
            <p className="mt-4">
              El uso de la App por parte de los servicios pagos permitirá
              mejorar la asignación de agentes mediante un sistema de puntaje,
              así como optimizar la eficiencia en el cobro y pago de los
              servicios.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">App de logistica</h3>
            <Image
              src="/about/Logistica.png"
              width={400}
              height={300}
              alt="Gráfico 2"
              className="rounded-lg mx-auto"
            />
            <p className="mt-4">
              El uso de la nueva App permitirá conocer el estado general de los
              móviles en tiempo real, facilitando la gestión y asegurando una
              mayor eficiencia operativa.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">App de radio</h3>
            <p className="mt-4">
              La nueva aplicación de la radio permitirá generar los partes
              diarios de manera más rápida y eficiente, asignando
              automáticamente los móviles en funcionamiento y las tareas
              correspondientes. Esto optimizará el tiempo de gestión y mejorará
              la coordinación operativa.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">App de licencias</h3>

            <p className="mt-4 text-left">
              La nueva app de licencias permite rendir el examen teórico a
              través del celular mediante un enlace web. Lo que facilitará una
              mayor rapidez en el proceso y un mejor control de las estadísticas
              a través del nuevo tablero de control.
            </p>
            <Image
              src="/about/Licencias.png"
              alt="Licencias"
              width={600}
              height={400}
              className="rounded-lg mx-auto mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function page() {
  return (
    <div className="bg-gray-100 text-gray-800">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="#who" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  'bg-transparent hover:text-green-700',
                )}
              >
                Quienes somos
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#history" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  'bg-transparent hover:text-green-700',
                )}
              >
                Nuestros inicios
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#dashboards" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  'bg-transparent hover:text-green-700',
                )}
              >
                Tableros
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#expansion" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  'bg-transparent hover:text-green-700',
                )}
              >
                Expansion
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <SectionWho />

      <SectionHistory />

      <SectionDashboards />

      <SectionExpansion />

      <Link href="#">
        <FaAngleUp className="fixed right-4 bottom-16 w-12 h-12 rounded-full bg-green-700 shadow-sm opacity-0 hover:opacity-80 focus:opacity-90 active:opacity-100 transition-opacity" />
      </Link>
    </div>
  )
}

export default page
