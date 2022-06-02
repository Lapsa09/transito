import React, { useState } from "react";
import { useCreate, useCreateSuggestionContext } from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "react-admin/node_modules/@mui/material";

function QuickCreate({ children, onCancel, handleSubmit }) {
  return (
    <Dialog fullWidth open onClose={onCancel} aria-label="Create post">
      <DialogTitle>Nuevo Cliente</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export function CreateCliente() {
  const [create] = useCreate("clientes");
  const { filter, onCancel, onCreate } = useCreateSuggestionContext();
  const [value, setValue] = useState(filter || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    create(
      "clientes/list",
      {
        data: {
          cliente: value,
        },
      },
      {
        onSuccess: ({ data }) => {
          setValue("");
          onCreate(data);
        },
      }
    );
  };
  return (
    <QuickCreate onCancel={onCancel} handleSubmit={handleSubmit}>
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
  const [create] = useCreate("operarios");
  const { filter, onCancel, onCreate } = useCreateSuggestionContext();
  const [value, setValue] = useState(
    typeof filter == "number"
      ? { legajo: filter, nombre: "" }
      : { legajo: "", nombre: filter } || {}
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    create(
      "operarios/list",
      {
        data: {
          ...value,
        },
      },
      {
        onSuccess: ({ data }) => {
          setValue("");
          onCreate(data);
        },
      }
    );
  };
  return (
    <QuickCreate onCancel={onCancel} handleSubmit={handleSubmit}>
      <TextField
        value={value}
        onChange={(e) => setValue({ ...value, legajo: e.target.value })}
        label="Legajo"
        autoFocus
      />
      <TextField
        value={value}
        onChange={(e) =>
          setValue({ ...value, nombre: e.target.value.toUpperCase() })
        }
        label="Cliente"
      />
    </QuickCreate>
  );
}
