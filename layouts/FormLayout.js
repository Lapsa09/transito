import { Box, Button, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { selectUser } from "../utils/redux/userSlice";
import { adminStyle, inspectorStyle } from "../components/utils";
import { useSelector } from "react-redux";
import LogoVL from "../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../public/OVT_LETRAS_NEGRAS.png";
import CustomStepper from "../components/ui/CustomStepper";
import styles from "../styles/FormLayout.module.css";
import CustomStepForm from "../components/ui/CustomStepForm";
import { currentDate, dateTimeFormat } from "../utils/dates";
import CustomSnackbar from "../components/ui/CustomSnackbar";

function FormLayout({
  children,
  steps,
  activeStep,
  setActiveStep,
  handleClose,
  isValid,
  handleSubmit,
  path,
  fillSelectsEvent,
  submitEvent,
}) {
  const user = useSelector(selectUser);
  const handleRol = () => user.rol === "ADMIN";
  const [open, setOpen] = useState(false);
  const [openSB, setOpenSB] = useState(false);
  const [response, setResponse] = useState({ severity: "", message: "" });

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

  const fillSelects = async () => {
    try {
      await fillSelectsEvent();
    } catch (error) {
      showSnackbar("error", error.response?.data);
    }
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
          expirationTime || currentDate().plus({ hours: 8 }).toMillis(),
      })
    );
  };

  useEffect(() => {
    fillSelects();
    cargarOperativo();
  }, []);

  const cargarOperativo = () => {
    try {
      const operativos = JSON.parse(localStorage.getItem(path));
      if (currentDate().toMillis() < operativos.expiresAt) {
        Object.entries(operativos).forEach(([key, value]) => {
          if (key === "fecha") setValue(key, dateTimeFormat(value));
          else setValue(key, value);
        });
        isCompleted(operativos) && setActiveStep(1);
      } else nuevoOperativo();
    } catch (error) {
      return;
    }
  };

  const showSnackbar = (severity, message) => {
    setResponse({ severity, message });
    setOpenSB(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSB(false);
  };

  const submiting = async (data) => {
    try {
      await submitEvent(data);
      showSnackbar("success", "Cargado con exito");
    } catch (error) {
      showSnackbar("error", error.response?.data);
    }
  };

  const nuevoOperativo = () => {
    localStorage.removeItem(path);
    reset(
      {
        lpcarga: user.legajo,
      },
      { keepDefaultValues: true }
    );
    setActiveStep(0);
  };

  const isCompleted = (values) => {
    try {
      const step = Object.values(values);
      return step.every((value) => Boolean(value));
    } catch (error) {
      return false;
    }
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
      <div className={styles.form__form}>
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
              onClick={handleSubmit(submiting)}
            >
              Guardar
            </Button>
          )}
        </Box>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <WarningModal reset={nuevoOperativo} setOpen={setOpen} />
      </Modal>
      <CustomSnackbar
        res={response}
        open={openSB}
        handleClose={closeSnackbar}
      />
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
