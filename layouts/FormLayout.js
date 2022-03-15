import { Box, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import { selectUser } from "../utils/redux/userSlice";
import { adminStyle, inspectorStyle } from "../components/utils";
import { useSelector } from "react-redux";
import LogoVL from "../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../public/OVT_LETRAS_NEGRAS.png";
import { DateTime } from "luxon";
import CustomStepper from "../components/ui/CustomStepper";
import { useRouter } from "next/router";
import styles from "../styles/FormLayout.module.css";

function FormLayout({
  children,
  steps,
  activeStep,
  setActiveStep,
  nuevoOperativo,
  handleClose,
  isValid,
  handleSubmit,
  isCompleted,
}) {
  const user = useSelector(selectUser);
  const handleRol = () => user.rol === "ADMIN";
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handlePath = () => {
    const [path] = router.asPath.split("?");
    switch (path) {
      case "/control/diario":
        return "diario";
      case "/control/paseo":
        return "paseo";
      case "/operativos/autos":
        return "auto";
      case "/operativos/motos":
        return "motos";
      case "/operativos/camiones":
        return "camiones";
    }
  };

  const totalSteps = () => {
    return steps.length;
  };

  const isFirstStep = () => {
    return activeStep === 0;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    if (isCompleted(steps[activeStep]?.values)) saveOp();
    setActiveStep(activeStep + 1);
  };

  const saveOp = () => {
    const expirationTime = JSON.parse(
      localStorage.operativo || null
    )?.expiresAt;
    localStorage.setItem(
      handlePath(),
      JSON.stringify({
        ...steps[0].values,
        expiresAt:
          expirationTime || DateTime.now().plus({ hours: 8 }).toMillis(),
      })
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    if (isCompleted(steps[activeStep]?.values)) saveOp();
    setActiveStep(step);
  };

  return (
    <Box sx={handleRol() ? adminStyle : inspectorStyle} className={styles.form}>
      <div className={styles.header}>
        <Image src={LogoVL} width={250} height={70} layout="fixed" />
        <Button onClick={handleClose}>Cerrar</Button>
        <Button color="error" onClick={() => setOpen(true)} sx={{ mr: 1 }}>
          Nuevo Operativo
        </Button>
        <Image src={LogoOVT} width={150} height={70} layout="fixed" />
      </div>
      <Box component="form" className={styles.form__box} autoComplete="off">
        <CustomStepper
          steps={steps}
          isCompleted={isCompleted}
          handleStep={handleStep}
          activeStep={activeStep}
        />
        {children}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button disabled={isFirstStep()} onClick={handleBack} sx={{ mr: 1 }}>
            Anterior
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep === 0 ? (
            <Button onClick={handleNext} disabled={isLastStep()} sx={{ mr: 1 }}>
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isValid || activeStep === 0}
              onClick={handleSubmit}
            >
              Guardar
            </Button>
          )}
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <WarningModal reset={nuevoOperativo} setOpen={setOpen} />
      </Modal>
    </Box>
  );
}

const WarningModal = ({ setOpen, reset }) => {
  return (
    <Box sx={adminStyle}>
      <p>
        Seguro que desea reiniciar el operativo? Se borraran todos los datos
        ingresados
      </p>
      <Box sx={{ display: "flex" }}>
        <Button onClick={() => setOpen(false)}>No</Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Si
        </Button>
      </Box>
    </Box>
  );
};

export default FormLayout;
