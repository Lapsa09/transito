import React from "react";
import { Admin, resolveBrowserLocale, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { Dashboard, Operarios, Clientes, NuevoCliente } from "./pages";
import { ServiciosMemo } from "./components";
import polyglotI18nProvider from "ra-i18n-polyglot";
import spanishMessages from "@blackbox-vision/ra-language-spanish";

const App = () => {
  const restProvider = jsonServerProvider("http://mvls-tran-80:3001/sueldos");

  const i18nProvider = polyglotI18nProvider(
    () => ({ ...spanishMessages, undefined: "indefinido" }),
    resolveBrowserLocale()
  );

  return (
    <Admin
      i18nProvider={i18nProvider}
      dashboard={Dashboard}
      dataProvider={restProvider}
    >
      <Resource name="clientes" list={Clientes} create={NuevoCliente} />
      <Resource name="operarios" list={Operarios} show={ServiciosMemo} />
    </Admin>
  );
};

export default App;
