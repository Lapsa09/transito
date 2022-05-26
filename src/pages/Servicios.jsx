import React from "react";
import { List, Datagrid, TextField, DateField, NumberField } from "react-admin";
import { ServiciosMemo } from "../components";

export const Servicios = (props) => (
  <List {...props}>
    <Datagrid expand={<ServiciosMemo />} rowClick="edit">
      <TextField textAlign="right" source="memo" label="Nº Memo" />
      <NumberField source="recibo" label="Nº Recibo" />
      <DateField
        textAlign="right"
        source="fecha_recibo"
        label="Fecha del recibo"
      />
      <NumberField
        source="importe_recibo"
        label="Importe del recibo"
        locales="es-AR"
        options={{ style: "currency", currency: "ARS" }}
      />
      <NumberField
        source="importe_servicio"
        label="Importe del servicio"
        locales="es-AR"
        options={{ style: "currency", currency: "ARS" }}
      />
      <NumberField
        source="acopio"
        label="Acopio"
        locales="es-AR"
        options={{ style: "currency", currency: "ARS" }}
      />
    </Datagrid>
  </List>
);
