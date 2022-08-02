import React from 'react';
import { Filter, TextInput } from 'react-admin';

export const OperariosFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Buscar operario" source="q" alwaysOn />
  </Filter>
);
