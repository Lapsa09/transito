import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import OperativosForm from "../../components/forms/AutosForm";
import { getOperativosAutos } from "../../services/operativosService";
import Layout from "../../layouts/OperativosLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "../../utils/redux/userSlice";

function AutosPage() {
  const [operativos, setOperativos] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter();
  const user = useSelector(selectUser);
  const handleRol = () => user?.rol === "ADMIN";

  useEffect(() => {
    firstCall();
  }, []);

  const firstCall = async () => {
    setLoading(true);
    await handleFetch();
    setLoading(false);
  };

  const handleFetch = async () => {
    setOperativos(await getOperativosAutos());
  };

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      width: 300,
      valueFormatter: ({ value }) =>
        DateTime.fromISO(value).toFormat("dd/MM/yyyy"),
    },
    {
      field: "hora",
      headerName: "Hora",
      width: 300,
      valueFormatter: ({ value }) => DateTime.fromISO(value).toFormat("HH:mm"),
    },
    { field: "qth", headerName: "Direccion", width: 300 },
    { field: "barrio", headerName: "Localidad", width: 300 },
    { field: "cp", headerName: "Codigo postal", width: 300 },
    { field: "legajo_a_cargo", headerName: "Legajo a cargo", width: 300 },
    { field: "legajo_planilla", headerName: "Legajo planilla", width: 300 },
    { field: "turno", headerName: "Turno", width: 300 },
    { field: "seguridad", headerName: "Seguridad", width: 300 },
    { field: "dominio", headerName: "Dominio", width: 300 },
    { field: "licencia", headerName: "Nro licencia", width: 300 },
    { field: "tipo_licencia", headerName: "Tipo licencia", width: 300 },
    { field: "tipo_vehiculo", headerName: "Tipo Vehiculo", width: 300 },
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
      valueFormatter: ({ value }) =>
        DateTime.fromISO(value).toFormat("dd/MM/yyyy HH:mm"),
    },
    { field: "lpcarga", headerName: "Legajo carga", width: 300 },
    { field: "mes", headerName: "Mes", width: 300 },
    { field: "semana", headerName: "Semana", width: 300 },
    { field: "es_del", headerName: "Es del", width: 300 },
    { field: "resultado", headerName: "Resultado", width: 300 },
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
      <OperativosForm
        afterCreate={handleFetch}
        handleClose={handleRol() ? handleClose : router.back()}
      />
    </Layout>
  );
}

export default AutosPage;
