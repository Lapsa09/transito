import { Button, Modal, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import ControlDiarioForm from "../../components/ControlDiarioForm";
import { getControlesPaseo } from "../../services/controlDiarioService";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { DateTime } from "luxon";
import styles from "../../styles/Control.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../utils/redux/userSlice";
import LogoVL from "../../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../../public/OVT_LETRAS_NEGRAS.png";
import Image from "next/image";

function ControlPaseoPage() {
  const [controles, setControles] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useSelector(selectUser);
  const navigate = useRouter();

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
      valueFormatter: ({ value }) =>
        DateTime.fromISO(value, {
          zone: "America/Argentina/Buenos_Aires",
        })
          .plus({ day: 1 })
          .toLocaleString(),
      width: 100,
    },
    {
      field: "hora",
      headerName: "Hora",
      width: 100,
      valueFormatter: ({ value }) =>
        DateTime.fromISO(value, {
          zone: "America/Argentina/Buenos_Aires",
        }).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
    { field: "direccion", headerName: "Direccion", width: 250 },
    { field: "barrio", headerName: "Localidad", width: 150 },
    { field: "dominio", headerName: "Dominio", width: 150 },
    { field: "lp", headerName: "Legajo planilla", width: 150 },
    { field: "acta", headerName: "Acta", width: 150 },
    { field: "resolucion", headerName: "Resolucion", width: 150 },
    { field: "motivo", headerName: "Motivo", width: 250 },
    { field: "otro_motivo", headerName: "Otro motivo", width: 250 },
    { field: "turno", headerName: "Turno", width: 150 },
    {
      field: "fechacarga",
      headerName: "Fecha carga",
      width: 150,
      valueFormatter: ({ value }) =>
        value
          ? DateTime.fromSQL(value, {
              zone: "America/Argentina/Buenos_Aires",
            }).toLocaleString(DateTime.DATETIME_SHORT)
          : "",
    },
    { field: "lpcarga", headerName: "Legajo carga", width: 150 },
    { field: "mes", headerName: "Mes", width: 150 },
  ];
  return user.rol === "ADMIN" ? (
    <div className={styles.control_diario}>
      <div className={styles.header}>
        <Image src={LogoVL} width={300} height={70} layout="fixed" />
        <Image src={LogoOVT} width={150} height={70} layout="fixed" />
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
      </div>
      <Modal open={open} onClose={handleClose}>
        <ControlDiarioForm
          afterCreate={handleFetch}
          handleClose={handleClose}
        />
      </Modal>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      ) : (
        <DataGrid
          sx={{ textAlign: "center" }}
          rows={controles}
          columns={columns}
        />
      )}
    </div>
  ) : (
    <div className={styles.control_diario}>
      <ControlDiarioForm
        afterCreate={handleFetch}
        handleClose={() => navigate.back()}
      />
    </div>
  );
}

export default ControlPaseoPage;
