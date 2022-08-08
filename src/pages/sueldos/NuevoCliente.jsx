import { Grid } from '@mui/material'
import React from 'react'
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
} from 'react-admin'
import {
  CreateCliente,
  CreateOperario,
  TimePickerComponent,
  OpInput,
  Recibo,
  TotalInput,
  DatePickerComponent,
} from '../../components'
import styles from '../../styles/Sueldos.module.css'

function NuevoCliente() {
  return (
    <Create title="Nuevo servicio">
      <SimpleForm>
        <Grid
          container
          spacing={2}
          columns={{ xs: 8, md: 16 }}
          // className={styles.flexForm}
        >
          <Grid item xs={8} sx={{ display: 'flex' }}>
            <ReferenceInput source="id_cliente" reference="clientes/list">
              <AutocompleteInput
                label="Cliente"
                className={styles.inputs}
                translateChoice={false}
                isRequired
              />
            </ReferenceInput>
            <CreateCliente />
          </Grid>
          <Grid item xs={8}>
            <TextInput
              className={styles.inputs}
              source="memo"
              label="Nº Memo"
              isRequired
            />
          </Grid>
          <FormDataConsumer>
            {({ formData, ...rest }) => (
              <Recibo formData={formData} {...rest} />
            )}
          </FormDataConsumer>
          <Grid item xs={8} sx={{ display: 'flex', gap: '10px' }}>
            <DatePickerComponent
              source="fecha_servicio"
              className={styles.inputs}
              label="Fecha del servicio"
            />
            <BooleanInput source="feriado" label="Es feriado?" />
          </Grid>
          <Grid container item columns={{ xs: 8, md: 16 }}>
            <ArrayInput source="operarios">
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ getSource }) => (
                    <Grid item xs={8} sx={{ display: 'flex' }}>
                      <ReferenceInput
                        source={getSource('legajo')}
                        reference="operarios/list"
                      >
                        <AutocompleteInput
                          label="Operario"
                          optionText={(choice) => `${choice.id} ${choice.name}`}
                          className={styles.inputs}
                          isRequired
                        />
                      </ReferenceInput>
                      <CreateOperario />
                    </Grid>
                  )}
                </FormDataConsumer>
                <Grid item xs={8}>
                  <TimePickerComponent
                    className={styles.inputs}
                    source="hora_inicio"
                    label="Hora de inicio"
                  />
                </Grid>
                <Grid item xs={8}>
                  <TimePickerComponent
                    className={styles.inputs}
                    source="hora_fin"
                    label="Hora de finalizacion"
                  />
                </Grid>
                <FormDataConsumer>
                  {({ formData, getSource, scopedFormData }) => (
                    <Grid item xs={8}>
                      <OpInput
                        source={getSource('a_cobrar')}
                        formData={formData}
                        scopedFormData={scopedFormData}
                      />
                    </Grid>
                  )}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </Grid>
        </Grid>
        <FormDataConsumer>
          {({ formData, ...rest }) => (
            <TotalInput ops={formData.operarios} {...rest} />
          )}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  )
}

export default NuevoCliente
