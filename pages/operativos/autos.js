import { Button, Modal, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import OperativosForm from "../../components/AutosForm";
import { getOperativosAutos } from "../../services/operativosService";
import { useRouter } from "next/router";
import styles from "../../styles/operativos.page.module.css";

function AutosPage() {
  const [operativos, setOperativos] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useRouter();

  useEffect(() => {
    firstCall();
  }, []);

  const handleFetch = async () => {
    setOperativos(await getOperativosAutos());
  };

  const firstCall = async () => {
    setLoading(true);
    await handleFetch();
    setLoading(false);
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
    { field: "barrio", headerName: "Localidad", width: 300 },
    { field: "cp", headerName: "Codigo postal", width: 300 },
    { field: "legajo_a_cargo", headerName: "Legajo a cargo", width: 300 },
    { field: "legajo_planilla", headerName: "Legajo planilla", width: 300 },
    { field: "turno", headerName: "Turno", width: 300 },
    { field: "seguridad", headerName: "Seguridad", width: 300 },
    { field: "dominio", headerName: "Dominio", width: 300 },
    { field: "licencia", headerName: "Nro licencia", width: 300 },
    { field: "tipo_licencia", headerName: "Tipo licencia", width: 300 },
    { field: "tipo_vehiculo", headerName: "Tipo licencia", width: 300 },
    {
      field: "zona_infractor",
      headerName: "Localidad del infractor",
      width: 300,
    },
    { field: "acta", headerName: "Acta", width: 300 },
    { field: "motivo", headerName: "Motivo", width: 300 },
    {
      field: "graduacion_alcoholica",
      headerName: "Graduacion Alcoholica",
      width: 300,
    },
    { field: "resolucion", headerName: "Resolucion", width: 300 },
    {
      field: "fechacarga",
      headerName: "Fecha de carga",
      width: 300,
      valueFormatter: ({ value }) => DateTime.fromISO(value).toLocaleString(),
    },
    { field: "lpcarga", headerName: "Legajo carga", width: 300 },
    { field: "mes", headerName: "Mes", width: 300 },
    { field: "semana", headerName: "Semana", width: 300 },
    { field: "es_del", headerName: "Es del", width: 300 },
    { field: "resultado", headerName: "Resultado", width: 300 },
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
        <OperativosForm afterCreate={handleFetch} handleClose={handleClose} />
      </Modal>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      ) : (
        <DataGrid rows={operativos} columns={columns} />
      )}
    </div>
  );
}

export default AutosPage;
