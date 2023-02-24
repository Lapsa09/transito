import React from 'react'
import {
  Admin,
  Layout,
  memoryStore,
  resolveBrowserLocale,
  Resource,
} from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import {
  Dashboard,
  Operarios,
  Clientes,
  NuevoCliente,
  Servicios,
  EditServicio,
  Liqui,
  EditPrecio,
} from '.'
import polyglotI18nProvider from 'ra-i18n-polyglot'
// @ts-ignore
import spanishMessages from '@blackbox-vision/ra-language-spanish'

const Sueldos = () => {
  const restProvider = jsonServerProvider(
    process.env.REACT_APP_BASE_URL + '/sueldos'
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
      layout={CustomLayout}
      dashboard={Dashboard}
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
      <Resource name="precios" edit={EditPrecio} />
    </Admin>
  )
}

const CustomLayout = (props) => {
  return <Layout {...props} appBar={'span'} />
}

export default Sueldos
