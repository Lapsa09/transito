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
  useCreate,
  useRedirect,
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

function NuevoCliente() {
  const [create] = useCreate()
  const history = useRedirect()
  const save = useCallback(
    (values) => {
      create(
        'clientes',
        { data: values },
        {
          returnPromise: true,
          onError: (error) => console.log(error),
          onSuccess: () => {
            history(-1)
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
          <Grid item xs={8}>
            <ReferenceInput source="id_cliente" reference="clientes/list">
              <AutocompleteInput
                variant="standard"
                label="Cliente"
                className={styles.inputs}
                translateChoice={false}
                optionText="name"
                isRequired
                create={<CreateCliente />}
              />
            </ReferenceInput>
          </Grid>
          <FormDataConsumer>
            {({ formData }) =>
              formData.id_cliente && (
                <Grid item xs={8}>
                  <RadioButtonGroupInput
                    source="medio_pago"
                    label="Medio de pago"
                    translateChoice={false}
                    defaultValue="recibo"
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
            {({ formData }) =>
              formData.id_cliente &&
              (formData.medio_pago === 'recibo' ? <Recibo /> : <Acopio />)
            }
          </FormDataConsumer>
          <Grid item xs={6}>
            <DatePickerComponent
              source="fecha_servicio"
              className={styles.inputs}
              label="Fecha del servicio"
            />
          </Grid>
          <Grid item xs={2}>
            <BooleanInput source="feriado" label="Es feriado?" />
          </Grid>
          <Grid container item columns={{ xs: 8, md: 1 }}>
            <ArrayInput source="operarios">
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ getSource }) => (
                    <>
                      <Grid item xs={8} sx={{ display: 'flex' }}>
                        <ReferenceInput
                          source={getSource('legajo')}
                          reference="operarios/list"
                        >
                          <AutocompleteInput
                            variant="standard"
                            label="Operario"
                            optionText={(choice) =>
                              `${choice.id} ${choice.name}`
                            }
                            className={styles.inputs}
                            isRequired
                            create={<CreateOperario />}
                          />
                        </ReferenceInput>
                      </Grid>
                      <Grid item xs={8}>
                        <TimePickerComponent
                          className={styles.inputs}
                          source={getSource('hora_inicio')}
                          label="Hora de inicio"
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <TimePickerComponent
                          className={styles.inputs}
                          source={getSource('hora_fin')}
                          label="Hora de finalizacion"
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <OpInput source={getSource('a_cobrar')} />
                      </Grid>
                    </>
                  )}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </Grid>
        </Grid>
        <TotalInput />
      </SimpleForm>
    </Create>
  )
}

export default NuevoCliente
