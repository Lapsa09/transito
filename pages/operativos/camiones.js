import { Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import OperativosForm from "../../components/CamionesForm";
import { getOperativosCamiones } from "../../services/operativosService";
import { useRouter } from "next/router";
import styles from "../../styles/operativos.page.module.css";

function CamionesPage() {
  const [operativos, setOperativos] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useRouter();

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    setOperativos(await getOperativosCamiones());
  };

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      width: 300,
      valueFormatter: ({ value }) => DateTime.fromISO(value).toLocaleString(),
    },
    { field: "hora", headerName: "Hora", width: 300 },
    { field: "turno", headerName: "Turno", width: 300 },
    { field: "legajo", headerName: "Legajo", width: 300 },
    { field: "direccion", headerName: "Direccion", width: 300 },
    { field: "localidad", headerName: "Localidad", width: 300 },
    { field: "cp", headerName: "Codigo postal", width: 300 },
    { field: "dominio", headerName: "Dominio", width: 300 },
    { field: "origen", headerName: "Origen", width: 300 },
    { field: "localidad_origen", headerName: "Localidad Origen", width: 300 },
    { field: "destino", headerName: "Destino", width: 300 },
    { field: "localidad_destino", headerName: "Localidad Destino", width: 300 },
    { field: "licencia", headerName: "Nro licencia", width: 300 },
    {
      field: "remito",
      headerName: "Remito",
      width: 300,
      valueFormatter: ({ value }) => (value ? "SI" : "NO"),
    },
    {
      field: "carga",
      headerName: "Carga",
      width: 300,
      valueFormatter: ({ value }) => (value ? "SI" : "NO"),
    },
    { field: "resolucion", headerName: "Resolucion", width: 300 },
    { field: "acta", headerName: "Acta", width: 300 },
    { field: "motivo", headerName: "Motivo", width: 300 },
    {
      field: "hora_carga",
      headerName: "Hora de carga",
      width: 300,
      valueFormatter: ({ value }) =>
        DateTime.fromISO(value).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
    { field: "legajo_carga", headerName: "Legajo carga", width: 300 },
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
      <DataGrid rows={operativos} columns={columns} pageSize={50} />
    </div>
  );
}

export default CamionesPage;
