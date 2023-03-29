import { Button, Box } from '@mui/material'
import React from 'react'
import { MovilesTable, OperariosTable } from '../../components'
import { useLocalStorage } from '../../hooks'

function Radio() {
  const [table, setTable] = useLocalStorage('tabla')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 2,
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: '25%' }}
      >
        <Button variant="outlined" onClick={() => setTable('operarios')}>
          Operarios
        </Button>
        <Button variant="outlined" onClick={() => setTable('moviles')}>
          Moviles
        </Button>
      </Box>
      {table === 'operarios' ? (
        <OperariosTable table={table} />
      ) : (
        <MovilesTable table={table} />
      )}
    </Box>
  )
}

export default Radio
