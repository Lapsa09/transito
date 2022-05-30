//FilterPost.jsx
import React from "react";
import {
  Datagrid,
  TextField,
  useRecordContext,
  ListContextProvider,
  useList,
  NumberField,
} from "react-admin";

export const ServiciosMemo = () => {
  const record = useRecordContext();
  const listContext = useList({ data: record.operarios });
  return (
    <ListContextProvider value={listContext}>
      <Datagrid isRowSelectable={() => false}>
        <TextField textAlign="right" source="legajo" label="Nº Legajo" />
        <TextField textAlign="right" source="nombre" label="Nombre" />
        <NumberField
          source="a_cobrar"
          label="A Cobrar"
          locales="es-AR"
          options={{ style: "currency", currency: "ARS" }}
        />
      </Datagrid>
    </ListContextProvider>
  );
};
