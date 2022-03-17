import { Box, Button, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import CustomStepForm from "../components/ui/CustomStepForm";

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
  path,
}) {
  const user = useSelector(selectUser);
  const handleRol = () => user.rol === "ADMIN";
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
      localStorage.getItem(path) || null
    )?.expiresAt;
    localStorage.setItem(
      path,
      JSON.stringify({
        ...steps[0].values,
        expiresAt:
          expirationTime || DateTime.now().plus({ hours: 8 }).toMillis(),
      })
    );
  };

  useEffect(() => {
    console.log(children);
  }, []);

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
      <div>
        <CustomStepper
          steps={steps}
          isCompleted={isCompleted}
          handleStep={handleStep}
          activeStep={activeStep}
        />
        <Box component="form" className={styles.form__box} autoComplete="off">
          {children?.map((child, index) => (
            <CustomStepForm activeStep={activeStep} step={index}>
              {child}
            </CustomStepForm>
          ))}
        </Box>
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
      </div>
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
