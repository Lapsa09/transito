import React from 'react'
import {
  ArrayInput,
  AutocompleteInput,
  BooleanInput,
  Button,
  Edit,
  FormDataConsumer,
  NumberInput,
  ReferenceInput,
  SaveButton,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  Toolbar,
  useRedirect,
} from 'react-admin'
import {
  TimePickerComponent,
  CreateOperario,
  OpInput,
  TotalInput,
  DatePickerComponent,
} from '../../components'
import styles from '../../styles/Sueldos.module.css'
import CancelIcon from '@mui/icons-material/Cancel'

export const EditServicio = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm toolbar={<ToolBar />}>
        <div className={styles.flexForm}>
          <TextInput
            variant="standard"
            className={styles.inputs}
            source="memo"
            label="Nº Memo"
            isRequired
          />
          <NumberInput className={styles.inputs} source="recibo" />
          <div
            className={styles.inputs}
            style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
          >
            <DatePickerComponent
              source="fecha_servicio"
              className={styles.inputs}
              label="Fecha del servicio"
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
                      variant="standard"
                      label="Operario"
                      optionText={(choice) => `${choice.id} ${choice.name}`}
                      isRequired
                    />
                  </ReferenceInput>
                  <CreateOperario />
                </div>
              )}
            </FormDataConsumer>
            <FormDataConsumer>
              {({ scopedFormData, getSource }) => (
                <TimePickerComponent
                  className={styles.inputs}
                  source={getSource('hora_inicio')}
                  label="Hora de inicio"
                  value={scopedFormData.hora_inicio}
                />
              )}
            </FormDataConsumer>
            <FormDataConsumer>
              {({ scopedFormData, getSource }) => (
                <TimePickerComponent
                  className={styles.inputs}
                  source={getSource('hora_fin')}
                  label="Hora de finalizacion"
                  value={scopedFormData.hora_fin}
                />
              )}
            </FormDataConsumer>
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
    </Edit>
  )
}

function ToolBar() {
  const navigate = useRedirect()
  return (
    <Toolbar sx={{ gap: '10px' }}>
      <Button
        size="medium"
        variant="contained"
        color="error"
        onClick={() => navigate('/sueldos')}
        startIcon={<CancelIcon />}
        label="Cancelar"
      />
      <SaveButton>Guardar</SaveButton>
    </Toolbar>
  )
}
