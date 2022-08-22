import { Dialog, DialogActions, DialogContent } from '@mui/material'
import React from 'react'
import {
  ArrayInput,
  AutocompleteInput,
  BooleanInput,
  Button,
  DateInput,
  Edit,
  FormDataConsumer,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from 'react-admin'
import { history } from '../../utils'
import {
  TimePickerComponent,
  CreateOperario,
  OpInput,
  TotalInput,
} from '../../components'
import styles from '../../styles/Sueldos.module.css'

export const EditServicio = (props) => {
  return (
    <Edit {...props}>
      <Dialog open fullWidth maxWidth="xl">
        <DialogContent>
          <SimpleForm>
            <div className={styles.flexForm}>
              <TextInput
                className={styles.inputs}
                disabled
                source="memo"
                label="Nº Memo"
                isRequired
              />
              <NumberInput className={styles.inputs} source="recibo" disabled />
              <div
                className={styles.inputs}
                style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
              >
                <DateInput
                  source="fecha_servicio"
                  disabled
                  className={styles.inputs}
                  label="Fecha del servicio"
                  isRequired
                />
                <BooleanInput source="feriado" label="Es feriado?" />
              </div>
            </div>
            <ArrayInput source="operarios">
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ getSource }) => (
                    <div className={styles.dbInput}>
                      <ReferenceInput
                        source={getSource('legajo')}
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
                      source={getSource('a_cobrar')}
                      formData={formData}
                      scopedFormData={scopedFormData}
                    />
                  )}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
            <FormDataConsumer>
              {({ formData, ...rest }) => (
                <TotalInput ops={formData.operarios} {...rest} />
              )}
            </FormDataConsumer>
          </SimpleForm>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              history.navigate('/sueldos/clientes', { replace: true })
            }
            label="ra.action.cancel"
          />
        </DialogActions>
      </Dialog>
    </Edit>
  )
}
