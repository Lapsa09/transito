import React, { useState } from "react";
import ControlDiarioForm from "../../components/forms/ControlDiarioForm";
import { getControles } from "../../services/controlDiarioService";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import Layout from "../../layouts/OperativosLayout";
import { dateFormat, dateTimeSQLFormat, timeFormat } from "../../utils";
import { useData } from "../../hooks";

function ControlDiarioPage() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useSelector(selectUser);
  const navigate = useRouter();
  const handleRol = () => user?.rol === "ADMIN";
  const { data, loading, refresh } = useData(getControles);

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      valueFormatter: ({ value }) => dateFormat(value),
      width: 100,
    },
    {
      field: "hora",
      headerName: "Hora",
      width: 100,
      valueFormatter: ({ value }) => timeFormat(value),
    },
    { field: "legajo_planilla", headerName: "Legajo planilla", width: 150 },
    { field: "turno", headerName: "Turno", width: 150 },
    { field: "direccion", headerName: "Direccion", width: 250 },
    { field: "dominio", headerName: "Dominio", width: 150 },
    { field: "barrio", headerName: "Localidad", width: 150 },
    { field: "motivo", headerName: "Motivo", width: 250 },
    { field: "otro_motivo", headerName: "Otro motivo", width: 250 },
    { field: "resolucion", headerName: "Resolucion", width: 150 },
    { field: "acta", headerName: "Acta", width: 150 },
    {
      field: "fechacarga",
      headerName: "Fecha carga",
      width: 150,
      valueFormatter: ({ value }) => (value ? dateTimeSQLFormat(value) : ""),
    },
    { field: "lpcarga", headerName: "Legajo carga", width: 150 },
    { field: "mes", headerName: "Mes", width: 150 },
  ];
  return (
    <Layout
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      loading={loading}
      columns={columns}
      operativos={data}
    >
      <ControlDiarioForm
        afterCreate={refresh}
        handleClose={handleRol() ? handleClose : navigate.back()}
      />
    </Layout>
  );
}

export default ControlDiarioPage;
