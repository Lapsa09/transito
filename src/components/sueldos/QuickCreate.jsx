import React, { Fragment, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import styles from '../../styles/Sueldos.module.css';
import { useCreate } from 'react-admin';

function QuickCreate({ children, handleSubmit, title, reset }) {
  const [open, setOpen] = useState(false);

  const handleExit = () => {
    reset();
    setOpen(false);
  };
  return (
    <Fragment>
      <Button
        className={styles.button}
        onClick={() => setOpen(true)}
        label="ra.action.create"
      >
        <Add />
      </Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleExit}
        aria-label="Create post"
      >
        <DialogTitle>{title}</DialogTitle>

        <form
          onSubmit={(e) => {
            handleSubmit(e);
            handleExit();
          }}
        >
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            <Button onClick={handleExit}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}

export function CreateCliente() {
  const [value, setValue] = useState('');
  const reset = () => setValue('');
  const [create] = useCreate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    create('clientes/list', { data: { cliente: value } });
  };
  return (
    <QuickCreate
      handleSubmit={handleSubmit}
      reset={reset}
      title="Nuevo Cliente"
    >
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        label="Cliente"
        autoFocus
      />
    </QuickCreate>
  );
}

export function CreateOperario() {
  const [value, setValue] = useState({ id: '', name: '' });
  const reset = () => setValue('');
  const [create] = useCreate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    create('operarios/list', { data: { ...value } });
  };
  return (
    <QuickCreate
      handleSubmit={handleSubmit}
      reset={reset}
      title="Nuevo Operario"
    >
      <TextField
        value={value.id}
        type="number"
        onChange={(e) => setValue({ ...value, id: e.target.value })}
        label="Legajo"
        autoFocus
      />
      <TextField
        value={value.name}
        onChange={(e) =>
          setValue({ ...value, name: e.target.value.toUpperCase() })
        }
        label="Cliente"
      />
    </QuickCreate>
  );
}

export function CreateRecibo({ setData }) {
  const [value, setValue] = useState('');
  const reset = () => setValue('');
  const handleSubmit = (e) => {
    e.preventDefault();
    setData((data) => [
      ...data,
      {
        id: 0,
        recibo: value,
        fecha_recibo: new Date(),
        importe_recibo: '',
      },
    ]);
  };
  return (
    <QuickCreate handleSubmit={handleSubmit} reset={reset} title="Nuevo Recibo">
      <TextField
        type="number"
        className={styles.inputs}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="Nº de recibo"
      />
    </QuickCreate>
  );
}
