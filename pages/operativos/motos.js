import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { getOperativosMotos } from "../../services/operativosService";
import MotosForm from "../../components/forms/MotosForm";
import Layout from "../../layouts/OperativosLayout";

function MotosPage() {
  const [operativos, setOperativos] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    setOperativos(await getOperativosMotos());
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
    <Layout
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      columns={columns}
      operativos={operativos}
      loading={loading}
    >
      <MotosForm afterCreate={handleFetch} handleClose={handleClose} />
    </Layout>
  );
}

export default MotosPage;
