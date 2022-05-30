import React from "react";
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { Dashboard, Operarios, Clientes } from "./pages";
import { ServiciosMemo } from "./components";

const App = () => {
  const restProvider = jsonServerProvider("http://mvls-tran-80:3001/sueldos");

  return (
    <Admin dashboard={Dashboard} dataProvider={restProvider}>
      <Resource name="clientes" list={Clientes} />
      <Resource name="operarios" list={Operarios} show={ServiciosMemo} />
    </Admin>
  );
};

export default App;
