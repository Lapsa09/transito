import { Box } from "@mui/material";
import React from "react";
import Image from "next/image";
import style from "../styles/controlDiarioForm.module.css";
import { selectUser } from "../utils/redux/userSlice";
import { adminStyle, inspectorStyle } from "../components/utils";
import { useSelector } from "react-redux";
import LogoVL from "../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../public/OVT_LETRAS_NEGRAS.png";

function FormLayout({ children, classes }) {
  const user = useSelector(selectUser);
  const handleRol = () => user.rol === "ADMIN";
  return (
    <Box
      sx={handleRol() ? adminStyle : inspectorStyle}
      className={`form ${classes}`}
    >
      <div className={style.header}>
        <Image
          className={style.logo}
          src={LogoVL}
          width={250}
          height={70}
          layout="fixed"
        />
        <Image
          className={style.logo}
          src={LogoOVT}
          width={150}
          height={70}
          layout="fixed"
        />
      </div>
      {children}
    </Box>
  );
}

export default FormLayout;
