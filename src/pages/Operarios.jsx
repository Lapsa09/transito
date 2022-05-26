import React from "react";
import { List, Datagrid, TextField, NumberField } from "react-admin";
import { OperariosServicios, OperariosFilter } from "../components";

export const Operarios = (props) => (
  <List filters={<OperariosFilter />} {...props}>
    <Datagrid expand={<OperariosServicios />}>
      <TextField textAlign="right" source="inspector" />
      <TextField textAlign="right" source="mes" label="Mes" />
      <NumberField
        source="total"
        locales="es-AR"
        options={{ style: "currency", currency: "ARS" }}
      />
    </Datagrid>
  </List>
);
