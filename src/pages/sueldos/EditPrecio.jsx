import React from 'react'
import { Button, Edit, NumberInput, SimpleForm } from 'react-admin'
import styles from '../../styles/Sueldos.module.css'

function EditPrecio(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
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
      <Button
        onClick={() => history.navigate('/sueldos', { replace: true })}
        label="ra.action.cancel"
      />
    </Edit>
  )
}

export default EditPrecio
