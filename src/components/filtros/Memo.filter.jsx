import React from "react";
import { Filter, TextInput } from "react-admin";

export const MemoFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Buscar memo" source="q" />
  </Filter>
);
