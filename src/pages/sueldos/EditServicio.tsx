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

const EditServicio = (props) => {
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
          <NumberInput
            variant="standard"
            className={styles.inputs}
            source="recibo"
          />
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
                <>
                  <ReferenceInput
                    source={getSource('legajo')}
                    reference="operarios/list"
                  >
                    <AutocompleteInput
                      className={styles.dbInput}
                      variant="standard"
                      label="Operario"
                      optionText={(choice) => `${choice.id} ${choice.name}`}
                      isRequired
                      create={<CreateOperario />}
                    />
                  </ReferenceInput>

                  <TimePickerComponent
                    className={styles.inputs}
                    source={getSource('hora_inicio')}
                    label="Hora de inicio"
                  />

                  <TimePickerComponent
                    className={styles.inputs}
                    source={getSource('hora_fin')}
                    label="Hora de finalizacion"
                  />
                  <OpInput source={getSource('a_cobrar')} />
                </>
              )}
            </FormDataConsumer>
          </SimpleFormIterator>
        </ArrayInput>

        <TotalInput />
      </SimpleForm>
    </Edit>
  )
}

function ToolBar() {
  const navigate = useRedirect()
  return (
    <Toolbar sx={style.toolbar}>
      <Button
        size="medium"
        variant="contained"
        sx={style.toolbarButton}
        onClick={() => navigate('-1')}
        startIcon={<CancelIcon />}
        label="Cancelar"
      />
      <SaveButton>Guardar</SaveButton>
    </Toolbar>
  )
}

const style = {
  toolbar: {
    gap: '10px',
  },
  toolbarButton: {
    backgroundColor: 'red',
  },
}

export default EditServicio
