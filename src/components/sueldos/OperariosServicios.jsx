//FilterPost.jsx
import React from 'react';
import {
  Datagrid,
  TextField,
  useRecordContext,
  ListContextProvider,
  useList,
  NumberField,
  DateField,
} from 'react-admin';

export const OperariosServicios = () => {
  const record = useRecordContext();
  const listContext = useList({ data: record.servicios });
  return (
    <ListContextProvider value={listContext}>
      <Datagrid isRowSelectable={() => false}>
        <TextField textAlign="right" source="memo" label="Nº Memo" />
        <NumberField source="recibo" label="Nº Recibo" />
        <DateField
          textAlign="right"
          source="fecha_recibo"
          label="Fecha del recibo"
        />
        <DateField
          textAlign="right"
          source="fecha_servicio"
          label="Fecha del servicio"
        />
        <NumberField
          source="a_cobrar"
          label="Importe"
          locales="es-AR"
          options={{ style: 'currency', currency: 'ARS' }}
        />
      </Datagrid>
    </ListContextProvider>
  );
};
