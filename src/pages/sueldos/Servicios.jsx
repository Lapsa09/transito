import { DateTime } from "luxon";
import React from "react";
import {
  Datagrid,
  DateField,
  FilterForm,
  ListContextProvider,
  NumberField,
  Pagination,
  SelectInput,
  TextField,
  useListController,
} from "react-admin";
import { ServiciosMemo } from "../../components";

function Servicios() {
  const { data, page, perPage, isLoading, ...listContext } =
    useListController();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (data == null) {
    return <div>Vacio</div>;
  }

  const filters = [
    <SelectInput
      label="Buscar por dia"
      source="d"
      alwaysOn
      choices={[...new Set(data?.map((d) => d.fecha_servicio))]
        .sort((a, b) => a - b)
        .map((fecha) => ({
          id: fecha,
          name: DateTime.fromISO(fecha).toLocaleString(DateTime.DATE_SHORT),
        }))
        .slice(0, 20)}
      translateChoice={false}
    />,
  ];

  return (
    <ListContextProvider
      value={{
        data: data?.slice((page - 1) * perPage, perPage * page),
        page,
        perPage,
        ...listContext,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "flex-end",
            width: "95%",
          }}
        >
          <h1>Proximos Servicios</h1>
          <FilterForm filters={filters} />
        </div>
        <Datagrid
          expandSingle
          isRowSelectable={() => false}
          expand={<ServiciosMemo />}
        >
          <DateField
            textAlign="right"
            source="fecha_servicio"
            label="Fecha del servicio"
          />
          <TextField textAlign="right" source="memo" label="Nº Memo" />
          <TextField textAlign="right" source="cliente" />
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
        <Pagination />
      </div>
    </ListContextProvider>
  );
}

export default Servicios;
