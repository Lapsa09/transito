import React, { useState } from "react";
import { getOperativosMotos } from "../../services/operativosService";
import MotosForm from "../../components/forms/MotosForm";
import Layout from "../../layouts/OperativosLayout";
import { dateFormat, dateTimeFormat, timeFormat } from "../../utils";
import { useData } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";

function MotosPage() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const user = useSelector(selectUser);
  const router = useNavigate();
  const handleRol = () => user?.rol === "ADMIN";
  const { data, loading, refresh } = useData(getOperativosMotos);

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      width: 300,
      valueFormatter: ({ value }) => dateFormat(value),
    },
    {
      field: "hora",
      headerName: "Hora",
      width: 300,
      valueFormatter: ({ value }) => timeFormat(value),
    },
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
    {
      field: "motivos",
      headerName: "Motivos",
      width: 1000,
      valueFormatter: ({ value }) => value.toString(),
    },
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
      valueFormatter: ({ value }) => dateTimeFormat(value),
    },
    { field: "lpcarga", headerName: "Legajo carga", width: 300 },
  ];

  return (
    <Layout
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      columns={columns}
      operativos={data}
      loading={loading}
    >
      <MotosForm
        afterCreate={refresh}
        handleClose={handleRol() ? handleClose : router("-1")}
      />
    </Layout>
  );
}

export default MotosPage;
