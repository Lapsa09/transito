import React from "react";
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { Dashboard, Operarios, Servicios, Clientes } from "./pages";

const App = () => {
  const restProvider = jsonServerProvider("http://mvls-tran-80:3001/sueldos");

  return (
    <Admin dashboard={Dashboard} dataProvider={restProvider}>
      <Resource name="clientes" list={Clientes} />
      <Resource name="operarios" list={Operarios} />
      <Resource name="servicios" list={Servicios} />
    </Admin>
  );
};

export default App;
