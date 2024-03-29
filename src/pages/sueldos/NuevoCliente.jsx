import { Grid } from '@mui/material'
import React, { useCallback } from 'react'
import {
  ArrayInput,
  AutocompleteInput,
  BooleanInput,
  Create,
  FormDataConsumer,
  RadioButtonGroupInput,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useCreate,
  useGetList,
} from 'react-admin'
import {
  CreateCliente,
  CreateOperario,
  TimePickerComponent,
  OpInput,
  Recibo,
  TotalInput,
  DatePickerComponent,
  Acopio,
} from '../../components'
import styles from '../../styles/Sueldos.module.css'
import { history } from '../../utils'

function NuevoCliente() {
  const { refetch } = useGetList('clientes/list')
  const [create] = useCreate()
  const save = useCallback(
    (values) => {
      create(
        'clientes',
        { data: values },
        {
          returnPromise: true,
          onError: (error) => console.log(error),
          onSuccess: () => {
            history.navigate('/sueldos/clientes')
          },
        }
      )
    },
    [create]
  )
  return (
    <Create title="Nuevo servicio">
      <SimpleForm onSubmit={save}>
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8} sx={{ display: 'flex' }}>
            <ReferenceInput source="id_cliente" reference="clientes/list">
              <AutocompleteInput
                label="Cliente"
                className={styles.inputs}
                translateChoice={false}
                isRequired
              />
            </ReferenceInput>
            <CreateCliente refetch={refetch} />
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
            {({ formData }) =>
              formData.id_cliente && (
                <Grid item xs={8}>
                  <RadioButtonGroupInput
                    source="medio_pago"
                    label="Medio de pago"
                    defaultValue="recibo"
                    translateChoice={false}
                    choices={[
                      { id: 'recibo', name: 'Recibo' },
                      { id: 'acopio', name: 'Acopio' },
                    ]}
                  />
                </Grid>
              )
            }
          </FormDataConsumer>
          <FormDataConsumer>
            {({ formData, ...rest }) =>
              formData.id_cliente &&
              (formData.medio_pago === 'recibo' ? (
                <Recibo />
              ) : (
                <Acopio formData={formData} {...rest} />
              ))
            }
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
                <FormDataConsumer>
                  {({ getSource }) => (
                    <Grid item xs={8}>
                      <TimePickerComponent
                        className={styles.inputs}
                        source={getSource('hora_inicio')}
                        label="Hora de inicio"
                      />
                    </Grid>
                  )}
                </FormDataConsumer>

                <FormDataConsumer>
                  {({ getSource }) => (
                    <Grid item xs={8}>
                      <TimePickerComponent
                        className={styles.inputs}
                        source={getSource('hora_fin')}
                        label="Hora de finalizacion"
                      />
                    </Grid>
                  )}
                </FormDataConsumer>
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
