import React from "react";
import { Button, Modal, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LogoVL from "../assets/imgs/LOGO_V_LOPEZ.png";
import LogoOVT from "../assets/imgs/OVT_LETRAS_NEGRAS.png";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Operativos.page.module.css";

function OperativosLayout({
  columns,
  operativos,
  children,
  loading,
  open,
  handleOpen,
  handleClose,
}) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  return user?.rol === "ADMIN" ? (
    <div className={styles.Operativos}>
      <div className={styles.header}>
        <img src={LogoVL} alt="Logo Vicente Lopez" />
        <img src={LogoOVT} alt="Logo Observatorio Vial" />
        <div className="control_buttons">
          <Button
            color="error"
            variant="contained"
            onClick={() => navigate("/", { replace: true })}
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
        <img src={LogoVL} alt="Logo Vicente Lopez" />
        <img src={LogoOVT} alt="Logo Observatorio Vial" />
      </div>
      {children}
    </div>
  );
}

export default OperativosLayout;
