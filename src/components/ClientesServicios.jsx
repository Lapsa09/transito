import React from "react";
import {
  Datagrid,
  DateField,
  ListContextProvider,
  NumberField,
  TextField,
  useList,
  useRecordContext,
} from "react-admin";

function ClientesServicios() {
  const record = useRecordContext();
  const listContext = useList({ data: record.servicios });
  return (
    <ListContextProvider value={listContext}>
      <Datagrid>
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
        <DateField
          textAlign="right"
          source="fecha_servicio"
          label="Fecha del servicio"
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
    </ListContextProvider>
  );
}

export default ClientesServicios;
