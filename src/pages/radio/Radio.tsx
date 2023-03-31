import React from 'react'
import { Admin, memoryStore, resolveBrowserLocale, Resource } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import {
  MovilCreateForm,
  MovilEditForm,
  MovilesTable,
  MyLayout,
  OperariosTable,
  OperativosCreateForm,
  OperativosEditForm,
} from '../../components'
import polyglotI18nProvider from 'ra-i18n-polyglot'
// @ts-ignore
import spanishMessages from '@blackbox-vision/ra-language-spanish'

function Radio() {
  const restProvider = jsonServerProvider(
    import.meta.env.VITE_BASE_URL + '/radio'
  )
  const i18nProvider = polyglotI18nProvider(
    () => spanishMessages,
    resolveBrowserLocale()
  )

  return (
    <Admin
      dataProvider={restProvider}
      layout={MyLayout}
      store={memoryStore()}
      i18nProvider={i18nProvider}
      basename="/radio"
    >
      <Resource
        name="operarios"
        list={OperariosTable}
        create={OperativosCreateForm}
        edit={OperativosEditForm}
      />
      <Resource
        name="moviles"
        list={MovilesTable}
        create={MovilCreateForm}
        edit={MovilEditForm}
      />
    </Admin>
  )
}

export default Radio
