import { Button, Modal, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/operativos.page.module.css";
import LogoVL from "../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../public/OVT_LETRAS_NEGRAS.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectUser } from "../utils/redux/userSlice";

function OperativosLayout({
  columns,
  operativos,
  children,
  loading,
  open,
  handleOpen,
  handleClose,
}) {
  const navigate = useRouter();
  const user = useSelector(selectUser);
  return user.rol === "ADMIN" ? (
    <div className={styles.Operativos}>
      <div className={styles.header}>
        <Image src={LogoVL} width={300} height={70} layout="fixed" />
        <Image src={LogoOVT} width={150} height={70} layout="fixed" />
        <div className="control_buttons">
          <Button
            color="error"
            variant="contained"
            onClick={() => navigate.replace("/")}
          >
            Atras
          </Button>
          <Button variant="contained" onClick={handleOpen}>
            Nuevo
          </Button>
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        {children}
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
  ) : (
    <div className={styles.Operativos}>
      <div className={styles.header}>
        <Image src={LogoVL} width={300} height={70} layout="fixed" />
        <Image src={LogoOVT} width={150} height={70} layout="fixed" />
      </div>
      {children}
    </div>
  );
}

export default OperativosLayout;
