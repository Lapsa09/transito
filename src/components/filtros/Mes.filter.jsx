import React from "react";
import { SelectInput, useListContext } from "react-admin";

function MesFilter() {
  const { data } = useListContext();
  const meses = [...new Set(data.map((d) => d.mes))].map((mes) => ({
    id: mes,
    name: mes,
  }));
  return <SelectInput label="Buscar por mes" source="m" choices={meses} />;
}

export default MesFilter;
