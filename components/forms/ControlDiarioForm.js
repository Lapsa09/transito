import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getLocalidades,
  getMotivos,
  getMotivosPaseo,
  nuevoControl,
  nuevoControlPaseo,
} from "../../services/controlDiarioService";
import { getResolucion, getTurnos } from "../../services/index";
import CustomDatePicker from "../ui/DatePicker";
import CustomTimePicker from "../ui/TimePicker";
import CustomSnackbar from "../ui/CustomSnackbar";
import style from "../../styles/FormLayout.module.css";
import { selectUser } from "../../utils/redux/userSlice";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import CustomTextField from "../ui/CustomTextField";
import CustomSelect from "../ui/CustomSelect";
import CustomAutocomplete from "../ui/CustomAutocomplete";
import { useRouter } from "next/router";
import { DateTime } from "luxon";
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from "../../utils/validations";
import Layout from "../../layouts/FormLayout";

function ControlDiarioForm({ handleClose, afterCreate }) {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({ mode: "all" });
  const [resolucion, setResolucion] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ severity: "", message: "" });
  const [activeStep, setActiveStep] = useState(0);
  const user = useSelector(selectUser);
  const router = useRouter();
  const handleRol = () => user.rol === "ADMIN";

  const steps = () => {
    const [
      fecha,
      hora,
      direccion,
      turno,
      dominio,
      lp,
      resolucion,
      motivo,
      localidadInfractor,
    ] = watch([
      "fecha",
      "hora",
      "direccion",
      "turno",
      "dominio",
      "lp",
      "resolucion",
      "motivo",
      "localidadInfractor",
    ]);
    return [
      {
        label: "Operativo",
        values: {
          fecha,
          direccion,
          turno,
          lp,
        },
      },
      {
        label: "Vehiculo",
        values: {
          hora,
          dominio,
          resolucion,
          motivo,
          localidadInfractor,
        },
      },
    ];
  };

  const submitting = async (data) => {
    try {
      checkPath() ? await nuevoControl(data) : await nuevoControlPaseo(data);
      reset({ ...data, dominio: "", localidadInfractor: null });
      if (handleRol()) {
        showSnackbar("success", "Cargado con exito");
        await afterCreate();
      } else {
        showSnackbar("success", "Cargado con exito");
        setTimeout(handleClose, 2000);
      }
    } catch (error) {
      showSnackbar("error", error.response.data);
    }
  };

  const checkPath = () => {
    const path = router.asPath.split("?")[0];
    return path === "/control/diario";
  };

  useEffect(() => {
    const fillSelects = async () => {
      try {
        const [barrios, motivos, turnos, resoluciones] = await Promise.all([
          getLocalidades(),
          checkPath() ? getMotivos() : getMotivosPaseo(),
          getTurnos(),
          getResolucion(),
        ]);
        setLocalidades(barrios);
        setMotivos(motivos);
        setTurnos(turnos);
        setResolucion(resoluciones);
      } catch (error) {
        showSnackbar("error", error.response?.data);
      }
    };
    fillSelects();
    setValue("lpcarga", user.legajo);
    if (!handleRol()) setValue("lp", user.legajo);
    cargarOperativo();
  }, []);

  const getMotivo = () => {
    return (
      motivos.find((motivo) => motivo.id == getValues("motivo"))?.motivo || ""
    );
  };

  const showSnackbar = (severity, message) => {
    setResponse({ severity, message });
    setOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const cargarOperativo = () => {
    try {
      const operativos = JSON.parse(localStorage.diario);
      if (DateTime.now().toMillis() < operativos.expiresAt) {
        Object.entries(operativos).forEach(([key, value]) => {
          if (key === "fecha") setValue(key, DateTime.fromISO(value));
          else setValue(key, value);
        });
        isCompleted(operativos) && setActiveStep(1);
      } else nuevoOperativo();
    } catch (error) {
      return;
    }
  };

  const nuevoOperativo = () => {
    localStorage.removeItem("diario");
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

  return (
    <Layout
      steps={steps()}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      nuevoOperativo={nuevoOperativo}
      handleClose={handleClose}
      isValid={isValid}
      handleSubmit={handleSubmit(submitting)}
      isCompleted={isCompleted}
    >
      <div
        className={`${style.form__box__inputs} ${
          activeStep !== 0 ? style.hidden : ""
        }`}
      >
        <CustomDatePicker
          control={control}
          label="Fecha"
          name="fecha"
          defaultValue={!handleRol() ? DateTime.now().setLocale("es-AR") : null}
          disabled={!handleRol()}
        />
        <CustomTextField
          control={control}
          name="direccion"
          disabled={!checkPath()}
          rules={{ required: "Ingrese una direccion valida" }}
          label="Direccion"
          defaultValue={!checkPath() ? "PASEO DE LA COSTA" : ""}
        />
        <CustomSelect
          control={control}
          name="turno"
          rules={{ required: "Elija una opcion" }}
          label="Turno"
          defaultValue={!handleRol() ? user.turno : ""}
          disabled={!handleRol()}
          options={turnos}
        />
        {handleRol() && (
          <CustomTextField
            type="number"
            control={control}
            name="lp"
            rules={{
              required: {
                value: handleRol(),
                message: "Inserte un legajo valido",
              },
              pattern: {
                value: LEGAJO_PATTERN,
                message: "Inserte un legajo valido",
              },
            }}
            label="Legajo planilla"
          />
        )}
      </div>
      <div
        className={`${style.form__box__inputs} ${
          activeStep !== 1 ? style.hidden : ""
        }`}
      >
        <CustomTimePicker
          control={control}
          name="hora"
          label="Hora"
          defaultValue={!handleRol() ? DateTime.now().setLocale("es-AR") : null}
          disabled={!handleRol()}
        />

        <CustomTextField
          control={control}
          name="dominio"
          label="Dominio"
          rules={{
            required: "Ingrese una patente valida",
            pattern: {
              value: DOMINIO_PATTERN,
              message: "Ingrese una patente valida",
            },
          }}
        />

        <CustomSelect
          control={control}
          name="resolucion"
          rules={{ required: "Elija una opcion valida" }}
          label="Resolucion"
          options={resolucion}
        />
        {getValues("resolucion") == "ACTA" && (
          <CustomTextField
            type="number"
            control={control}
            name="acta"
            rules={{
              required: {
                value: getValues("resolucion") == "ACTA",
                message: "Ingrese un Nro de Acta valido",
              },
            }}
            label="Acta"
          />
        )}
        <CustomSelect
          control={control}
          name="motivo"
          rules={{ required: "Elija una opcion" }}
          label="Motivo"
          options={motivos}
        />
        {motivos.length > 0 && getMotivo() == "OTRO" && (
          <CustomTextField
            control={control}
            name="otroMotivo"
            rules={{
              required: {
                value: getMotivo() == "OTRO",
                message: "Inserte un motivo valido",
              },
            }}
            label="Otro motivo"
          />
        )}
        <CustomAutocomplete
          control={control}
          name="localidadInfractor"
          rules={{ required: "Elija una opcion" }}
          label="Localidad del infractor"
          options={localidades}
        />
      </div>
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </Layout>
  );
}

export default ControlDiarioForm;
