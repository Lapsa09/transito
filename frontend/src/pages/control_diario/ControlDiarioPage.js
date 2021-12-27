import { Button, Modal, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import ControlDiarioForm from "../../components/control_diario.components/ControlDiarioForm";
import {
  getControles,
  getControlesPaseo,
} from "../../services/controlDiarioService";
import { DataGrid } from "@mui/x-data-grid";
import "./controlDiarioPage.css";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

function ControlDiarioPage() {
  const [controles, setControles] = useState([]);
  const [alignment, setAlignment] = useState(1);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleFetch();
  }, [alignment]);

  const handleFetch = async () => {
    setControles(alignment === 1 ? await getControles() : getControlesPaseo());
  };

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      width: 150,
      valueFormatter: ({ value }) => DateTime.fromISO(value).toLocaleString(),
    },
    { field: "hora", headerName: "Hora", width: 150 },
    { field: "direccion", headerName: "Direccion", width: 250 },
    { field: "localidad", headerName: "Localidad", width: 150 },
    { field: "dominio", headerName: "Dominio", width: 150 },
    { field: "lp", headerName: "Legajo planilla", width: 150 },
    { field: "acta", headerName: "Acta", width: 150 },
    { field: "resolucion", headerName: "Resolucion", width: 150 },
    { field: "motivo", headerName: "Motivo", width: 250 },
    { field: "otro_motivo", headerName: "Otro motivo", width: 250 },
    { field: "turno", headerName: "Turno", width: 150 },
    { field: "fechacarga", headerName: "Fecha carga", width: 150 },
    { field: "lpcarga", headerName: "Legajo carga", width: 150 },
    { field: "fecha", headerName: "Fecha", width: 150 },
    { field: "mes", headerName: "Mes", width: 150 },
  ];
  return (
    <div className="control_diario">
      <div className="buttons">
        <Button variant="contained" onClick={() => navigate("/")}>
          Atras
        </Button>
        <Button variant="contained" onClick={handleOpen}>
          Nuevo
        </Button>
      </div>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChangeAlignment}
      >
        <ToggleButton value={1}>Normal</ToggleButton>
        <ToggleButton value={2}>Paseo de la costa</ToggleButton>
      </ToggleButtonGroup>
      <Modal open={open} onClose={handleClose}>
        <ControlDiarioForm
          afterCreate={handleFetch}
          handleClose={handleClose}
        />
      </Modal>
      <DataGrid rows={controles} columns={columns} pageSize={50} />
    </div>
  );
}

export default ControlDiarioPage;
