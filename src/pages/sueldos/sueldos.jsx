import React from "react";
import { Admin, Layout, resolveBrowserLocale, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import {
  Dashboard,
  Operarios,
  Clientes,
  NuevoCliente,
  Servicios,
  EditServicio,
} from ".";
import polyglotI18nProvider from "ra-i18n-polyglot";
import spanishMessages from "@blackbox-vision/ra-language-spanish";

const Sueldos = () => {
  const restProvider = jsonServerProvider(
    process.env.REACT_APP_BASE_URL + "/sueldos"
  );

  const i18nProvider = polyglotI18nProvider(
    () => ({ ...spanishMessages, undefined: "indefinido" }),
    resolveBrowserLocale()
  );

  return (
    <Admin
      i18nProvider={i18nProvider}
      layout={CustomLayout}
      dashboard={Dashboard}
      dataProvider={restProvider}
      basename="/sueldos"
    >
      <Resource
        name="clientes"
        list={Clientes}
        create={NuevoCliente}
        edit={EditServicio}
      />
      <Resource name="operarios" list={Operarios} />
      <Resource
        name="servicios"
        list={Servicios}
        options={{ label: "Proximos Servicios" }}
      />
    </Admin>
  );
};

const CustomLayout = (props) => {
  return <Layout {...props} appBar={"span"} />;
};

export default Sueldos;
