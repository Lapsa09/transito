import React, { lazy } from 'react'
import { Admin, memoryStore, resolveBrowserLocale, Resource } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import polyglotI18nProvider from 'ra-i18n-polyglot'
// @ts-ignore
import spanishMessages from '@blackbox-vision/ra-language-spanish'
import { LayoutWithoutAppbar } from '../../layouts'

const DashBoard = lazy(() => import('./DashBoard'))
const Operarios = lazy(() => import('./Operarios'))
const Clientes = lazy(() => import('./Clientes'))
const NuevoCliente = lazy(() => import('./NuevoCliente'))
const Servicios = lazy(() => import('./Servicios'))
const EditServicio = lazy(() => import('./EditServicio'))
const Liqui = lazy(() => import('./Liqui'))
const EditPrecio = lazy(() => import('./EditPrecio'))

const Sueldos = () => {
  const restProvider = jsonServerProvider(
    import.meta.env.VITE_BASE_URL + '/sueldos'
  )

  const i18nProvider = polyglotI18nProvider(
    () => ({
      ...spanishMessages,
      undefined: '',
      'JANUARY  ': 'ENERO',
      'FEBRUARY ': 'FEBRERO',
      'MARCH    ': 'MARZO',
      'APRIL    ': 'ABRIL',
      'MAY      ': 'MAYO',
      'JUNE     ': 'JUNIO',
      'JULY     ': 'JULIO',
      'AUGUST   ': 'AGOSTO',
      SEPTEMBER: 'SEPTIEMBRE',
      'OCTOBER  ': 'OCTUBRE',
      'NOVEMBER ': 'NOVIEMBRE',
      'DECEMBER ': 'DICIEMBRE',
      null: '',
    }),
    resolveBrowserLocale()
  )

  return (
    <Admin
      i18nProvider={i18nProvider}
      layout={LayoutWithoutAppbar}
      dashboard={DashBoard}
      dataProvider={restProvider}
      store={memoryStore()}
      basename="/sueldos"
    >
      <Resource name="clientes" list={Clientes} />
      <Resource name="operarios" list={Operarios} />
      <Resource
        name="servicios"
        list={Servicios}
        edit={EditServicio}
        create={NuevoCliente}
        options={{ label: 'Todos los Servicios' }}
      />
      <Resource
        name="servicios/liqui"
        list={Liqui}
        options={{ label: 'Liquidacion x Mes' }}
      />
      <Resource name="precios" list={EditPrecio} />
    </Admin>
  )
}

export default Sueldos
