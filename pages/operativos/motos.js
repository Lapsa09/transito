import { Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { getOperativosMotos } from "../../services/operativosService";
import { useRouter } from "next/router";
import styles from "../../styles/operativos.page.module.css";
import MotosForm from "../../components/MotosForm";

function MotosPage() {
  const [operativos, setOperativos] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useRouter();

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    setOperativos(await getOperativosMotos());
  };

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      width: 300,
      valueFormatter: ({ value }) => DateTime.fromISO(value).toLocaleString(),
    },
    { field: "hora", headerName: "Hora", width: 300 },
    { field: "direccion", headerName: "Direccion", width: 300 },
    { field: "zona", headerName: "Localidad", width: 300 },
    { field: "cp", headerName: "Codigo postal", width: 300 },
    { field: "legajo_a_cargo", headerName: "Legajo a cargo", width: 300 },
    { field: "legajo_planilla", headerName: "Legajo planilla", width: 300 },
    { field: "turno", headerName: "Turno", width: 300 },
    { field: "seguridad", headerName: "Seguridad", width: 300 },
    { field: "dominio", headerName: "Dominio", width: 300 },
    { field: "licencia", headerName: "Nro licencia", width: 300 },
    { field: "tipo_licencia", headerName: "Tipo licencia", width: 300 },
    { field: "motivo1", headerName: "Motivo 1", width: 300 },
    { field: "motivo2", headerName: "Motivo 2", width: 300 },
    { field: "motivo3", headerName: "Motivo 3", width: 300 },
    { field: "motivo4", headerName: "Motivo 4", width: 300 },
    { field: "motivo5", headerName: "Motivo 5", width: 300 },
    {
      field: "zona_infractor",
      headerName: "Localidad del infractor",
      width: 300,
    },
    { field: "acta", headerName: "Acta", width: 300 },
    { field: "resolucion", headerName: "Resolucion", width: 300 },
    {
      field: "fechacarga",
      headerName: "Fecha de carga",
      width: 300,
      valueFormatter: ({ value }) => DateTime.fromISO(value).toLocaleString(),
    },
    { field: "lpcarga", headerName: "Legajo carga", width: 300 },
  ];

  return (
    <div className={styles.Operativos}>
      <div className="control_buttons">
        <Button
          color="error"
          variant="contained"
          onClick={() => navigate.push("/")}
        >
          Atras
        </Button>
        <Button variant="contained" onClick={handleOpen}>
          Nuevo
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <MotosForm afterCreate={handleFetch} handleClose={handleClose} />
      </Modal>
      <DataGrid rows={operativos} columns={columns} pageSize={50} />
    </div>
  );
}

export default MotosPage;
