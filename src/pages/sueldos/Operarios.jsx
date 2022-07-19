import React from "react";
import {
  Datagrid,
  TextField,
  NumberField,
  useListController,
  ListContextProvider,
  Pagination,
  FilterForm,
  SelectInput,
  TextInput,
} from "react-admin";
import { OperariosServicios } from "../../components";

export const Operarios = () => {
  const { data, page, perPage, isLoading, ...listContext } =
    useListController();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filters = [
    <TextInput
      label="Buscar operario por legajo o nombre"
      source="q"
      alwaysOn
    />,
    <SelectInput
      label="Buscar por mes"
      source="m"
      alwaysOn
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
      alwaysOn
      choices={[...new Set(data.map((d) => d.año))]
        .sort((a, b) => a.id - b.id)
        .map((c) => ({ id: c, name: c }))}
    />,
  ];

  return (
    <ListContextProvider
      value={{
        data: data.slice((page - 1) * perPage, perPage * page),
        page,
        perPage,
        ...listContext,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-end",
            width: "95%",
            justifyContent: "space-between",
          }}
        >
          <h1>Operarios</h1>
          <FilterForm filters={filters} />
        </div>
        <Datagrid
          expandSingle
          isRowSelectable={() => false}
          expand={<OperariosServicios />}
        >
          <TextField textAlign="right" source="legajo" />
          <TextField textAlign="right" source="inspector" />
          <TextField textAlign="right" source="mes.name" label="Mes" />
          <TextField textAlign="right" source="año" />
          <NumberField
            source="total"
            locales="es-AR"
            options={{ style: "currency", currency: "ARS" }}
          />
        </Datagrid>
        <Pagination />
      </div>
    </ListContextProvider>
  );
};
