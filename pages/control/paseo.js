import React, { useEffect, useState } from "react";
import ControlPaseoForm from "../../components/forms/ControlPaseoForm";
import { getControlesPaseo } from "../../services/controlDiarioService";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "../../utils/redux/userSlice";
import Layout from "../../layouts/OperativosLayout";
import { dateFormat, dateTimeFormat, timeFormat } from "../../utils/dates";

function ControlPaseoPage() {
  const [controles, setControles] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useSelector(selectUser);
  const navigate = useRouter();
  const handleRol = () => user?.rol === "ADMIN";

  const firstCall = async () => {
    setLoading(true);
    await handleFetch();
    setLoading(false);
  };

  const handleFetch = async () => {
    setControles(await getControlesPaseo());
  };

  useEffect(() => {
    firstCall();
  }, []);

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
    { field: "lp", headerName: "Legajo planilla", width: 150 },
    { field: "turno", headerName: "Turno", width: 150 },
    { field: "direccion", headerName: "Direccion", width: 250 },
    { field: "dominio", headerName: "Dominio", width: 150 },
    { field: "barrio", headerName: "Localidad", width: 150 },
    { field: "motivo", headerName: "Motivo", width: 250 },
    { field: "resolucion", headerName: "Resolucion", width: 150 },
    { field: "acta", headerName: "Acta", width: 150 },
    {
      field: "fechacarga",
      headerName: "Fecha carga",
      width: 150,
      valueFormatter: ({ value }) => (value ? dateTimeFormat(value) : ""),
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
      operativos={controles}
    >
      <ControlPaseoForm
        afterCreate={handleFetch}
        handleClose={handleRol() ? handleClose : navigate.back()}
      />
    </Layout>
  );
}

export default ControlPaseoPage;
