import React from "react";
import {
  ArrayInput,
  AutocompleteInput,
  BooleanInput,
  Create,
  FormDataConsumer,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from "react-admin";
import {
  CreateCliente,
  CreateOperario,
  TimePickerComponent,
  OpInput,
  Recibo,
  TotalInput,
  DatePickerComponent,
} from "../../components";
import styles from "../../styles/Sueldos.module.css";

function NuevoCliente() {
  return (
    <Create title="Nuevo servicio">
      <SimpleForm>
        <div className={styles.flexForm}>
          <div className={styles.dbInput}>
            <ReferenceInput source="id_cliente" reference="clientes/list">
              <AutocompleteInput
                label="Cliente"
                className={styles.inputs}
                translateChoice={false}
                isRequired
              />
            </ReferenceInput>
            <CreateCliente />
          </div>
          <TextInput
            className={styles.inputs}
            source="memo"
            label="Nº Memo"
            isRequired
          />
          <FormDataConsumer>
            {({ formData, ...rest }) => (
              <Recibo formData={formData} {...rest} />
            )}
          </FormDataConsumer>
          <div
            className={styles.inputs}
            style={{ display: "flex", gap: "20px" }}
          >
            <DatePickerComponent
              source="fecha_servicio"
              className={styles.inputs}
              label="Fecha del servicio"
            />
            <BooleanInput source="feriado" label="Es feriado?" />
          </div>
          <ArrayInput source="operarios">
            <SimpleFormIterator>
              <FormDataConsumer>
                {({ getSource }) => (
                  <div className={styles.dbInput}>
                    <ReferenceInput
                      source={getSource("legajo")}
                      reference="operarios/list"
                    >
                      <AutocompleteInput
                        label="Operario"
                        optionText={(choice) => `${choice.id} ${choice.name}`}
                        isRequired
                      />
                    </ReferenceInput>
                    <CreateOperario />
                  </div>
                )}
              </FormDataConsumer>
              <TimePickerComponent
                className={styles.inputs}
                source="hora_inicio"
                label="Hora de inicio"
              />
              <TimePickerComponent
                className={styles.inputs}
                source="hora_fin"
                label="Hora de finalizacion"
              />
              <FormDataConsumer>
                {({ formData, getSource, scopedFormData }) => (
                  <OpInput
                    source={getSource("a_cobrar")}
                    formData={formData}
                    scopedFormData={scopedFormData}
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

export default NuevoCliente;
