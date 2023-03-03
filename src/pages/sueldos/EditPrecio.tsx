import React from 'react'
import {
  Button,
  Edit,
  NumberInput,
  SaveButton,
  SimpleForm,
  Toolbar,
  useRedirect,
} from 'react-admin'
import CancelIcon from '@mui/icons-material/Cancel'
import styles from '../../styles/Sueldos.module.css'

function EditPrecio(props) {
  const redirect = useRedirect()
  return (
    <Edit
      mutationOptions={{ onSuccess: () => redirect('/sueldos') }}
      {...props}
    >
      <SimpleForm toolbar={<ToolBar />}>
        <NumberInput
          className={styles.inputs}
          source="precio_normal"
          label="Precio Normal"
          isRequired
        />
        <NumberInput
          className={styles.inputs}
          source="precio_pico"
          label="Precio Pico"
        />
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
export default EditPrecio
