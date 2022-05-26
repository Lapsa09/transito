import React from "react";
import { Filter, SelectInput, useListContext } from "react-admin";

export const ClientesFilter = (props) => {
  const { data } = useListContext();
  const meses = [...new Set(data?.map((d) => d.mes))].map((mes) => ({
    id: mes,
    name: mes,
  }));

  return (
    <Filter {...props}>
      <SelectInput label="Buscar mes" source="m" choices={meses} />
    </Filter>
  );
};
