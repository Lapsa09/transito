import React, { useEffect } from "react";
import {
  ArrayInput,
  AutocompleteInput,
  BooleanInput,
  Create,
  DateInput,
  FormDataConsumer,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useInput,
} from "react-admin";
import {
  CreateCliente,
  CreateOperario,
  TimePickerComponent,
} from "../components";
import {
  InputAdornment,
  TextField,
} from "react-admin/node_modules/@mui/material";
import "../App.css";
import { DateTime } from "luxon";

function NuevoCliente() {
  return (
    <Create title="Nuevo servicio">
      <SimpleForm>
        <div className="flexForm">
          <ReferenceInput source="id_cliente" reference="clientes/list">
            <AutocompleteInput
              label="Cliente"
              optionText="cliente"
              optionValue="id_cliente"
              className="inputs"
              create={<CreateCliente />}
              isRequired
            />
          </ReferenceInput>
          <TextInput
            className="inputs"
            source="memo"
            label="Nº Memo"
            isRequired
          />
          <NumberInput
            className="inputs"
            source="recibo"
            label="Nº Recibo"
            isRequired
          />
          <DateInput
            className="inputs"
            source="fecha_recibo"
            label="Fecha del recibo"
            isRequired
          />
          <NumberInput
            source="importe_recibo"
            className="inputs"
            label="Importe del recibo"
            isRequired
            step={100}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <div
            className="inputs"
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            <DateInput
              source="fecha_servicio"
              className="inputs"
              label="Fecha del servicio"
              isRequired
            />
            <BooleanInput source="esFeriado" label="Es feriado?" />
          </div>
          <ArrayInput source="operarios">
            <SimpleFormIterator>
              <ReferenceInput source="legajo" reference="operarios/list">
                <AutocompleteInput
                  label="Operario"
                  optionText={(choice) => `${choice.legajo} ${choice.nombre}`}
                  optionValue="legajo"
                  className="inputs"
                  create={<CreateOperario />}
                  isRequired
                />
              </ReferenceInput>
              <TimePickerComponent
                className="inputs"
                source="hora_inicio"
                label="Hora de inicio"
              />
              <TimePickerComponent
                className="inputs"
                source="hora_fin"
                label="Hora de finalizacion"
              />
              <FormDataConsumer>
                {({ formData, getSource, scopedFormData }) => (
                  <OpInput
                    source={getSource("a_cobrar")}
                    dia={formData?.fecha_servicio}
                    inicio={scopedFormData?.hora_inicio}
                    fin={scopedFormData?.hora_fin}
                    isFeriado={formData?.esFeriado}
                  />
                )}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        </div>
        <FormDataConsumer>
          {({ formData, ...rest }) => (
            <TotalInput ops={formData.operarios} {...rest} />
          )}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
}

const getImporteOperario = (dia, inicio, fin, isFeriado) => {
  if (dia == null || inicio == null || fin == null || isFeriado == null) {
    return 0;
  }
  const _dia = DateTime.fromISO(dia);
  const _inicio = DateTime.fromISO(inicio);
  const _fin = DateTime.fromISO(fin);
  const _diff = _fin.diff(_inicio, "hours").hours;
  if (_dia.weekday >= 1 && _dia.weekday <= 5 && !isFeriado) {
    if (_inicio.hour >= 8 && _fin.hour <= 20) {
      return 644 * _diff;
    }
  }
  return 1036 * _diff;
};

const OpInput = ({ source, dia, inicio, fin, isFeriado }) => {
  const { field } = useInput({
    source,
    defaultValue: 0,
  });

  const cuenta = getImporteOperario(dia, inicio, fin, isFeriado);

  useEffect(() => {
    field.onChange(cuenta);
    // eslint-disable-next-line
  }, [cuenta]);

  return (
    <TextField
      {...field}
      className="inputs"
      type="number"
      label="A cobrar"
      disabled
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  );
};

const TotalInput = ({ ops }) => {
  const { field } = useInput({
    source: "importe_servicio",
    defaultValue: 0,
  });
  const cuenta = !!ops ? ops.reduce((a, b) => a + b?.a_cobrar, 0) : 0;

  useEffect(() => {
    field.onChange(cuenta);
    // eslint-disable-next-line
  }, [cuenta]);

  return (
    <TextField
      {...field}
      className="inputs total"
      type="number"
      label="Importe del servicio"
      disabled
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  );
};

export default NuevoCliente;
