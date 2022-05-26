import React from "react";
import {
  AutocompleteInput,
  Datagrid,
  FilterButton,
  FilterForm,
  ListContextProvider,
  NumberField,
  Pagination,
  SelectInput,
  TextField,
  Title,
  useListController,
} from "react-admin";
import { ClientesServicios } from "../components";

function Clientes() {
  const { data, page, perPage, isLoading, ...listContext } =
    useListController();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filters = [
    <AutocompleteInput
      label="Buscar por cliente"
      source="q"
      choices={[...new Set(data.map((d) => d.cliente))]
        .map((c) => ({ id: c, name: c }))
        .sort((a, b) => (a > b ? -1 : 1))}
    />,
    <SelectInput
      label="Buscar por mes"
      source="m"
      choices={[...new Set(data.map((d) => d.mes))]
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.place === value.place && t.name === value.name
            )
        )
        .sort((a, b) => a.id - b.id)}
    />,
    <SelectInput
      label="Buscar por año"
      source="y"
      choices={[...new Set(data.map((d) => d.año))]
        .map((año) => ({ id: año, name: año }))
        .sort((a, b) => a - b)}
    />,
  ];
  return (
    <ListContextProvider
      value={{
        data: data.slice((page - 1) * perPage, perPage * page - 1),
        page,
        perPage,
        ...listContext,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Title title="Clientes" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-end",
          }}
        >
          <FilterForm filters={filters} />
          <FilterButton filters={filters} />
        </div>
        <Datagrid expand={<ClientesServicios />}>
          <TextField textAlign="right" source="cliente" />
          <TextField textAlign="right" source="mes.name" label="Mes" />
          <NumberField source="año" />
          <NumberField
            source="a_deudor"
            label="A liquidar"
            locales="es-AR"
            options={{ style: "currency", currency: "ARS" }}
          />
          <NumberField
            source="a_favor"
            locales="es-AR"
            options={{ style: "currency", currency: "ARS" }}
          />
        </Datagrid>
        <Pagination />
      </div>
    </ListContextProvider>
  );
}

export default Clientes;
